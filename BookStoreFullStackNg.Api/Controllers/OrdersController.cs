using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Api.Helpers;
using BookStoreFullStackNg.Api.Models;
using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.DTOs.Common;
using BookStoreFullStackNg.Data.DTOs.Order;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreFullStackNg.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUserRepository _userRepository;
    public OrdersController(IOrderRepository orderRepository, IUserRepository userRepository)
    {
        _orderRepository = orderRepository;
        _userRepository = userRepository;
    }

    [HttpGet("payment-methods")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetPaymentMethods()
    {
        var paymentStatusList = Enum.GetValues(typeof(PaymentMethod))
                                    .Cast<PaymentMethod>()
                                    .Select(method => new PaymentMethodModel
                                    {
                                        Value = (int)method,
                                        Name = method.ToString()
                                    }).ToList();
        return Ok(paymentStatusList);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(OrderCreateDto orderToCreate)
    {
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

        await _orderRepository.CreateOrder(user.Id, orderToCreate);
        return NoContent();
    }

    [HttpGet("user-orders")]
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
            throw new BadRequestException("User is not logged in");
        }
        var pagedOrders = await _orderRepository.UserOrder(user.Id,queryParams);
        var orders = pagedOrders.Items.ToUserOrderDtos();
        var newBookPagedList = new PagedList<UserOrderDto>(orders.ToList(), pagedOrders.TotalCount, pagedOrders.PageNumber, pagedOrders.PageSize);
        return Ok(newBookPagedList);
    }

    [Authorize(Roles = Roles.Admin)]
    [HttpGet]
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

}
