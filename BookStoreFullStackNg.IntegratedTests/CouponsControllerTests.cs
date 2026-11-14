using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Coupon;
using BookStoreFullStackNg.Data.DTOs.Order;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Json;

namespace BookStoreFullStackNg.IntegratedTests;

public class CouponsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public CouponsControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task ApplyCoupon_ThenCheckout_DiscountsTaxInclusiveTotalAndConsumesCoupon()
    {
        var code = $"SAVE{Guid.NewGuid():N}"[..12];
        await ResetCartAsync();
        var subtotal = await GetCartSubtotalAsync();
        var expectedTax = Math.Round(subtotal * 0.18, 2, MidpointRounding.AwayFromZero);
        var expectedDiscount = Math.Round((subtotal + expectedTax) * 0.3, 2, MidpointRounding.AwayFromZero);
        var expectedTotal = Math.Round(subtotal + expectedTax - expectedDiscount, 2, MidpointRounding.AwayFromZero);

        using var adminClient = _factory.CreateClient();
        adminClient.DefaultRequestHeaders.Add(TestAuthHandler.TestUserRolesHeader, "Admin");
        var createResponse = await adminClient.PostAsJsonAsync("api/coupons", new CouponCreateDto
        {
            Code = code,
            DiscountPercent = 30,
            MaxUsageCount = 1
        });
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        using var userClient = _factory.CreateClient();
        var applyResponse = await userClient.PostAsJsonAsync("api/coupons/apply", new CouponApplyRequestDto
        {
            Code = code.ToLowerInvariant()
        });
        Assert.Equal(HttpStatusCode.OK, applyResponse.StatusCode);
        var preview = await applyResponse.Content.ReadFromJsonAsync<CouponApplyResultDto>();
        Assert.NotNull(preview);
        Assert.Equal(subtotal, preview.Subtotal);
        Assert.Equal(expectedDiscount, preview.DiscountAmount);
        Assert.Equal(expectedTax, preview.Tax);
        Assert.Equal(expectedTotal, preview.Total);

        var checkoutResponse = await userClient.PostAsJsonAsync("api/orders", new OrderCreateDto
        {
            Name = "Coupon Test",
            Email = "coupon@example.com",
            MobileNumber = "123456",
            PaymentMethod = 6,
            CouponCode = code
        });
        Assert.Equal(HttpStatusCode.NoContent, checkoutResponse.StatusCode);

        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BookStoreContext>();
        var normalizedCode = code.ToUpperInvariant();
        var usedCoupon = await context.Coupons.SingleAsync(coupon => coupon.Code == normalizedCode);
        var order = await context.Orders
            .Include(item => item.Payment)
            .SingleAsync(item => item.CouponCode == normalizedCode);
        Assert.Equal(1, usedCoupon.UsageCount);
        Assert.Equal(expectedDiscount, order.DiscountAmount);
        Assert.Equal(expectedTotal, order.Payment.Amount);

        var historyResponse = await userClient.GetAsync("api/orders/user-orders");
        Assert.Equal(HttpStatusCode.OK, historyResponse.StatusCode);
        var history = await historyResponse.Content.ReadFromJsonAsync<BookStoreFullStackNg.Data.DTOs.Common.PagedList<UserOrderDto>>();
        Assert.NotNull(history);
        var historyOrder = Assert.Single(history.Items.Where(item => item.CouponCode == normalizedCode));
        Assert.Equal(expectedTotal, historyOrder.Total);
        Assert.Equal(expectedTotal, historyOrder.OrderItems.Sum(item => item.PaidTotal), 2);

        var exhaustedCouponResponse = await userClient.PostAsJsonAsync("api/coupons/apply", new CouponApplyRequestDto
        {
            Code = code
        });
        Assert.Equal(HttpStatusCode.BadRequest, exhaustedCouponResponse.StatusCode);
    }

    [Fact]
    public async Task ApplyCoupon_RejectsUnknownCode()
    {
        await ResetCartAsync();
        using var client = _factory.CreateClient();
        var code = $"UNKNOWN{Guid.NewGuid():N}";
        var response = await client.PostAsJsonAsync("api/coupons/apply", new CouponApplyRequestDto
        {
            Code = code
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var checkoutResponse = await client.PostAsJsonAsync("api/orders", new OrderCreateDto
        {
            Name = "Coupon Test",
            Email = "coupon@example.com",
            MobileNumber = "123456",
            PaymentMethod = 6,
            CouponCode = code
        });
        Assert.Equal(HttpStatusCode.BadRequest, checkoutResponse.StatusCode);
    }

    private async Task ResetCartAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BookStoreContext>();
        var existingCarts = await context.Carts
            .Include(cart => cart.CartItems)
            .Where(cart => cart.UserId == 1)
            .ToListAsync();
        context.Carts.RemoveRange(existingCarts);
        await context.SaveChangesAsync();

        context.Carts.Add(new Cart
        {
            UserId = 1,
            CartItems =
            [
                new CartItem { BookId = 1, Quantity = 1 },
                new CartItem { BookId = 2, Quantity = 2 }
            ]
        });
        await context.SaveChangesAsync();
    }

    private async Task<double> GetCartSubtotalAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BookStoreContext>();
        return await context.Books
            .Where(book => book.Id == 1 || book.Id == 2)
            .SumAsync(book => book.Id == 1 ? book.Price : book.Price * 2);
    }
}
