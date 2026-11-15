namespace BookStoreFullStackNg.Data.Domain;

public class WishlistItem
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int BookId { get; set; }
    public Book Book { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
