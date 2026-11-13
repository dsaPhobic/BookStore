namespace BookStoreFullStackNg.Data.DTOs.Analytics;

public class TopSellingBookDto
{
    public int BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int QuantitySold { get; set; }
    public double Revenue { get; set; }
}
