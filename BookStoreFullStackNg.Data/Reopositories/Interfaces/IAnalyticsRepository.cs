using BookStoreFullStackNg.Data.DTOs.Analytics;

namespace BookStoreFullStackNg.Data.Reopositories.Interfaces;

public interface IAnalyticsRepository
{
    Task<DashboardSummaryDto> GetDashboardSummaryAsync();
}
