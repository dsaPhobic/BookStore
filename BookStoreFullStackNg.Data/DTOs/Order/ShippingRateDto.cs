using BookStoreFullStackNg.Data.Constants;

namespace BookStoreFullStackNg.Data.DTOs.Order;

public class ShippingRateDto
{
    public ShippingZone Zone { get; set; }
    public string Label { get; set; } = string.Empty;
    public double Fee { get; set; }
}
