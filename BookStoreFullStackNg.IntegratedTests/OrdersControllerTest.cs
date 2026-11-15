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
        var response = await _client.GetAsync($"{_url}/my-orders");

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
        var response = await _client.GetAsync($"{_url}/customer-orders");

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

    [Fact]
    public async Task GetOrder_ReturnsOk_ForAdmin()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");

        // Act
        var response = await _client.GetAsync($"{_url}/1");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var order = await response.Content.ReadFromJsonAsync<UserOrderDto>();
        Assert.NotNull(order);
        Assert.Equal(1, order.Id);
    }

    [Fact]
    public async Task GetOrder_ReturnsNotFound_WhenOrderDoesNotExist()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");

        // Act
        var response = await _client.GetAsync($"{_url}/9999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateOrderStatus_ReturnsNoContent_ForAdmin()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");
        var payload = new { OrderStatus = (int)OrderStatus.Processing };

        // Act
        var response = await _client.PutAsJsonAsync($"{_url}/1/status", payload);

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var orderResponse = await _client.GetAsync($"{_url}/1");
        var order = await orderResponse.Content.ReadFromJsonAsync<UserOrderDto>();
        Assert.NotNull(order);
        Assert.Equal(OrderStatus.Processing, order.OrderStatus);
    }

    [Fact]
    public async Task UpdateOrderStatus_ReturnsBadRequest_WhenStatusIsInvalid()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");
        var payload = new { OrderStatus = 999 };

        // Act
        var response = await _client.PutAsJsonAsync($"{_url}/1/status", payload);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateOrderStatus_ReturnsNotFound_WhenOrderDoesNotExist()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");
        var payload = new { OrderStatus = (int)OrderStatus.Processing };

        // Act
        var response = await _client.PutAsJsonAsync($"{_url}/9999/status", payload);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateOrderStatus_ReturnsForbidden_ForNonAdmin()
    {
        // Arrange
        _client.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "User");
        var payload = new { OrderStatus = (int)OrderStatus.Shipped };

        // Act
        var response = await _client.PutAsJsonAsync($"{_url}/1/status", payload);

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
