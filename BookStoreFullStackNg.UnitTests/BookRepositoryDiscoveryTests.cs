using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Common;
using BookStoreFullStackNg.Data.Reopositories.Implementations;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace BookStoreFullStackNg.UnitTests;

public class BookRepositoryDiscoveryTests : IAsyncLifetime
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");
    private BookStoreContext _context = null!;
    private BookRepository _repository = null!;

    public async Task InitializeAsync()
    {
        await _connection.OpenAsync();
        var options = new DbContextOptionsBuilder<BookStoreContext>()
            .UseSqlite(_connection)
            .Options;

        _context = new BookStoreContext(options);
        await _context.Database.EnsureCreatedAsync();
        await SeedCatalogAsync();
        _repository = new BookRepository(_context);
    }

    [Fact]
    public async Task GetBooksAsync_SearchesByTitleOrAuthorName()
    {
        var byTitle = await _repository.GetBooksAsync(new BookQueryParameter
        {
            SearchTerm = "  clean  "
        });
        var byAuthor = await _repository.GetBooksAsync(new BookQueryParameter
        {
            SearchTerm = "robert"
        });

        Assert.Single(byTitle.Items);
        Assert.Equal("Clean Architecture", byTitle.Items[0].Title);
        Assert.Single(byAuthor.Items);
        Assert.Equal("Clean Architecture", byAuthor.Items[0].Title);
    }

    [Fact]
    public async Task GetBooksAsync_AppliesOneSidedYearAndPriceFilters()
    {
        var publishedFrom = await _repository.GetBooksAsync(new BookQueryParameter
        {
            PublishedFrom = 2020,
            MaxPrice = 500
        });
        var publishedTo = await _repository.GetBooksAsync(new BookQueryParameter
        {
            PublishedTo = 2018,
            MinPrice = 600
        });

        Assert.Single(publishedFrom.Items);
        Assert.Equal("Modern Design", publishedFrom.Items[0].Title);
        Assert.Single(publishedTo.Items);
        Assert.Equal("Data Systems", publishedTo.Items[0].Title);
    }

    [Fact]
    public async Task GetBooksAsync_FiltersByAnySelectedGenre()
    {
        var result = await _repository.GetBooksAsync(new BookQueryParameter
        {
            GenreIds = [2, 3]
        });

        Assert.Equal(2, result.TotalCount);
        Assert.Contains(result.Items, book => book.Title == "Data Systems");
        Assert.Contains(result.Items, book => book.Title == "Modern Design");
    }

    [Theory]
    [InlineData("title desc", "Modern Design", "Clean Architecture")]
    [InlineData("price asc", "Modern Design", "Data Systems")]
    [InlineData("price desc", "Data Systems", "Modern Design")]
    [InlineData("publishedYear asc", "Clean Architecture", "Modern Design")]
    [InlineData("publishedYear desc", "Modern Design", "Clean Architecture")]
    public async Task GetBooksAsync_SortsUsingAllowedCatalogFields(
        string sortBy,
        string expectedFirst,
        string expectedLast)
    {
        var result = await _repository.GetBooksAsync(new BookQueryParameter
        {
            SortBy = sortBy
        });

        Assert.Equal(expectedFirst, result.Items.First().Title);
        Assert.Equal(expectedLast, result.Items.Last().Title);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("description desc")]
    public async Task GetBooksAsync_UsesStableTitleOrder_ForMissingOrUnsupportedSort(
        string? sortBy)
    {
        var result = await _repository.GetBooksAsync(new BookQueryParameter
        {
            SortBy = sortBy
        });

        Assert.Equal(
            ["Clean Architecture", "Data Systems", "Modern Design"],
            result.Items.Select(book => book.Title));
    }

    [Fact]
    public async Task GetBooksAsync_ReturnsStablePagingMetadataAndEmptyOutOfRangePage()
    {
        var firstPage = await _repository.GetBooksAsync(new BookQueryParameter
        {
            PageNumber = 1,
            PageSize = 2
        });
        var secondPage = await _repository.GetBooksAsync(new BookQueryParameter
        {
            PageNumber = 2,
            PageSize = 2
        });
        var emptyPage = await _repository.GetBooksAsync(new BookQueryParameter
        {
            PageNumber = 3,
            PageSize = 2
        });

        Assert.Equal(3, firstPage.TotalCount);
        Assert.Equal(2, firstPage.TotalPages);
        Assert.False(firstPage.HasPrevious);
        Assert.True(firstPage.HasNext);
        Assert.Equal(["Clean Architecture", "Data Systems"], firstPage.Items.Select(book => book.Title));

        Assert.True(secondPage.HasPrevious);
        Assert.False(secondPage.HasNext);
        Assert.Equal("Modern Design", Assert.Single(secondPage.Items).Title);

        Assert.Empty(emptyPage.Items);
        Assert.Equal(3, emptyPage.TotalCount);
        Assert.Equal(2, emptyPage.TotalPages);
    }

    [Fact]
    public void BookQueryParameter_CapsPageSizeAtFifty()
    {
        var query = new BookQueryParameter { PageSize = 1_000 };

        Assert.Equal(50, query.PageSize);
    }

    [Fact]
    public async Task GetBooksAsync_CombinesSearchFiltersSortAndPaging()
    {
        var result = await _repository.GetBooksAsync(new BookQueryParameter
        {
            SearchTerm = "martin",
            GenreIds = [1, 2],
            PublishedTo = 2018,
            MinPrice = 500,
            SortBy = "price desc",
            PageNumber = 2,
            PageSize = 1
        });

        Assert.Equal(2, result.TotalCount);
        Assert.Equal(2, result.TotalPages);
        Assert.Equal(2, result.PageNumber);
        Assert.Equal(1, result.PageSize);
        Assert.Equal("Clean Architecture", Assert.Single(result.Items).Title);
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();
        await _connection.DisposeAsync();
    }

    private async Task SeedCatalogAsync()
    {
        var martin = new Author { AuthorName = "Robert C. Martin" };
        var kleppmann = new Author { AuthorName = "Martin Kleppmann" };
        var designer = new Author { AuthorName = "Jane Designer" };
        var programming = new Genre { GenreName = "Programming" };
        var data = new Genre { GenreName = "Data" };
        var design = new Genre { GenreName = "Design" };

        var books = new[]
        {
            new Book
            {
                Title = "Clean Architecture",
                Description = "Architecture principles",
                Price = 550,
                PublishedYear = 2017,
                BookAuthors = [new BookAuthor { Author = martin }],
                BookGenres = [new BookGenre { Genre = programming }]
            },
            new Book
            {
                Title = "Data Systems",
                Description = "Distributed data systems",
                Price = 650,
                PublishedYear = 2018,
                BookAuthors = [new BookAuthor { Author = kleppmann }],
                BookGenres = [new BookGenre { Genre = data }]
            },
            new Book
            {
                Title = "Modern Design",
                Description = "Modern product design",
                Price = 450,
                PublishedYear = 2022,
                BookAuthors = [new BookAuthor { Author = designer }],
                BookGenres = [new BookGenre { Genre = design }]
            }
        };

        _context.Books.AddRange(books);
        await _context.SaveChangesAsync();
    }
}
