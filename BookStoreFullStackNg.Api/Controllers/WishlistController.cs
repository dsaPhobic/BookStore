using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Wishlist;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreFullStackNg.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly IWishlistRepository _wishlistRepository;
    private readonly IUserRepository _userRepository;
    private readonly IBookRepository _bookRepository;

    public WishlistController(
        IWishlistRepository wishlistRepository,
        IUserRepository userRepository,
        IBookRepository bookRepository)
    {
        _wishlistRepository = wishlistRepository;
        _userRepository = userRepository;
        _bookRepository = bookRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetWishlist()
    {
        int userId = await GetCurrentUserIdAsync();
        var items = await _wishlistRepository.GetByUserIdAsync(userId);
        return Ok(items.Select(ToReadDto).ToList());
    }

    [HttpPost("{bookId:int}")]
    public async Task<IActionResult> AddBook(int bookId)
    {
        int userId = await GetCurrentUserIdAsync();
        var book = await _bookRepository.GetBookByIdAsync(bookId);
        if (book == null)
        {
            throw new NotFoundException($"Book with id:{bookId} does not found");
        }

        var item = await _wishlistRepository.AddAsync(userId, bookId);
        return Ok(ToReadDto(item));
    }

    [HttpDelete("{bookId:int}")]
    public async Task<IActionResult> RemoveBook(int bookId)
    {
        int userId = await GetCurrentUserIdAsync();
        bool removed = await _wishlistRepository.RemoveAsync(userId, bookId);
        if (!removed)
        {
            throw new NotFoundException($"Book with id:{bookId} is not in your wishlist");
        }

        return NoContent();
    }

    private async Task<int> GetCurrentUserIdAsync()
    {
        string? username = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(username))
        {
            throw new BadRequestException("User is not logged in");
        }

        User? user = await _userRepository.GetUserByUserNameAsync(username);
        if (user == null)
        {
            throw new BadRequestException("Invalid username");
        }

        return user.Id;
    }

    private static WishlistItemReadDto ToReadDto(WishlistItem item)
    {
        return new WishlistItemReadDto
        {
            Id = item.Id,
            CreatedAt = item.CreatedAt,
            Book = new BookReadDto
            {
                Id = item.Book.Id,
                Title = item.Book.Title,
                Description = item.Book.Description,
                Price = item.Book.Price,
                PublishedYear = item.Book.PublishedYear,
                ImageUrl = item.Book.ImageUrl,
                Authors = item.Book.BookAuthors
                    .Select(bookAuthor => new AuthorReadDTO(
                        bookAuthor.Author.Id,
                        bookAuthor.Author.AuthorName))
                    .ToList(),
                Genres = item.Book.BookGenres
                    .Select(bookGenre => new GenreReadDto(
                        bookGenre.Genre.Id,
                        bookGenre.Genre.GenreName))
                    .ToList()
            }
        };
    }
}
