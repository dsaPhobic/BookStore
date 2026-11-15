using System.Globalization;
using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Api.Helpers;
using BookStoreFullStackNg.Api.Hubs;
using BookStoreFullStackNg.Api.Models;
using BookStoreFullStackNg.Api.Services;
using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.DTOs.Common;
using BookStoreFullStackNg.Data.DTOs.Order;
using BookStoreFullStackNg.Data.Helpers;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;

namespace BookStoreFullStackNg.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrdersController : ControllerBase
{
    private static readonly PaymentMethod[] DevelopmentPaymentMethods =
    [
        PaymentMethod.COD,
        PaymentMethod.NetBanking
    ];

    private static readonly PaymentMethod[] ProductionPaymentMethods =
    [
        PaymentMethod.COD
    ];

    private readonly IOrderRepository _orderRepository;
    private readonly IUserRepository _userRepository;
    private readonly bool _isDevelopment;
    private readonly IHubContext<NotificationHub> _notificationHub;
    private readonly ILogger<OrdersController> _logger;
    private readonly ISePayCheckoutService? _sePayCheckoutService;
    public OrdersController(
        IOrderRepository orderRepository,
        IUserRepository userRepository,
        IHubContext<NotificationHub> notificationHub,
        ILogger<OrdersController> logger,
        IHostEnvironment? hostEnvironment = null,
        ISePayCheckoutService? sePayCheckoutService = null)
    {
        _orderRepository = orderRepository;
        _userRepository = userRepository;
        _isDevelopment = hostEnvironment?.IsDevelopment() ?? false;
        _notificationHub = notificationHub;
        _logger = logger;
        _sePayCheckoutService = sePayCheckoutService;
    }

    [HttpGet("payment-methods")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetPaymentMethods()
    {
        var paymentMethods = GetAvailablePaymentMethods()
            .Select(method => new PaymentMethodModel
            {
                Value = (int)method,
                Name = method.ToString()
            });
        return Ok(paymentMethods);
    }

    [HttpGet("shipping-rates")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetShippingRates() => Ok(ShippingPricing.Rates);

    [HttpPost]
    public async Task<IActionResult> CreateOrder(OrderCreateDto orderToCreate)
    {
        if (string.IsNullOrWhiteSpace(orderToCreate.ShippingAddress))
        {
            throw new BadRequestException("Shipping address is required");
        }

        if (!Enum.IsDefined(orderToCreate.ShippingZone))
        {
            throw new BadRequestException("Unsupported shipping zone");
        }

        var paymentMethod = (PaymentMethod)orderToCreate.PaymentMethod;
        if (!GetAvailablePaymentMethods().Contains(paymentMethod))
        {
            throw new BadRequestException("Unsupported payment method");
        }

        // get userId from userName
        string? username = User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            throw new BadRequestException("User is not logged in");
        }

        var user = await _userRepository.GetUserByUserNameAsync(username);
        if (user == null)
        {
            throw new BadRequestException("User is not logged in");
        }

        var order = await _orderRepository.CreateOrder(user.Id, orderToCreate);
        if (paymentMethod == PaymentMethod.NetBanking)
        {
            var sePay = _sePayCheckoutService
                ?? throw new InvalidOperationException("SePay checkout service is unavailable.");
            var amountVnd = sePay.ConvertUsdToVnd(order.Payment.Amount);
            if (!await _orderRepository.SetSePayAmount(order.Id, user.Id, amountVnd))
            {
                throw new InvalidOperationException("Could not prepare the SePay payment amount.");
            }

            return Ok(new SePayOrderCreatedDto(order.Id, amountVnd));
        }

        return NoContent();
    }

    [HttpGet("{orderId:int}/sepay-checkout")]
    public async Task<IActionResult> GetSePayCheckout(int orderId)
    {
        if (!_isDevelopment || _sePayCheckoutService?.IsConfigured != true)
        {
            return NotFound();
        }

        var username = User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            throw new BadRequestException("User is not logged in");
        }

        var user = await _userRepository.GetUserByUserNameAsync(username);
        if (user == null)
        {
            throw new BadRequestException("User is not logged in");
        }

        var order = await _orderRepository.GetOrderById(orderId);
        if (order is null || order.UserId != user.Id)
        {
            return NotFound();
        }

        if (order.Payment.Method != PaymentMethod.NetBanking ||
            order.Payment.Status != PaymentStatus.Pending ||
            order.Payment.GatewayAmountVnd is null)
        {
            return Conflict();
        }

        return Ok(_sePayCheckoutService.CreateCheckoutSession(order));
    }

    [HttpGet("{orderId:int}/payment-status")]
    public async Task<IActionResult> GetPaymentStatus(int orderId)
    {
        var username = User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            throw new BadRequestException("User is not logged in");
        }

        var user = await _userRepository.GetUserByUserNameAsync(username);
        if (user is null)
        {
            throw new BadRequestException("User is not logged in");
        }

        var order = await _orderRepository.GetOrderById(orderId);
        if (order is null ||
            order.UserId != user.Id ||
            order.Payment.Method != PaymentMethod.NetBanking)
        {
            return NotFound();
        }

        return Ok(new OrderPaymentStatusDto(order.Id, order.Payment.Status.ToString()));
    }

    [AllowAnonymous]
    [HttpPost("sepay-ipn")]
    public async Task<IActionResult> SePayIpn([FromBody] SePayIpnRequest notification)
    {
        var sePay = _sePayCheckoutService;
        if (sePay?.IsConfigured != true)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable);
        }

        if (!sePay.IsValidIpnSecret(Request.Headers["X-Secret-Key"].ToString()))
        {
            return Unauthorized();
        }

        if (notification.Timestamp <= 0)
        {
            return BadRequest();
        }

        if (!string.Equals(notification.NotificationType, "ORDER_PAID", StringComparison.Ordinal) &&
            !string.Equals(notification.NotificationType, "TRANSACTION_VOID", StringComparison.Ordinal))
        {
            return Ok(new { success = true });
        }

        var orderNotice = notification.Order;
        var transaction = notification.Transaction;
        if (orderNotice is null ||
            transaction is null ||
            !string.Equals(orderNotice.Currency, "VND", StringComparison.OrdinalIgnoreCase) ||
            !string.Equals(transaction.Currency, "VND", StringComparison.OrdinalIgnoreCase) ||
            !sePay.TryGetOrderId(orderNotice.InvoiceNumber, out var orderId) ||
            !decimal.TryParse(
                orderNotice.Amount,
                NumberStyles.Number,
                CultureInfo.InvariantCulture,
                out var orderAmount) ||
            !decimal.TryParse(
                transaction.Amount,
                NumberStyles.Number,
                CultureInfo.InvariantCulture,
                out var transactionAmount) ||
            orderAmount <= 0 ||
            orderAmount != transactionAmount ||
            orderAmount != decimal.Truncate(orderAmount))
        {
            _logger.LogWarning(
                "Rejected invalid SePay IPN for invoice {InvoiceNumber}",
                notification.Order?.InvoiceNumber);
            return BadRequest();
        }

        var amountVnd = decimal.ToInt64(orderAmount);
        var paymentUpdated = notification.NotificationType switch
        {
            "ORDER_PAID" =>
                string.Equals(orderNotice.Status, "CAPTURED", StringComparison.Ordinal) &&
                string.Equals(transaction.Type, "PAYMENT", StringComparison.Ordinal) &&
                string.Equals(transaction.Status, "APPROVED", StringComparison.Ordinal) &&
                await _orderRepository.CompleteSePayPayment(orderId, amountVnd),
            "TRANSACTION_VOID" =>
                await _orderRepository.FailSePayPayment(orderId, amountVnd),
            _ => true
        };

        if (!paymentUpdated)
        {
            _logger.LogWarning(
                "Could not match SePay payment for order {OrderId} and amount {AmountVnd}",
                orderId,
                amountVnd);
            return Conflict();
        }

        return Ok(new { success = true });
    }

    private IEnumerable<PaymentMethod> GetAvailablePaymentMethods() =>
        _isDevelopment && _sePayCheckoutService?.IsConfigured == true
            ? DevelopmentPaymentMethods
            : ProductionPaymentMethods;

    [HttpGet("user-orders")]
    [HttpGet("my-orders")]
    public async Task<IActionResult> GetUserOrders([FromQuery]UserOrdersQueryParameters queryParams)
    {
        string? username = User?.Identity?.Name;
        if (string.IsNullOrEmpty(username))
        {
            throw new BadRequestException("User is not logged in");
        }

        var user = await _userRepository.GetUserByUserNameAsync(username);
        if (user == null)
        {
            throw new BadRequestException($"User account '{username}' was not found");
        }
        var pagedOrders = await _orderRepository.UserOrder(user.Id,queryParams);
        var orders = pagedOrders.Items.ToUserOrderDtos();
        var newBookPagedList = new PagedList<UserOrderDto>(orders.ToList(), pagedOrders.TotalCount, pagedOrders.PageNumber, pagedOrders.PageSize);
        return Ok(newBookPagedList);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpGet]
    [HttpGet("customer-orders")]
    public async Task<IActionResult> Orders([FromQuery] UserOrdersQueryParameters queryParams)
    {
       var pagedOrders = await _orderRepository.GetOrders(queryParams);
        var orders = pagedOrders.Items.ToUserOrderDtos();
        var newBookPagedList = new PagedList<UserOrderDto>(orders.ToList(), pagedOrders.TotalCount, pagedOrders.PageNumber, pagedOrders.PageSize);
        return Ok(newBookPagedList);
    }

    [Authorize(Roles =Roles.Admin)]
    [HttpGet("OrderItems/{orderId}")]
    public async Task<IActionResult> GetOrderItems(int orderId)
    {
        var orderItems = await _orderRepository.GetOrderItemsByOrderId(orderId);
        return Ok(orderItems.ToOrderItemDtos());
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpGet("{orderId:int}")]
    public async Task<IActionResult> GetOrder(int orderId)
    {
        var order = await _orderRepository.GetOrderById(orderId);
        if (order is null)
        {
            throw new NotFoundException($"Order with id {orderId} not found");
        }
        return Ok(order.ToUserOrderDto());
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpPut("{orderId:int}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, OrderStatusUpdateDto statusUpdate)
    {
        if (!Enum.IsDefined(typeof(OrderStatus), statusUpdate.OrderStatus))
        {
            throw new BadRequestException("Invalid order status");
        }

        var order = await _orderRepository.GetOrderById(orderId);
        if (order is null)
        {
            throw new NotFoundException($"Order with id {orderId} not found");
        }

        if (order.OrderStatus == statusUpdate.OrderStatus)
        {
            throw new BadRequestException($"Order is already in {order.OrderStatus} status");
        }

        if (!OrderStatusWorkflow.IsTransitionAllowed(order.OrderStatus, statusUpdate.OrderStatus))
        {
            throw new BadRequestException(
                $"Cannot change order status from {order.OrderStatus} to {statusUpdate.OrderStatus}");
        }

        var previousStatus = order.OrderStatus;
        await _orderRepository.UpdateOrderStatus(orderId, statusUpdate.OrderStatus);
        await NotifyCustomerOfStatusChange(order.UserId, orderId, previousStatus, statusUpdate.OrderStatus);
        return NoContent();
    }

    /// <summary>
    /// Pushes the new status to the customer's open SignalR connections.
    /// Notification failures must never undo a status change that was already
    /// persisted, so delivery errors are swallowed.
    /// </summary>
    private async Task NotifyCustomerOfStatusChange(
        int userId,
        int orderId,
        OrderStatus previousStatus,
        OrderStatus orderStatus)
    {
        try
        {
            var customer = await _userRepository.GetUserByIdAsync(userId);
            if (customer is null || string.IsNullOrEmpty(customer.Username))
            {
                return;
            }

            var notification = OrderStatusChangedNotification.Create(
                orderId,
                previousStatus,
                orderStatus,
                DateTime.UtcNow);

            await _notificationHub.Clients
                .User(customer.Username)
                .SendAsync(NotificationHub.OrderStatusChangedEvent, notification);
        }
        catch (Exception ex)
        {
            // The order status is already saved; a missed notification is
            // recoverable the next time the customer opens their orders.
            _logger.LogWarning(
                ex,
                "Could not notify customer {UserId} about the status change of order {OrderId}",
                userId,
                orderId);
        }
    }

}
