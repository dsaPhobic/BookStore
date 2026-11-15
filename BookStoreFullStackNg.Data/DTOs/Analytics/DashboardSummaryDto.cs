namespace BookStoreFullStackNg.Data.DTOs.Analytics;

public class DashboardSummaryDto
{
    /// <summary>Revenue of all non-cancelled orders (sub total + tax).</summary>
    public double TotalRevenue { get; set; }

    /// <summary>Revenue of non-cancelled orders placed in the current month.</summary>
    public double RevenueThisMonth { get; set; }

    public int TotalOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int PendingOrders { get; set; }
    public int CancelledOrders { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalBooksSold { get; set; }

    public IReadOnlyCollection<TopSellingBookDto> TopSellingBooks { get; set; } = [];
    public IReadOnlyCollection<RevenueByPeriodDto> RevenueByPeriod { get; set; } = [];
}
