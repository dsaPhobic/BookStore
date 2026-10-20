using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.DTOs.Cart;

public class CartItemCreateDto
{
    [Required]
    public int BookId { get; set; }
    [Required]
    public int Quantity { get; set; }
}
