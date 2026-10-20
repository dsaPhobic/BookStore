using BookStoreFullStackNg.Data.DTOs.Common;

namespace BookStoreFullStackNg.Data.DTOs.Order;

public class UserOrdersQueryParameters:QueryParameters
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
