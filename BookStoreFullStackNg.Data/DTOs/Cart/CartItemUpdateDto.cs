using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.DTOs.Cart;

public class CartItemUpdateDto
{
    [Required]
    public int Id { get; set; }
    [Required]
    public int CartId { get; set; }
    [Required]
    public int Quantity { get; set; }
    [Required]
    public int BookId { get; set; }
}
