using AutoMapper;
using BookStoreFullStackNg.Api.Controllers;
using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Common;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using BookStoreFullStackNg.Data.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using NSubstitute;

namespace BookStoreFullStackNg.UnitTests;

public class BooksControllerTests
{
    private readonly IBookRepository _bookRepository;
    private readonly IMapper _mapper;
    private readonly BooksController _controller;
    private readonly IFileService _fileService;
    private readonly IOutputCacheStore _cache;

    private static List<Book> books = new List<Book>
        {
            new Book{Id=1,Title="book1",Description="ddd",Price=400,ImageUrl="abc",PublishedYear=2008},
            new Book{Id=1,Title="book2",Description="ddd2",Price=402,ImageUrl="abc2",PublishedYear=2009},
        };

    public BooksControllerTests()
    {
        _bookRepository = Substitute.For<IBookRepository>();
        _mapper = Substitute.For<IMapper>();
        _fileService = Substitute.For<IFileService>();
        _controller = new BooksController(_mapper, _bookRepository, _fileService);
        _cache= Substitute.For<IOutputCacheStore>();
    }

    [Fact]
    public async Task GetBooks_Returns_Valid_Result()
    {
        // arrange
        var queryParameter = new BookQueryParameter();
        var mockPagedBooks = new PagedList<Book>(books, books.Count, 1, 5);
        _bookRepository.GetBooksAsync(queryParameter).Returns(mockPagedBooks);

        // act
        var result = await _controller.GetBooks(queryParameter);

        // assert

        var okResult = Assert.IsType<OkObjectResult>(result);
        var pagedList = Assert.IsType<PagedList<BookReadDto>>(okResult.Value);
        Assert.Equal(mockPagedBooks.Items.Count(), pagedList.Items.Count());
        Assert.Equal(mockPagedBooks.TotalCount, pagedList.TotalCount);
        Assert.Equal(mockPagedBooks.TotalPages, pagedList.TotalPages);
        Assert.Equal(mockPagedBooks.HasNext, pagedList.HasNext);
        Assert.Equal(mockPagedBooks.HasPrevious, pagedList.HasPrevious);
        Assert.Equal(mockPagedBooks.PageSize, pagedList.PageSize);
    }

    [Fact]
    public async Task CreateBook_Returns_CreatedAtRoute_With_BookReadDto()
    {
        // arrange
        var bookToCreate = new BookCreateDto
        {
            Title = "book1",
            Description = "dddd",
            ImageFile = null,
            Price = 300,
            PublishedYear = 2008,
            GenreIds = [7],
            AuthorIds = [1]
        };
        var createdBookMock = new BookReadDto
        {
            Id = 1,
            Title = "book1",
            Description = "dddd",
            ImageUrl = "",
            Price = 300,
            PublishedYear = 2008,
            Genres = [new GenreReadDto(7, "Programming")],
            Authors = [new AuthorReadDTO(1,"Robert C Martin")
            ]
        };
        _bookRepository.AddBookAsync(bookToCreate).Returns(createdBookMock);

        // act
        var result = await _controller.AddBook(bookToCreate,_cache);

        // Assert
        var createdResult = Assert.IsType<CreatedAtRouteResult>(result);
        Assert.Equal(nameof(_controller.GetBookById), createdResult.RouteName);
        Assert.Equal(1, createdResult.RouteValues["id"]);

        var createdBook = Assert.IsType<BookReadDto>(createdResult.Value);
        Assert.Equal(createdBookMock.Id, createdBook.Id);
    }

    [Fact]
    public async Task UpdateBook_Returns_Ok_With_BookReadModel()
    {
        //arrange
        var bookToUpdate = new BookUpdateDto
        {
            Id = 1,
            Title = "book1",
            Description = "ddd1",
            Price = 120,
            AuthorIds = [1],
            GenreIds = [7],
            ImageUrl = "",
            ImageFile = null,
            PublishedYear = 2008
        };
        var existingBookMock = new BookReadDto
        {
            Id = 1,
            Title = "book1",
            Description = "ddd1",
            Price = 120,
            ImageUrl = "",
            PublishedYear = 2008,
            Genres = [new GenreReadDto(7, "Programming")],
            Authors = [new AuthorReadDTO(1, "Robert C Martin")]
        };
        _bookRepository.GetBookByIdAsync(bookToUpdate.Id).Returns(existingBookMock);

        // act
        var result = await _controller.UpdateBook(bookToUpdate.Id, bookToUpdate, _cache);
        //_bookRepository.GetBookByIdAsync(1).Returns(existingBookMock);

        // assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var bookToReturn = Assert.IsType<BookReadDto>(okResult.Value);
        Assert.Equal(bookToReturn.Id, existingBookMock.Id);

    }

    [Fact]
    public async Task UpdateBook_ThrowsNotFoundException_WhenBookDoesNotExists()
    {
        //arrange
        var bookToUpdate = new BookUpdateDto
        {
            Id = 999,
            Title = "book1",
            Description = "ddd1",
            Price = 120,
            AuthorIds = [1],
            GenreIds = [7],
            ImageUrl = "",
            ImageFile = null,
            PublishedYear = 2008
        };

        // act and assert
        await Assert.ThrowsAsync<NotFoundException>(() => _controller.UpdateBook(bookToUpdate.Id, bookToUpdate, _cache));
    }

    [Fact]
    public async Task UpdateBook_ThrowsBadRequests_WhenIdMismatch()
    {
        //arrange
        var bookToUpdate = new BookUpdateDto
        {
            Id = 999,
            Title = "book1",
            Description = "ddd1",
            Price = 120,
            AuthorIds = [1],
            GenreIds = [7],
            ImageUrl = "",
            ImageFile = null,
            PublishedYear = 2008
        };

        // act & assert
        await Assert.ThrowsAsync<BadRequestException>(() => _controller.UpdateBook(2, bookToUpdate, _cache));
    }

    [Fact]
    public async Task DeleteBook_ReturnsNoContent()
    {
        // arrrange
        var id = 1;
        var existingBookMock = new BookReadDto
        {
            Id = 1,
            Title = "book1",
            Description = "ddd1",
            Price = 120,
            ImageUrl = "",
            PublishedYear = 2008,
            Genres = [new GenreReadDto(7, "Programming")],
            Authors = [new AuthorReadDTO(1, "Robert C Martin")]
        };
        _bookRepository.GetBookByIdAsync(id).Returns(existingBookMock);

        // act 
        var result = await _controller.DeleteBook(id, _cache);

        // assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteBook_Returns_NotFound_IfBookNotExists()
    {
        // arrange
        int id = 999;

        // act & assert
        await Assert.ThrowsAsync<NotFoundException>(() => _controller.DeleteBook(id, _cache));
    }

    [Fact]
    public async Task GetBookById_ReturnsOk_WithBookReadDto()
    {
        // arrange
        var bookMock = new BookReadDto
        {
            Id = 1,
            Title = "book1",
            Description = "ddd1",
            Price = 120,
            ImageUrl = "",
            PublishedYear = 2008,
            Genres = [new GenreReadDto(7, "Programming")],
            Authors = [new AuthorReadDTO(1, "Robert C Martin")]
        };
        _bookRepository.GetBookByIdAsync(1).Returns(bookMock);

        // act
        var result = await _controller.GetBookById(1);

        // assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var book = Assert.IsType<BookReadDto>(okResult.Value);
        Assert.Equal(bookMock.Id, book.Id);
    }

    [Fact]
    public async Task GetBookById_ThrowsNotFoundException_WhenIdDoesNotExists()
    {
        // arrange,act,assert
        await Assert.ThrowsAsync<NotFoundException>(() => _controller.GetBookById(9999));
    }

}
