using BookStoreFullStackNg.Data.Domain;

namespace BookStoreFullStackNg.Data.Reopositories.Interfaces;

public interface ICartRepository
{
    //Task<Cart?> GetCartByIdAsync(int cartId);
    Task<Cart?> GetCartByUserIdAsync(int userId);
    Task<CartItem> AddCartItemAsync(int userId,CartItem cartItem);
    Task<CartItem?> GetCartItemByCartItemIdAsync(int cartItemId);
    Task<CartItem> UpdateCartItemAsync(int userId,CartItem cartItem);
    Task RemoveCartItemAsync(int userId,int cartItemId);
    Task<IEnumerable<Cart>> GetCartsAsync();
}
