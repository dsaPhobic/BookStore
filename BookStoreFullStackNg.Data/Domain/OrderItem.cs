namespace BookStoreFullStackNg.Data.Domain;

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public int BookId { get; set; }
    public Book Book { get; set; } = null!;

    public int Quantity { get; set; }
    public double Price { get; set; }

}
