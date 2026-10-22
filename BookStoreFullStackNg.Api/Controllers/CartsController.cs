using AutoMapper;
using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Api.Helpers.Wrapper;
using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Cart;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreFullStackNg.Api.Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class CartsController : ControllerBase
{
    private readonly ICartRepository _cartRepo;
    private readonly IMapper _mapper;
    private readonly IUserRepository _userRepo;
    private readonly ICartItemMapper _cartItemMapper;
    public CartsController(ICartRepository cartRepo, IMapper mapper, IUserRepository userRepo, ICartItemMapper cartItemMapper)
    {
        _cartRepo = cartRepo;
        _mapper = mapper;
        _userRepo = userRepo;
        _cartItemMapper = cartItemMapper;
    }

    [HttpPost]
    public async Task<IActionResult> AddCartItem(CartItemCreateDto cartItemToCreate)
    {
        var userName = User.Identity.Name;
        if (string.IsNullOrEmpty(userName))
        {
            throw new BadRequestException("User is not logged in");
        }
        var user = await _userRepo.GetUserByUserNameAsync(userName);

        // since username is not being passed by user, so this condition will likely occur
        if (user == null)
        {
            throw new BadRequestException("Invalid username");
        }
        var cartItem = _mapper.Map<CartItem>(cartItemToCreate);
        CartItem createdCartItem = await _cartRepo.AddCartItemAsync(user.Id, cartItem);
       var cartItemToReturn = _cartItemMapper.MapCartItemToCartItemDto(createdCartItem);
        return CreatedAtAction(nameof(AddCartItem), cartItemToReturn);
    }

    [HttpPut("{cartItemId}")]
    public async Task<IActionResult> UpdateCartItem(int cartItemId, CartItemUpdateDto cartItemToUpdate)
    {
        var userName = User.Identity.Name;
        if (userName == null)
        {
            throw new BadRequestException("User is not logged in");
        }
        var user = await _userRepo.GetUserByUserNameAsync(userName);

        // since username is not being passed by user, so this condition will likely occur
        if (user == null)
        {
            throw new BadRequestException("Invalid username");
        }

        if (cartItemId != cartItemToUpdate.Id)
        {
            throw new BadRequestException("Ids mismatch");
        }

        var existingCartItem = await _cartRepo.GetCartItemByCartItemIdAsync(cartItemId);
        if (existingCartItem == null)
        {
            throw new NotFoundException($"Cart item {cartItemId} does not found");
        }

        var cartItem = _mapper.Map<CartItem>(cartItemToUpdate);
        var updatedCartItem = await _cartRepo.UpdateCartItemAsync(user.Id, cartItem);
        CartItemDto? cartItemToReturn = _cartItemMapper.MapCartItemToCartItemDto(updatedCartItem);

        return Ok(cartItemToReturn);
    }

    [HttpDelete("{cartItemId}")]
    public async Task<IActionResult> DeleteCartItem(int cartItemId)
    {
        var userName = User.Identity.Name;
        if (userName == null)
        {
            throw new BadRequestException("User is not logged in");
        }
        var user = await _userRepo.GetUserByUserNameAsync(userName);

        // since username is not being passed by user, so this condition will likely occur
        if (user == null)
        {
            throw new BadRequestException("Invalid username");
        }
        await _cartRepo.RemoveCartItemAsync(user.Id, cartItemId);
        return NoContent();
    }

    [HttpGet("UserCart")]
    public async Task<IActionResult> GetUserCartByUserId()
    {
        var userName = User.Identity.Name;
        if (userName == null)
        {
            throw new BadRequestException("User is not logged in");
        }

        var user = await _userRepo.GetUserByUserNameAsync(userName);
        // since username is not being passed by user, so this condition will likely occur
        if (user == null)
        {
            throw new BadRequestException("Invalid username");
        }

        Cart? cart = await _cartRepo.GetCartByUserIdAsync(user.Id);

        if(cart==null)
        {
            throw new NotFoundException("Item does not found");
        }

        CartReadDto cartToReturn = _cartItemMapper.MapCartToCartReadDto(cart);

        return Ok(cartToReturn);
    }

    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> GetAllCarts()
    {
        IEnumerable<Cart> carts = await _cartRepo.GetCartsAsync();
        IEnumerable<CartReadDto?> cartToReturn= _cartItemMapper.MapCartsToCartReadDtos(carts);
        return Ok(cartToReturn);
    }


}
