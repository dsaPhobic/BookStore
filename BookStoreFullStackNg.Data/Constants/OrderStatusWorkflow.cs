namespace BookStoreFullStackNg.Data.Constants;

/// <summary>
/// Defines the order status workflow:
/// Pending -> Processing -> Shipped -> Delivered, and any non-terminal
/// status can be moved to Cancelled. Forward jumps are allowed, moving
/// backwards is not. Delivered and Cancelled are terminal states.
/// </summary>
public static class OrderStatusWorkflow
{
    private static readonly IReadOnlyDictionary<OrderStatus, OrderStatus[]> AllowedTransitions =
        new Dictionary<OrderStatus, OrderStatus[]>
        {
            [OrderStatus.Pending] =
            [
                OrderStatus.Processing,
                OrderStatus.Shipped,
                OrderStatus.Delivered,
                OrderStatus.Cancelled
            ],
            [OrderStatus.Processing] =
            [
                OrderStatus.Shipped,
                OrderStatus.Delivered,
                OrderStatus.Cancelled
            ],
            [OrderStatus.Shipped] =
            [
                OrderStatus.Delivered,
                OrderStatus.Cancelled
            ],
            [OrderStatus.Delivered] = [],
            [OrderStatus.Cancelled] = []
        };

    public static bool IsTerminal(OrderStatus status) =>
        status is OrderStatus.Delivered or OrderStatus.Cancelled;

    public static IEnumerable<OrderStatus> GetAllowedNextStatuses(OrderStatus current) =>
        AllowedTransitions.TryGetValue(current, out var next) ? next : [];

    public static bool IsTransitionAllowed(OrderStatus current, OrderStatus next) =>
        GetAllowedNextStatuses(current).Contains(next);
}
