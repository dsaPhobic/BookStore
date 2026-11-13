using BookStoreFullStackNg.Data.DTOs.Analytics;
using System.Net;
using System.Net.Http.Json;

namespace BookStoreFullStackNg.IntegratedTests;

[Collection("Test Collection")]
public class AnalyticsControllerTests
{
    private readonly HttpClient _client;
    private readonly string _url = "api/analytics";

    public AnalyticsControllerTests(CustomWebApplicationFactory webApplicationFactory)
    {
        _client = webApplicationFactory.CreateClient();
    }

    [Fact]
    public async Task GetDashboardSummary_ReturnsOk_ForAdmin()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");

        // Act
        var response = await _client.GetAsync($"{_url}/dashboard-summary");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var summary = await response.Content.ReadFromJsonAsync<DashboardSummaryDto>();
        Assert.NotNull(summary);
        Assert.True(summary.TotalOrders > 0);
        Assert.NotEmpty(summary.TopSellingBooks);
        Assert.Equal(6, summary.RevenueByPeriod.Count);
    }

    [Fact]
    public async Task GetDashboardSummary_ReturnsForbidden_ForNonAdmin()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "User");

        // Act
        var response = await _client.GetAsync($"{_url}/dashboard-summary");

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
