using BookStoreFullStackNg.Api.Controllers;
using BookStoreFullStackNg.Api.Hubs;
using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Order;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;

namespace BookStoreFullStackNg.UnitTests;

public class OrdersControllerTests
{
    private const string CustomerUserName = "customer@example.com";

    private readonly IOrderRepository _orderRepository = Substitute.For<IOrderRepository>();
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    private readonly IHubContext<NotificationHub> _hubContext = Substitute.For<IHubContext<NotificationHub>>();
    private readonly IHubClients _hubClients = Substitute.For<IHubClients>();
    private readonly IClientProxy _customerProxy = Substitute.For<IClientProxy>();
    private readonly OrdersController _controller;

    public OrdersControllerTests()
    {
        _hubContext.Clients.Returns(_hubClients);
        _hubClients.User(CustomerUserName).Returns(_customerProxy);
        _controller = new OrdersController(
            _orderRepository,
            _userRepository,
            _hubContext,
            NullLogger<OrdersController>.Instance);
    }

    [Fact]
    public async Task UpdateOrderStatus_NotifiesOrderOwnerWithNewStatus()
    {
        var order = new Order { Id = 42, UserId = 7, OrderStatus = OrderStatus.Pending };
        _orderRepository.GetOrderById(42).Returns(order);
        _userRepository.GetUserByIdAsync(7)
            .Returns(new User { Id = 7, Name = "Customer", Username = CustomerUserName });

        var result = await _controller.UpdateOrderStatus(
            42,
            new OrderStatusUpdateDto { OrderStatus = OrderStatus.Shipped });

        Assert.IsType<NoContentResult>(result);
        await _orderRepository.Received(1).UpdateOrderStatus(42, OrderStatus.Shipped);
        await _customerProxy.Received(1).SendCoreAsync(
            NotificationHub.OrderStatusChangedEvent,
            Arg.Is<object?[]>(args =>
                args.Length == 1 &&
                ((OrderStatusChangedNotification)args[0]!).OrderId == 42 &&
                ((OrderStatusChangedNotification)args[0]!).PreviousStatus == OrderStatus.Pending &&
                ((OrderStatusChangedNotification)args[0]!).OrderStatus == OrderStatus.Shipped),
            Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateOrderStatus_SkipsNotification_WhenOrderOwnerCannotBeResolved()
    {
        var order = new Order { Id = 42, UserId = 7, OrderStatus = OrderStatus.Pending };
        _orderRepository.GetOrderById(42).Returns(order);
        _userRepository.GetUserByIdAsync(7).Returns((User?)null);

        var result = await _controller.UpdateOrderStatus(
            42,
            new OrderStatusUpdateDto { OrderStatus = OrderStatus.Processing });

        Assert.IsType<NoContentResult>(result);
        await _orderRepository.Received(1).UpdateOrderStatus(42, OrderStatus.Processing);
        await _customerProxy.DidNotReceiveWithAnyArgs()
            .SendCoreAsync(default!, default!, default);
    }
}
