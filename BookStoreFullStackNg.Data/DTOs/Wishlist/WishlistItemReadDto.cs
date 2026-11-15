using BookStoreFullStackNg.Data.DTOs.Book;

namespace BookStoreFullStackNg.Data.DTOs.Wishlist;

public class WishlistItemReadDto
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public BookReadDto Book { get; set; } = null!;
}
