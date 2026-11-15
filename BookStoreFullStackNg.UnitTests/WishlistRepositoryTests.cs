using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.Reopositories.Implementations;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace BookStoreFullStackNg.UnitTests;

public class WishlistRepositoryTests : IAsyncLifetime
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");
    private BookStoreContext _context = null!;
    private WishlistRepository _repository = null!;
    private User _alice = null!;
    private User _bob = null!;
    private Book _book = null!;

    public async Task InitializeAsync()
    {
        await _connection.OpenAsync();
        var options = new DbContextOptionsBuilder<BookStoreContext>()
            .UseSqlite(_connection)
            .Options;

        _context = new BookStoreContext(options);
        await _context.Database.EnsureCreatedAsync();
        await SeedAsync();
        _repository = new WishlistRepository(_context);
    }

    [Fact]
    public async Task AddAsync_IsIdempotent_ForSameUserAndBook()
    {
        var first = await _repository.AddAsync(_alice.Id, _book.Id);
        var second = await _repository.AddAsync(_alice.Id, _book.Id);

        Assert.Equal(first.Id, second.Id);
        Assert.Equal(1, await _context.WishlistItems.CountAsync());
        Assert.Equal("Wishlist Book", second.Book.Title);
    }

    [Fact]
    public async Task GetByUserIdAsync_ReturnsOnlyCurrentUsersHydratedBooks()
    {
        await _repository.AddAsync(_alice.Id, _book.Id);
        var bobBook = new Book
        {
            Title = "Bob Book",
            Description = "Private to Bob",
            Price = 200,
            PublishedYear = 2024
        };
        _context.Books.Add(bobBook);
        await _context.SaveChangesAsync();
        await _repository.AddAsync(_bob.Id, bobBook.Id);

        var result = await _repository.GetByUserIdAsync(_alice.Id);

        var item = Assert.Single(result);
        Assert.Equal(_alice.Id, item.UserId);
        Assert.Equal(_book.Id, item.BookId);
        Assert.Equal("Wishlist Author", Assert.Single(item.Book.BookAuthors).Author.AuthorName);
        Assert.Equal("Wishlist Genre", Assert.Single(item.Book.BookGenres).Genre.GenreName);
    }

    [Fact]
    public async Task RemoveAsync_CannotRemoveAnotherUsersWishlistItem()
    {
        await _repository.AddAsync(_bob.Id, _book.Id);

        bool removedByAlice = await _repository.RemoveAsync(_alice.Id, _book.Id);
        bool removedByBob = await _repository.RemoveAsync(_bob.Id, _book.Id);

        Assert.False(removedByAlice);
        Assert.True(removedByBob);
        Assert.Empty(await _context.WishlistItems.ToListAsync());
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _connection.DisposeAsync();
    }

    private async Task SeedAsync()
    {
        _alice = new User { Name = "Alice", Username = "alice@example.com" };
        _bob = new User { Name = "Bob", Username = "bob@example.com" };
        _book = new Book
        {
            Title = "Wishlist Book",
            Description = "A wishlisted book",
            Price = 100,
            PublishedYear = 2023,
            BookAuthors =
            [
                new BookAuthor { Author = new Author { AuthorName = "Wishlist Author" } }
            ],
            BookGenres =
            [
                new BookGenre { Genre = new Genre { GenreName = "Wishlist Genre" } }
            ]
        };

        _context.AddRange(_alice, _bob, _book);
        await _context.SaveChangesAsync();
    }
}
