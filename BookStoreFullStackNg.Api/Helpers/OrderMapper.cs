using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs;
using BookStoreFullStackNg.Data.DTOs.Order;

namespace BookStoreFullStackNg.Api.Helpers;

public static class OrderMapper
{
    public static IEnumerable<UserOrderDto> ToUserOrderDtos(this IEnumerable<Order> orders)
    {
        return orders.Select(order => new UserOrderDto
        {
            Id = order.Id,
            Name = order.Name,
            Email = order.Email,
            MobileNumber = order.MobileNumber,
            OrderDate = order.OrderDate,
            OrderStatus = order.OrderStatus,
            SubTotal = order.OrderItems.Sum(oi => (oi.Price * oi.Quantity)),
            OrderItems = order.OrderItems.Select(item => new OrderItemDto
            {
                Id = item.Id,
                OrderId = item.OrderId,
                Quantity = item.Quantity,
                Price = item.Price,
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
        });

    }

    public static IEnumerable<OrderItemDto> ToOrderItemDtos(this IEnumerable<OrderItem> orderItems)
    {
        return orderItems.Select(item => new OrderItemDto
        {
            Id = item.Id,
            OrderId = item.OrderId,
            Quantity = item.Quantity,
            Price = item.Price,
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
