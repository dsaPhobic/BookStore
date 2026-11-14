namespace BookStoreFullStackNg.Data.Domain;

public class Coupon
{
    public int Id { get; set; }

    /// <summary>Unique coupon code (e.g. "SUMMER20")</summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>Discount percentage (e.g. 10 means 10% off)</summary>
    public double DiscountPercent { get; set; }

    /// <summary>Optional maximum discount amount.</summary>
    public double? MaxDiscount { get; set; }

    /// <summary>Whether the coupon is currently active</summary>
    public bool IsActive { get; set; } = true;

    /// <summary>Optional expiry date; null = never expires</summary>
    public DateTime? ExpiryDate { get; set; }

    /// <summary>Maximum number of times this coupon can be used (null = unlimited)</summary>
    public int? MaxUsageCount { get; set; }

    /// <summary>How many times this coupon has been used so far</summary>
    public int UsageCount { get; set; } = 0;

    public bool IsUsable(DateTime utcNow) =>
        IsActive
        && DiscountPercent > 0
        && DiscountPercent <= 100
        && (MaxDiscount == null || (double.IsFinite(MaxDiscount.Value) && MaxDiscount.Value > 0))
        && (ExpiryDate == null || ExpiryDate >= utcNow)
        && (MaxUsageCount == null || UsageCount < MaxUsageCount);
}
