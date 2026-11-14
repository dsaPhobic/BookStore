using BookStoreFullStackNg.Data.Domain;

namespace BookStoreFullStackNg.Data.DTOs.Order;

public class OrderCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public int PaymentMethod { get; set; }

    /// <summary>Optional coupon/discount code entered by the user.</summary>
    public string? CouponCode { get; set; }
}
