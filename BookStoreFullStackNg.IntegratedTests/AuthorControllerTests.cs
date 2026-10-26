using System.Net;
using System.Text;
using System.Text.Json;
using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Common;

namespace BookStoreFullStackNg.IntegratedTests;

[Collection("Test Collection")]
public class AuthorControllerTests
{
    private readonly CustomWebApplicationFactory _webApplicationFactory;
    private readonly HttpClient _client;
    private string baseUrl = "api/authors";

    public AuthorControllerTests(CustomWebApplicationFactory webApplicationFactory)
    {
        _webApplicationFactory = webApplicationFactory;
        _client = webApplicationFactory.CreateClient();
    }

    [Fact]
    public async Task GetAuthors_Returns_OkResponse()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");

        // Act
        var response = await _client.GetAsync(baseUrl);

        response.EnsureSuccessStatusCode();
        var responseString = await response.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var authors = JsonSerializer.Deserialize<PagedList<AuthorReadDTO>>(responseString, options);

        // Assert
        Assert.NotNull(authors);
        Assert.NotEmpty(authors.Items);
    }

    [Fact]
    public async Task GetAuthor_ReturnsOk_WhenAuthorExists()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");

        // act
        var response = await _client.GetAsync(baseUrl + "/1");
        response.EnsureSuccessStatusCode();
        var jsonResult = await response.Content.ReadAsStringAsync();

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var author = JsonSerializer.Deserialize<AuthorReadDTO>(jsonResult, options);

        // assert
        Assert.NotNull(author);
        Assert.Equal(1, author.Id); // 1 is expected, author.Id is actual
    }

    [Fact]
    public async Task GetAuthor_ReturnNotFound_WhenPersonDoesNotExist()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");

        // act
        var response = await _client.GetAsync(baseUrl + "/9999");

        // assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task AddAuthor_ReturnsCreatedAtRoute()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");
        var newAuthor = new AuthorCreateDTO { AuthorName = "Test" };
        var content = new StringContent(JsonSerializer.Serialize(newAuthor), Encoding.UTF8, "application/json");

        // act
        var response = await _client.PostAsync(baseUrl, content);
        response.EnsureSuccessStatusCode();

        var jsonResponse = await response.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var createdAuthor = JsonSerializer.Deserialize<Author>(jsonResponse, options);

        // assert
        Assert.NotNull(createdAuthor);
        Assert.Equal(newAuthor.AuthorName, createdAuthor.AuthorName);
    }

    [Fact]
    public async Task UpdateGenre_ReturnsNotContent_WhenSuccessfull()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);
        AuthorUpdateDTO authorToUpdate = new AuthorUpdateDTO { Id = 1, AuthorName = "Test" };
        var content = new StringContent(JsonSerializer.Serialize(authorToUpdate), Encoding.UTF8, "application/json");

        // act
        var response = await _client.PutAsync(baseUrl+"/1", content);
        response.EnsureSuccessStatusCode();

        // assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task UpdateAuthor_ReturnsBadRequest_WhenIdMismatch()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);
        var authorToUpdate = new AuthorUpdateDTO {Id=1,AuthorName = "Test"};
        var content = new StringContent(JsonSerializer.Serialize(authorToUpdate),Encoding.UTF8, "application/json");

        // act
        var response = await _client.PutAsync(baseUrl + "/2", content);

        // assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateAuthors_Returns_NotFound_WhenAuthorDoesNotExists()
    {
        // arrange 
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);
        var authorToUpdate = new AuthorUpdateDTO { Id = 9999, AuthorName = "Test" };

        var content = new StringContent(JsonSerializer.Serialize(authorToUpdate), Encoding.UTF8, "application/json");

        // act
        var response = await _client.PutAsync(baseUrl + "/9999", content);

        // assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteAuthor_ReturnsNoContent_WhenSucessfullDelete()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);

        // act
        var response = await _client.DeleteAsync(baseUrl + "/3");
        response.EnsureSuccessStatusCode();

        // assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task DeleteAuthor_ReturnsNotFound_WhenAuthorNotExists()
    {
        // arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, Roles.Admin);

        // act
        var response = await _client.DeleteAsync(baseUrl + "/9999");

        // assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    
}
