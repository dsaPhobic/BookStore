
using BookStoreFullStackNg.Data.Constants;

namespace BookStoreFullStackNg.Data.Domain;

public class Payment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public PaymentMethod Method { get; set; }
    public PaymentStatus Status { get; set; }
    public DateTime PaymentDate { get; set; }
    public double Amount { get; set; }
}
