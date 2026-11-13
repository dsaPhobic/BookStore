namespace BookStoreFullStackNg.Data.DTOs.Analytics;

public class RevenueByPeriodDto
{
    /// <summary>Machine friendly period key, e.g. "2026-11".</summary>
    public string Period { get; set; } = string.Empty;

    /// <summary>Display label, e.g. "Nov 2026".</summary>
    public string Label { get; set; } = string.Empty;

    public double Revenue { get; set; }
    public int Orders { get; set; }
}
