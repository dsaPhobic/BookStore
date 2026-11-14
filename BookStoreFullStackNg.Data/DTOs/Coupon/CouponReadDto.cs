namespace BookStoreFullStackNg.Data.DTOs.Coupon;

public class CouponReadDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public double DiscountPercent { get; set; }
    public double? MaxDiscount { get; set; }
    public bool IsActive { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public int? MaxUsageCount { get; set; }
    public int UsageCount { get; set; }
}
