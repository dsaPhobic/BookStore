using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.DTOs.Cart;

public class CartItemCreateDto
{
    [Required]
    public int BookId { get; set; }
    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}
