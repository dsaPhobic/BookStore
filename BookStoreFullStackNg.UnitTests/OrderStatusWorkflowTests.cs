using BookStoreFullStackNg.Data.Constants;

namespace BookStoreFullStackNg.UnitTests;

public class OrderStatusWorkflowTests
{
    [Theory]
    [InlineData(OrderStatus.Pending, OrderStatus.Processing)]
    [InlineData(OrderStatus.Pending, OrderStatus.Shipped)]
    [InlineData(OrderStatus.Processing, OrderStatus.Shipped)]
    [InlineData(OrderStatus.Shipped, OrderStatus.Delivered)]
    [InlineData(OrderStatus.Shipped, OrderStatus.Cancelled)]
    [InlineData(OrderStatus.Pending, OrderStatus.Cancelled)]
    public void IsTransitionAllowed_ReturnsTrue_ForForwardTransitions(
        OrderStatus current, OrderStatus next)
    {
        Assert.True(OrderStatusWorkflow.IsTransitionAllowed(current, next));
    }

    [Theory]
    [InlineData(OrderStatus.Shipped, OrderStatus.Pending)]
    [InlineData(OrderStatus.Delivered, OrderStatus.Shipped)]
    [InlineData(OrderStatus.Cancelled, OrderStatus.Pending)]
    [InlineData(OrderStatus.Delivered, OrderStatus.Cancelled)]
    public void IsTransitionAllowed_ReturnsFalse_ForBackwardOrTerminalTransitions(
        OrderStatus current, OrderStatus next)
    {
        Assert.False(OrderStatusWorkflow.IsTransitionAllowed(current, next));
    }

    [Theory]
    [InlineData(OrderStatus.Delivered)]
    [InlineData(OrderStatus.Cancelled)]
    public void IsTerminal_ReturnsTrue_ForDeliveredAndCancelled(OrderStatus status)
    {
        Assert.True(OrderStatusWorkflow.IsTerminal(status));
    }
}
