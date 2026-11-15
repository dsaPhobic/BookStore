namespace BookStoreFullStackNg.Data.Constants;

public static class OrderStatusExtensions
{
    /// <summary>Human readable label shown to customers and admins.</summary>
    public static string ToDisplayLabel(this OrderStatus status) => status switch
    {
        OrderStatus.Pending => "Pending",
        OrderStatus.Processing => "Processing",
        OrderStatus.Shipped => "Shipped",
        OrderStatus.Delivered => "Delivered",
        OrderStatus.Cancelled => "Cancelled",
        _ => "Unknown"
    };
}
