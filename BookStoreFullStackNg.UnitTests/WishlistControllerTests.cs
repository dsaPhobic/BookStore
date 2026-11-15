using System.Security.Claims;
using BookStoreFullStackNg.Api.Controllers;
using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Wishlist;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;

namespace BookStoreFullStackNg.UnitTests;

public class WishlistControllerTests
{
    private readonly IWishlistRepository _wishlistRepository = Substitute.For<IWishlistRepository>();
    private readonly IUserRepository _userRepository = Substitute.For<IUserRepository>();
    private readonly IBookRepository _bookRepository = Substitute.For<IBookRepository>();
    private readonly WishlistController _controller;
    private readonly User _user = new() { Id = 7, Name = "Alice", Username = "alice@example.com" };

    public WishlistControllerTests()
    {
        _controller = new WishlistController(
            _wishlistRepository,
            _userRepository,
            _bookRepository);
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(
                    [new Claim(ClaimTypes.Name, _user.Username)],
                    "TestAuthentication"))
            }
        };
        _userRepository.GetUserByUserNameAsync(_user.Username).Returns(_user);
    }

    [Fact]
    public async Task AddBook_UsesAuthenticatedUserAndReturnsWishlistItem()
    {
        var bookDto = new BookReadDto { Id = 3, Title = "Book" };
        var item = CreateWishlistItem(11, _user.Id, 3);
        _bookRepository.GetBookByIdAsync(3).Returns(bookDto);
        _wishlistRepository.AddAsync(_user.Id, 3).Returns(item);

        var result = await _controller.AddBook(3);

        var ok = Assert.IsType<OkObjectResult>(result);
        var dto = Assert.IsType<WishlistItemReadDto>(ok.Value);
        Assert.Equal(11, dto.Id);
        Assert.Equal(3, dto.Book.Id);
        await _wishlistRepository.Received(1).AddAsync(_user.Id, 3);
    }

    [Fact]
    public async Task GetWishlist_ReturnsOnlyRepositoryItemsForAuthenticatedUser()
    {
        IReadOnlyList<WishlistItem> items = [CreateWishlistItem(11, _user.Id, 3)];
        _wishlistRepository.GetByUserIdAsync(_user.Id).Returns(items);

        var result = await _controller.GetWishlist();

        var ok = Assert.IsType<OkObjectResult>(result);
        var dto = Assert.IsType<List<WishlistItemReadDto>>(ok.Value);
        Assert.Single(dto);
        await _wishlistRepository.Received(1).GetByUserIdAsync(_user.Id);
    }

    [Fact]
    public async Task RemoveBook_UsesAuthenticatedUser()
    {
        _wishlistRepository.RemoveAsync(_user.Id, 3).Returns(true);

        var result = await _controller.RemoveBook(3);

        Assert.IsType<NoContentResult>(result);
        await _wishlistRepository.Received(1).RemoveAsync(_user.Id, 3);
    }

    [Fact]
    public async Task AddBook_ThrowsNotFound_WhenBookDoesNotExist()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => _controller.AddBook(999));
        await _wishlistRepository.DidNotReceive().AddAsync(Arg.Any<int>(), Arg.Any<int>());
    }

    [Fact]
    public async Task RemoveBook_ThrowsNotFound_WhenItemDoesNotExistForUser()
    {
        _wishlistRepository.RemoveAsync(_user.Id, 3).Returns(false);

        await Assert.ThrowsAsync<NotFoundException>(() => _controller.RemoveBook(3));
    }

    [Fact]
    public async Task GetWishlist_RejectsMissingAuthenticatedIdentity()
    {
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal();

        await Assert.ThrowsAsync<BadRequestException>(() => _controller.GetWishlist());
    }

    private static WishlistItem CreateWishlistItem(int id, int userId, int bookId)
    {
        return new WishlistItem
        {
            Id = id,
            UserId = userId,
            BookId = bookId,
            CreatedAt = DateTime.UtcNow,
            Book = new Book
            {
                Id = bookId,
                Title = "Book",
                Description = "Description",
                Price = 100,
                PublishedYear = 2023
            }
        };
    }
}
