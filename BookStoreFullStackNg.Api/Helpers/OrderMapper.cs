using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs;
using BookStoreFullStackNg.Data.DTOs.Order;
using BookStoreFullStackNg.Data.Helpers;

namespace BookStoreFullStackNg.Api.Helpers;

public static class OrderMapper
{
    public static IEnumerable<UserOrderDto> ToUserOrderDtos(this IEnumerable<Order> orders)
    {
        return orders.Select(order =>
        {
            var subTotal = order.OrderItems.Sum(item => item.Price * item.Quantity);
            var pricing = OrderPricing.Calculate(
                subTotal,
                order.TaxInPercent,
                order.DiscountPercent,
                order.DiscountAmount > 0 ? order.DiscountAmount : null);
            var total = order.Payment?.Amount
                ?? pricing.Total;
            var paidLineTotals = OrderPricing.AllocatePaidLineTotals(
                order.OrderItems.Select(item => item.Price * item.Quantity).ToArray(),
                total);

            return new UserOrderDto
            {
                Id = order.Id,
                Name = order.Name,
                Email = order.Email,
                MobileNumber = order.MobileNumber,
                OrderDate = order.OrderDate,
                OrderStatus = order.OrderStatus,
                DiscountPercent = order.DiscountPercent,
                DiscountAmount = order.DiscountAmount,
                CouponCode = order.CouponCode,
                SubTotal = subTotal,
                Tax = pricing.Tax,
                Total = total,
                OrderItems = order.OrderItems.Select((item, index) => new OrderItemDto
                {
                    Id = item.Id,
                    OrderId = item.OrderId,
                    Quantity = item.Quantity,
                    Price = item.Price,
                    PaidTotal = paidLineTotals[index],
                    Book = new BookReadDto
                    {
                        Id = item.Book.Id,
                        Title = item.Book.Title,
                        Description = item.Book.Description,
                        Price = item.Book.Price,
                        ImageUrl = item.Book.ImageUrl,
                        PublishedYear = item.Book.PublishedYear,
                        Authors = item.Book.BookAuthors.Select(ba => new AuthorReadDTO
                        {
                            Id = ba.Author.Id,
                            AuthorName = ba.Author.AuthorName
                        }).ToList(),
                        Genres = item.Book.BookGenres.Select(bg => new GenreReadDto
                        {
                            Id = bg.Genre.Id,
                            GenreName = bg.Genre.GenreName
                        }).ToList()
                    }
                }).ToList()
            };
        });

    }

    public static UserOrderDto ToUserOrderDto(this Order order)
    {
        return new[] { order }.ToUserOrderDtos().Single();
    }

    public static IEnumerable<OrderItemDto> ToOrderItemDtos(this IEnumerable<OrderItem> orderItems)
    {
        return orderItems.Select(item => new OrderItemDto
        {
            Id = item.Id,
            OrderId = item.OrderId,
            Quantity = item.Quantity,
            Price = item.Price,
            PaidTotal = item.Price * item.Quantity,
            Book = new BookReadDto
            {
                Id = item.Book.Id,
                Title = item.Book.Title,
                Description = item.Book.Description,
                Price = item.Book.Price,
                ImageUrl = item.Book.ImageUrl,
                PublishedYear = item.Book.PublishedYear,
                Authors = item.Book.BookAuthors.Select(ba => new AuthorReadDTO
                {
                    Id = ba.Author.Id,
                    AuthorName = ba.Author.AuthorName
                }).ToList(),
                Genres = item.Book.BookGenres.Select(bg => new GenreReadDto
                {
                    Id = bg.Genre.Id,
                    GenreName = bg.Genre.GenreName
                }).ToList()
            }
        }).ToList();

    }


}
