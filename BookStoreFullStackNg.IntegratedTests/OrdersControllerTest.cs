using BookStoreFullStackNg.Api.Models;
using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Common;
using BookStoreFullStackNg.Data.DTOs.Order;
using System.Net;
using System.Net.Http.Json;

namespace BookStoreFullStackNg.IntegratedTests;

[Collection("Test Collection")]
public class OrdersControllerTest
{
    private readonly CustomWebApplicationFactory _webApplicationFactory;
    private readonly HttpClient _client;
    private string _url = "api/orders";

    public OrdersControllerTest(CustomWebApplicationFactory webApplicationFactory)
    {
        _webApplicationFactory = webApplicationFactory;
        _client = webApplicationFactory.CreateClient();
    }

    [Fact]
    public async Task GetPaymentMethods_Returns_Ok()
    {
        // Act
        var response = await _client.GetAsync($"{_url}/payment-methods");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var paymentMethods = await response.Content.ReadFromJsonAsync<IEnumerable<PaymentMethodModel>>();
        Assert.NotNull(paymentMethods);
    }

    [Fact]
    public async Task CreateOrder_ReturnsNoContent_OnSuccess()
    {
        // Arrange
        var order = new OrderCreateDto { Name = "Ravindra2", MobileNumber = "1234", Email = "ravindra2@xyz.com", PaymentMethod = (int)PaymentMethod.COD };

        // Act
        var response = await _client.PostAsJsonAsync(_url, order);

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task GetUserOrders_ReturnsOk_WhenSuccess()
    {
        // Act
        var response = await _client.GetAsync($"{_url}/user-orders");

        // Assert
        Assert.Equal(HttpStatusCode.OK,response.StatusCode);
        var userOrders = await response.Content.ReadFromJsonAsync<PagedList<UserOrderDto>>();
        Assert.NotNull(userOrders);
        Assert.NotNull(userOrders.Items);
        Assert.NotEmpty(userOrders.Items);
    }

    [Fact]
    public async Task Orders_ReturnsOk_OnSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");
       
        // Act
        var response = await _client.GetAsync(_url);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var pagedOrders = await response.Content.ReadFromJsonAsync<PagedList<UserOrderDto>>();
        Assert.NotNull(pagedOrders);
        Assert.NotNull(pagedOrders.Items);
        Assert.NotEmpty(pagedOrders.Items);
    }

    [Fact]
    public async Task GetOrderItems_ReturnsOk_WhenSuccess()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");

        // Act
        var response = await _client.GetAsync($"{_url}/OrderItems/1");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var orderItems = await response.Content.ReadFromJsonAsync<IEnumerable<OrderItem>>();
        Assert.NotNull(orderItems);
        Assert.NotEmpty(orderItems);
    }
}
