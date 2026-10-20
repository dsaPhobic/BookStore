using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.Domain;

namespace BookStoreFullStackNg.Data.DTOs.Order;

public class UserOrderDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public Payment Payment { get; set; } = null!;
    public double SubTotal { get; set; }
    public double Tax {
        get => SubTotal * (Constants.Tax.TaxInPercent / 100);
    }
    public double Total { 
        get=> SubTotal + Tax;
    }
    public ICollection<OrderItemDto> OrderItems { get; set; } = [];
}
