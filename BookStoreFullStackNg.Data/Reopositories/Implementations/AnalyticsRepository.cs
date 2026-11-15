using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Analytics;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookStoreFullStackNg.Data.Reopositories.Implementations;

public class AnalyticsRepository : IAnalyticsRepository
{
    private const int TopSellingBooksCount = 5;
    private const int RevenuePeriodMonths = 6;

    private readonly BookStoreContext _context;

    public AnalyticsRepository(BookStoreContext context)
    {
        _context = context;
    }

    public async Task<DashboardSummaryDto> GetDashboardSummaryAsync()
    {
        var orders = await _context.Orders
            .AsNoTracking()
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Book)
            .ToListAsync();

        // Cancelled orders do not contribute to revenue / units sold.
        var countedOrders = orders
            .Where(o => o.OrderStatus != OrderStatus.Cancelled)
            .ToList();

        var now = DateTime.UtcNow;
        var currentMonthStart = new DateTime(now.Year, now.Month, 1);
        var firstMonth = currentMonthStart.AddMonths(-(RevenuePeriodMonths - 1));

        var summary = new DashboardSummaryDto
        {
            TotalRevenue = countedOrders.Sum(OrderTotal),
            TotalOrders = orders.Count,
            CompletedOrders = orders.Count(o => o.OrderStatus == OrderStatus.Delivered),
            PendingOrders = orders.Count(o => o.OrderStatus is OrderStatus.Pending or OrderStatus.Processing),
            CancelledOrders = orders.Count(o => o.OrderStatus == OrderStatus.Cancelled),
            TotalCustomers = orders.Select(o => o.UserId).Distinct().Count(),
            TotalBooksSold = countedOrders.SelectMany(o => o.OrderItems).Sum(i => i.Quantity),
            TopSellingBooks = countedOrders
                .SelectMany(o => o.OrderItems)
                .GroupBy(i => new { i.BookId, i.Book.Title, i.Book.ImageUrl })
                .Select(g => new TopSellingBookDto
                {
                    BookId = g.Key.BookId,
                    Title = g.Key.Title,
                    ImageUrl = g.Key.ImageUrl,
                    QuantitySold = g.Sum(i => i.Quantity),
                    Revenue = g.Sum(i => i.Price * i.Quantity)
                })
                .OrderByDescending(b => b.QuantitySold)
                .ThenByDescending(b => b.Revenue)
                .Take(TopSellingBooksCount)
                .ToList(),
            RevenueByPeriod = Enumerable.Range(0, RevenuePeriodMonths)
                .Select(offset => firstMonth.AddMonths(offset))
                .Select(month => new RevenueByPeriodDto
                {
                    Period = month.ToString("yyyy-MM"),
                    Label = month.ToString("MMM yyyy"),
                    Revenue = countedOrders.Where(o => IsInMonth(o, month)).Sum(OrderTotal),
                    Orders = orders.Count(o => IsInMonth(o, month))
                })
                .ToList()
        };

        summary.RevenueThisMonth = summary.RevenueByPeriod
            .FirstOrDefault(p => p.Period == currentMonthStart.ToString("yyyy-MM"))?.Revenue ?? 0;

        return summary;
    }

    private static bool IsInMonth(Order order, DateTime month) =>
        order.OrderDate.Year == month.Year && order.OrderDate.Month == month.Month;

    private static double OrderTotal(Order order) =>
        order.OrderItems.Sum(i => i.Price * i.Quantity) * (1 + order.TaxInPercent / 100);
}
