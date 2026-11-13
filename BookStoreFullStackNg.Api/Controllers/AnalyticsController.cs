using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreFullStackNg.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = Roles.Admin)]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsRepository _analyticsRepository;

    public AnalyticsController(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    [HttpGet("dashboard-summary")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboardSummary()
    {
        var summary = await _analyticsRepository.GetDashboardSummaryAsync();
        return Ok(summary);
    }
}
