using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Coupon;
using BookStoreFullStackNg.Data.Helpers;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreFullStackNg.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CouponsController : ControllerBase
{
    private readonly ICouponRepository _couponRepository;
    private readonly ICartRepository _cartRepository;
    private readonly IUserRepository _userRepository;

    public CouponsController(
        ICouponRepository couponRepository,
        ICartRepository cartRepository,
        IUserRepository userRepository)
    {
        _couponRepository = couponRepository;
        _cartRepository = cartRepository;
        _userRepository = userRepository;
    }

    [HttpPost("apply")]
    public async Task<IActionResult> ApplyCoupon(CouponApplyRequestDto request)
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(username))
        {
            throw new BadRequestException("User is not logged in");
        }

        var user = await _userRepository.GetUserByUserNameAsync(username);
        if (user == null)
        {
            throw new BadRequestException("Invalid username");
        }

        var code = request.Code?.Trim() ?? string.Empty;
        var coupon = string.IsNullOrEmpty(code)
            ? null
            : await _couponRepository.GetByCodeAsync(code);
        if (coupon == null || !coupon.IsUsable(DateTime.UtcNow))
        {
            throw new BadRequestException("This coupon is invalid, expired, or has reached its usage limit.");
        }

        var cart = await _cartRepository.GetCartByUserIdAsync(user.Id);
        if (cart == null || cart.CartItems.Count == 0)
        {
            throw new BadRequestException("Your cart is empty.");
        }

        var subtotal = Math.Round(
            cart.CartItems.Sum(item => item.Book.Price * item.Quantity),
            2,
            MidpointRounding.AwayFromZero);
        var pricing = OrderPricing.Calculate(
            subtotal,
            Tax.TaxInPercent,
            coupon.DiscountPercent,
            coupon.MaxDiscount);

        return Ok(new CouponApplyResultDto
        {
            Code = coupon.Code,
            DiscountPercent = coupon.DiscountPercent,
            Subtotal = subtotal,
            DiscountAmount = pricing.DiscountAmount,
            Tax = pricing.Tax,
            Total = pricing.Total,
            Message = $"Coupon applied: {coupon.DiscountPercent}% off."
        });
    }

    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> GetCoupons()
    {
        var coupons = await _couponRepository.GetAllAsync();
        return Ok(coupons.Select(ToReadDto));
    }

    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> CreateCoupon(CouponCreateDto request)
    {
        var code = request.Code?.Trim() ?? string.Empty;
        if (string.IsNullOrWhiteSpace(code) || code.Length > 50)
        {
            throw new BadRequestException("Coupon code must contain between 1 and 50 characters.");
        }

        if (!double.IsFinite(request.DiscountPercent)
            || request.DiscountPercent <= 0
            || request.DiscountPercent > 100)
        {
            throw new BadRequestException("Discount percent must be greater than 0 and no more than 100.");
        }

        if (request.MaxDiscount is { } maxDiscount
            && (!double.IsFinite(maxDiscount) || maxDiscount <= 0))
        {
            throw new BadRequestException("Maximum discount must be greater than 0.");
        }

        if (request.MaxUsageCount is <= 0)
        {
            throw new BadRequestException("Maximum usage count must be greater than 0.");
        }

        if (await _couponRepository.GetByCodeAsync(code) != null)
        {
            throw new BadRequestException("A coupon with this code already exists.");
        }

        var coupon = await _couponRepository.CreateAsync(new Coupon
        {
            Code = code.ToUpperInvariant(),
            DiscountPercent = request.DiscountPercent,
            MaxDiscount = request.MaxDiscount,
            IsActive = request.IsActive,
            ExpiryDate = request.ExpiryDate,
            MaxUsageCount = request.MaxUsageCount
        });

        return CreatedAtAction(nameof(GetCoupons), ToReadDto(coupon));
    }

    private static CouponReadDto ToReadDto(Coupon coupon) => new()
    {
        Id = coupon.Id,
        Code = coupon.Code,
        DiscountPercent = coupon.DiscountPercent,
        MaxDiscount = coupon.MaxDiscount,
        IsActive = coupon.IsActive,
        ExpiryDate = coupon.ExpiryDate,
        MaxUsageCount = coupon.MaxUsageCount,
        UsageCount = coupon.UsageCount
    };
}
