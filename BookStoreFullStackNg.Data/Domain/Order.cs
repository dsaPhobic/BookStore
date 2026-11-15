using BookStoreFullStackNg.Data.Constants;

namespace BookStoreFullStackNg.Data.Domain;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public double TaxInPercent { get; set; }
    /// <summary>Discount percentage applied via coupon (0 if none).</summary>
    public double DiscountPercent { get; set; } = 0;
    public double DiscountAmount { get; set; } = 0;
    /// <summary>Coupon code used, if any.</summary>
    public string? CouponCode { get; set; }
    public User User { get; set; } = null!;
    public DateTime OrderDate { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public Payment Payment { get; set; } = null!;
    public ICollection<OrderItem> OrderItems { get; set; } = [];
}
