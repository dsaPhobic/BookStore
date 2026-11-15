using BookStoreFullStackNg.Data.Constants;

namespace BookStoreFullStackNg.Data.DTOs.Order;

/// <summary>
/// Payload pushed to a customer over SignalR when an admin changes the
/// status of one of their orders.
/// </summary>
public class OrderStatusChangedNotification
{
    public int OrderId { get; set; }

    public OrderStatus PreviousStatus { get; set; }

    public OrderStatus OrderStatus { get; set; }

    public string PreviousStatusLabel { get; set; } = string.Empty;

    public string OrderStatusLabel { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; }

    public string Message { get; set; } = string.Empty;

    public static OrderStatusChangedNotification Create(
        int orderId,
        OrderStatus previousStatus,
        OrderStatus orderStatus,
        DateTime updatedAt)
    {
        return new OrderStatusChangedNotification
        {
            OrderId = orderId,
            PreviousStatus = previousStatus,
            OrderStatus = orderStatus,
            PreviousStatusLabel = previousStatus.ToDisplayLabel(),
            OrderStatusLabel = orderStatus.ToDisplayLabel(),
            UpdatedAt = updatedAt,
            Message = $"Order #{orderId} is now {orderStatus.ToDisplayLabel()}."
        };
    }
}
