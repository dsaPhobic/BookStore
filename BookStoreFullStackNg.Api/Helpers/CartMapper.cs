using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Cart;
using BookStoreFullStackNg.Data.DTOs;

namespace BookStoreFullStackNg.Api.Helpers;

public static class CartMapper
{
    public static IEnumerable<CartReadDto> MapCartsToCartReadDtos(this IEnumerable<Cart> carts)
    {
        return carts.Select(cart => new CartReadDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            CustomerName=cart.User.Name,
            CartItems = cart.CartItems.Select(item => new CartItemDto
            {
                Id = item.Id,
                CartId = item.CartId,
                Quantity = item.Quantity,
                BookId = item.BookId,
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

    public static CartReadDto MapCartToCartReadDto(this Cart cart)
    {
        return new CartReadDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            CustomerName = cart.User.Name,
            CartItems = cart.CartItems.Select(item => new CartItemDto
            {
                Id = item.Id,
                CartId = item.CartId,
                Quantity = item.Quantity,
                BookId = item.BookId,
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
    }

    public static CartItemDto MapCartItemToCartItemDto(this CartItem item)
    {
        return new CartItemDto
        {
            Id = item.Id,
            CartId = item.CartId,
            Quantity = item.Quantity,
            BookId = item.BookId,
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
        };
    }
}


