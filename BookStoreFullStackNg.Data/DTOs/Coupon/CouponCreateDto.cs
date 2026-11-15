namespace BookStoreFullStackNg.Data.DTOs.Coupon;

public class CouponCreateDto
{
    public string Code { get; set; } = string.Empty;
    public double DiscountPercent { get; set; }
    public double? MaxDiscount { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? ExpiryDate { get; set; }
    public int? MaxUsageCount { get; set; }
}
