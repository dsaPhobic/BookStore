using BookStoreFullStackNg.Data.DTOs.Book;

namespace BookStoreFullStackNg.Data.DTOs.Order;

public class OrderItemDto
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int Quantity { get; set; }
    public double Price { get; set; }
    public BookReadDto Book { get; set; } = null!;
}
