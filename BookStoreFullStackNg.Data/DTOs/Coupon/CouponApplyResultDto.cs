namespace BookStoreFullStackNg.Data.DTOs.Coupon;

/// <summary>Returned when a user successfully applies a coupon.</summary>
public class CouponApplyResultDto
{
    public string Code { get; set; } = string.Empty;
    public double DiscountPercent { get; set; }
    public double Subtotal { get; set; }
    public double DiscountAmount { get; set; }
    public double Tax { get; set; }
    public double Total { get; set; }
    public string Message { get; set; } = string.Empty;
}
