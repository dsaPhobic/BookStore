using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.DTOs.Cart;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Text;
using System.Text.Json;

namespace BookStoreFullStackNg.IntegratedTests;

[Collection("Test Collection")]
public class CartsControllerTests: IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;
    private const string _url = "api/carts";
    public CartsControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task AddCartItem_Returns_CreatedAtAction()
    {
        // Arrange
        var cartItemToCreate = new CartItemCreateDto {BookId=1,Quantity=1 };
        var content = new StringContent(JsonSerializer.Serialize(cartItemToCreate),Encoding.UTF8,"application/json");

        // Act
        var response= await _client.PostAsync(_url,content);
        response.EnsureSuccessStatusCode();

        var jsonResponse = await response.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive=true };
        var createdItem =  JsonSerializer.Deserialize<CartItemDto>(jsonResponse, options);

        // Assert
        Assert.NotNull(createdItem);
        Assert.Equal(cartItemToCreate.BookId, createdItem.BookId);
    }

    [Fact]
    public async Task AddCartItem_Throws_UnAuthenticated_WhenUserNotLoggedIn()
    {
        // Arrange
        var cartItemToCreate = new CartItemCreateDto { BookId = 1, Quantity = 1 };
        var content = new StringContent(JsonSerializer.Serialize(cartItemToCreate), Encoding.UTF8, "application/json");

        // Act: Force unauthenticated request by adding this header
        _client.DefaultRequestHeaders.Add("X-ForceUnAuthenticated", "true");

        var response = await _client.PostAsync(_url, content);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task UpdateCart_Returns_UpdatedCartItem_OnSuccess()
    {
        // Arrange
        int cartItemId = 1;
        var cartItemToUpdate = new CartItemUpdateDto {Id=cartItemId,BookId=1,CartId=1 };
        var jsonContent = JsonSerializer.Serialize(cartItemToUpdate);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        // Act 
        var result = await _client.PutAsync(_url + "/" + cartItemId, content);
        result.EnsureSuccessStatusCode();
        var jsonResult = await result.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive=true };
        var updatedCartItem = JsonSerializer.Deserialize<CartItemDto>(jsonResult,options);

        // Assert
        Assert.Equal(HttpStatusCode.OK, result.StatusCode);
        Assert.NotNull(updatedCartItem);
        Assert.Equal(updatedCartItem.Quantity, cartItemToUpdate.Quantity);
        Assert.Equal(updatedCartItem.Id, cartItemToUpdate.Id);
        Assert.Equal(updatedCartItem.BookId, cartItemToUpdate.BookId);
        Assert.Equal(updatedCartItem.CartId, cartItemToUpdate.CartId);
    }

    [Fact]
    public async Task UpdateCartItem_ThrowsBadRequest_WhenIdsMismatch()
    {
        // Arrange
        int cartItemId = 1;
        var cartItemToUpdate = new CartItemUpdateDto { Id = 2, BookId = 1, CartId = 1 }; // Ids mismatch
        string JsonContent = JsonSerializer.Serialize(cartItemToUpdate);
        StringContent content = new StringContent(JsonContent, Encoding.UTF8, "application/json");

        // Act
        var result = await _client.PutAsync(_url + "/" + cartItemId, content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
    }

    [Fact]
    public async Task UpdateCartItem_ThrowsNotFoundException_WhenCartItemNotFound()
    {
        // Arrange
        int cartItemId = 9999;
        var cartItemToUpdate = new CartItemUpdateDto { Id = cartItemId, BookId = 1, CartId = 1 }; // Ids mismatch
        string JsonContent = JsonSerializer.Serialize(cartItemToUpdate);
        StringContent content = new StringContent(JsonContent, Encoding.UTF8, "application/json");

        // Act
        var result = await _client.PutAsync(_url + "/" + cartItemId, content);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, result.StatusCode);
    }

    [Fact]
    public async Task DeleteCartItem_ReturnsNoContent_OnSuccess()
    {
        // Arrange
        int cartItemId = 2;

        // Act
        var result = await _client.DeleteAsync(_url + "/" + cartItemId);
        result.EnsureSuccessStatusCode();

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, result.StatusCode);
    }

    [Fact]
    public async Task GetUserCart_Returns_CartDataOnSuccess()
    {
        // Act
        var result = await _client.GetAsync(_url + "/UserCart");
        result.EnsureSuccessStatusCode();
        var jsonResult = await result.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        CartReadDto cart = JsonSerializer.Deserialize<CartReadDto>(jsonResult, options);

        // Assert
        Assert.NotNull(cart);
    }

    [Fact]
    public async Task GetUserTask_ReturnsNotFoundException_WhenCartItemIsNull()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add("X-UserName","test2"); //The user with name 'test2' does not have any cart entry

        // Act
        var result = await _client.GetAsync(_url +"/UserCart");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, result.StatusCode);

    }

    [Fact]
    public async Task GetAllCart_Returns_CartsOnSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");

        // act
        var result = await _client.GetAsync(_url);
        result.EnsureSuccessStatusCode();
        var jsonResult = await result.Content.ReadAsStringAsync();
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        IEnumerable<CartReadDto> carts = JsonSerializer.Deserialize<IEnumerable<CartReadDto>>(jsonResult, options);

        // assert
        Assert.NotNull(carts);
        Assert.NotEmpty(carts);

    }

}
