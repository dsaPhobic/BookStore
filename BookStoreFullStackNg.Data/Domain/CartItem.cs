using System.Text.Json.Serialization;

namespace BookStoreFullStackNg.Data.Domain;

public class CartItem
{
    public int Id { get; set; }
    public int CartId { get; set; }
    public int Quantity { get; set; }
    public int BookId { get; set; }

    public Cart Cart { get; set; } = null!;
    public Book Book { get; set; } = null!;
}
