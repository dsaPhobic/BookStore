using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Book;

namespace BookStoreFullStackNg.Data.DTOs.Cart;

public class CartReadDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public ICollection<CartItemDto> CartItems { get; set; } = [];

}

public class CartItemDto
{
    public int Id { get; set; }
    public int CartId { get; set; }
    public int Quantity { get; set; }
    public int BookId { get; set; }

    public BookReadDto Book { get; set; } = null!;
}

