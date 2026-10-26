using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Common;
using System.Net;
using System.Text;
using System.Text.Json;

namespace BookStoreFullStackNg.IntegratedTests;

[Collection("Test Collection")]
public class BooksControllerTests
{
    private readonly CustomWebApplicationFactory _webApplicationFactory;
    private readonly HttpClient _client;
    private string baseUrl = "api/books";

    public BooksControllerTests(CustomWebApplicationFactory webApplicationFactory)
    {
        _webApplicationFactory = webApplicationFactory;
        _client = webApplicationFactory.CreateClient();
    }

    [Fact]
    public async Task GetBooks_Returns_OkResponse()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);

        // act
        var response = await _client.GetAsync(baseUrl);
        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var books = JsonSerializer.Deserialize<PagedList<BookReadDto>>(responseString, options);

        // assert
        Assert.NotNull(books);
        Assert.NotEmpty(books.Items);
    }

    [Fact]
    public async Task GetBookById_ReturnOk()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);

        // act
        var result = await _client.GetAsync(baseUrl+"/1");
        result.EnsureSuccessStatusCode();
        var stringResult = await result.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var book = JsonSerializer.Deserialize<BookReadDto>(stringResult, options);


        // assert
        Assert.NotNull(book);
    }

    [Fact]
    public async Task GetBookReturns_NotFound_WhenUserDoesNotExist()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);

        // act
        var response = await _client.GetAsync(baseUrl+"/999");

        // assert
        Assert.Equal(HttpStatusCode.NotFound,response.StatusCode);
    }

    [Fact]
    public async Task AddBook_Returns_CreatedAtRoute()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);
        var content = new MultipartFormDataContent
            {
                { new StringContent("Test Book"), "Title" },
                { new StringContent("This is a test description."), "Description" },
                { new StringContent("29.99"), "Price" },
                { new StringContent("2022"), "PublishedYear" },
                { new StreamContent(new MemoryStream(new byte[0])), "ImageFile", "book.jpg" }
            };
        content.Add(new StringContent("1"), "GenreId");
        content.Add(new StringContent("2"), "GenreId");
        content.Add(new StringContent("1"), "AuthorId");

        // act
        using var response = await _client.PostAsync(baseUrl, content);
        response.EnsureSuccessStatusCode();
        var jsonResponse = await response.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var createdBook = JsonSerializer.Deserialize<BookReadDto>(jsonResponse, options);

        // assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);    
        Assert.NotNull(createdBook);
    }

    [Fact]
    public async Task UpdateBook_ReturnsOk_With_BookReadDto()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);
        var content = new MultipartFormDataContent
            {
                { new StringContent("1"), "Id" },
                { new StringContent("Test Book"), "Title" },
                { new StringContent("This is a test description."), "Description" },
                { new StringContent("29.99"), "Price" },
                { new StringContent("2022"), "PublishedYear" },
                { new StringContent(""), "ImageUrl" },
            };
        content.Add(new StringContent("1"), "GenreId");
        content.Add(new StringContent("2"), "GenreId");
        content.Add(new StringContent("1"), "AuthorId");

        // act
        var response = await _client.PutAsync(baseUrl + "/1", content);
        response.EnsureSuccessStatusCode();
        var jsonResponse = await response.Content.ReadAsStringAsync();
        var updatedBook = JsonSerializer.Deserialize<BookReadDto>(jsonResponse);

        // assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(updatedBook);
    }

    [Fact]
    public async Task UpdateBook_ReturnsBadRequest_WhenIdMismatch()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);
        var content = new MultipartFormDataContent
            {
                { new StringContent("1"), "Id" },
                { new StringContent("Test Book"), "Title" },
                { new StringContent("This is a test description."), "Description" },
                { new StringContent("29.99"), "Price" },
                { new StringContent("2022"), "PublishedYear" },
                { new StringContent(""), "ImageUrl" },
            };
        content.Add(new StringContent("1"), "GenreId");
        content.Add(new StringContent("2"), "GenreId");
        content.Add(new StringContent("1"), "AuthorId");

        // act
        var response = await _client.PutAsync(baseUrl + "/2", content);
        
        // assert
        Assert.Equal(HttpStatusCode.BadRequest,response.StatusCode);
    }

    [Fact]
    public async Task UpdateBook_ReturnsNotFound_WhenBookNotFound()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);
        var content = new MultipartFormDataContent
            {
                { new StringContent("999"), "Id" },
                { new StringContent("Test Book"), "Title" },
                { new StringContent("This is a test description."), "Description" },
                { new StringContent("29.99"), "Price" },
                { new StringContent("2022"), "PublishedYear" },
                { new StringContent(""), "ImageUrl" },
            };
        content.Add(new StringContent("1"), "GenreId");
        content.Add(new StringContent("2"), "GenreId");
        content.Add(new StringContent("1"), "AuthorId");

        // act
        var response = await _client.PutAsync(baseUrl + "/999", content);

        // assert
        Assert.Equal(HttpStatusCode.NotFound,response.StatusCode);
    }

    [Fact]
    public async Task DeleteBook_ReturnsNoContent()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);

        // act
        var response = await _client.DeleteAsync(baseUrl + "/2");
        response.EnsureSuccessStatusCode();

        // assert
        Assert.Equal(HttpStatusCode.NoContent,response.StatusCode);
    }

    [Fact]
    public async Task DeleteBook_ReturnsNotFound_WhenBookDoesNotExists()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);

        // act
        var response = await _client.DeleteAsync(baseUrl + "/999");

        // assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

}

