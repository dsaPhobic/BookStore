using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookStoreFullStackNg.Data.Reopositories.Implementations;

public class CartRepository : ICartRepository
{
    private readonly BookStoreContext _context;

    public CartRepository(BookStoreContext context)
    {
        _context = context;
    }
    public async Task<CartItem> AddCartItemAsync(int userId,CartItem cartItem)
    {
        using var tran= await _context.Database.BeginTransactionAsync();
        try
        {
            var cart = await GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            // if item is already in cart,then increment else add
            var existingItem = await _context.CartItems.FirstOrDefaultAsync(ci => ci.BookId == cartItem.BookId);
            if (existingItem == null)
            {
                 cartItem.CartId = cart.Id;
                _context.CartItems.Add(cartItem);
            }
            else
            {
                existingItem.Quantity += cartItem.Quantity;
                cartItem = existingItem;
            }
            await _context.SaveChangesAsync();
            await tran.CommitAsync();
            var createdCartItem = await GetCartItemByCartItemIdAsync(cartItem.Id);
            return createdCartItem;
        }
        catch(Exception)
        {
           await tran.RollbackAsync();
            throw;
        }
    }

    public async Task<CartItem> UpdateCartItemAsync(int userId,CartItem cartItem)
    {
        var cart = await GetCartByUserIdAsync(userId);
        if (cart == null)
        {
            throw new InvalidOperationException("This user does not have any items in cart");
        }
        
        if (cartItem.CartId != cart.Id)
        {
            throw new InvalidOperationException("You are updating the wrong cart");
        }

        _context.CartItems.Update(cartItem);
        await _context.SaveChangesAsync();

        var createdCartItem = await GetCartItemByCartItemIdAsync(cartItem.Id);
        return createdCartItem;
    }

    //public async Task<Cart?> GetCartByIdAsync(int cartId)
    //{
    //    return await _context.Carts.Include(c=>c.CartItems).ThenInclude(ci=>ci.Book).AsNoTracking().FirstOrDefaultAsync(c => c.Id == cartId);
    //}

    public async Task<Cart?> GetCartByUserIdAsync(int userId)
    {
        return await _context.Carts
            .AsNoTracking()
            .Include(c=>c.User)
            .Include(c => c.User)  // Include User related to Cart
            .Include(c => c.CartItems)  // Include CartItems in Cart
                .ThenInclude(ci => ci.Book)  // Include Book in CartItem
                    .ThenInclude(b => b.BookAuthors)  // Include BookAuthors in Book
                        .ThenInclude(ba => ba.Author)  // Include Author in BookAuthor
            .Include(c => c.CartItems)  // Re-include CartItems to continue chain
                .ThenInclude(ci => ci.Book)  // Include Book in CartItem
                    .ThenInclude(b => b.BookGenres)  // Include BookGenres in Book
                        .ThenInclude(bg => bg.Genre)  // Include Genre in BookGenre
            .FirstOrDefaultAsync(c => c.UserId == userId);  // Filter by UserId
    }


    public async Task<CartItem?> GetCartItemByCartItemIdAsync(int cartItemId)
    {
        return await _context.CartItems
            .Include(ci => ci.Book)
            .ThenInclude(b=>b.BookGenres)
            .ThenInclude(bg=>bg.Genre)
            .Include(ci=>ci.Book)
            .ThenInclude(b=>b.BookAuthors)
            .ThenInclude(ba=>ba.Author)
            .AsNoTracking()
            .FirstOrDefaultAsync(ci=>ci.Id==cartItemId);
    }

    public async Task RemoveCartItemAsync(int userId,int cartItemId)
    {
        var cart = await GetCartByUserIdAsync(userId);
        if (cart == null)
        {
            throw new InvalidOperationException("This user does not have any items in cart");
        }
        var cartItem= await _context.CartItems.AsNoTracking().FirstOrDefaultAsync(ci=>ci.Id==cartItemId);
        if(cartItem == null)
        {
            throw new InvalidOperationException("Cart item is null");
        }
        if(cartItem.CartId!=cart.Id)
        {
            throw new InvalidOperationException("You are deleting the item of a wrong cart");
        }
        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Cart>> GetCartsAsync()
    {
        return await _context.Carts
                             .Include(c=>c.User)
                             .Include(c => c.CartItems)
                             .ThenInclude(ci => ci.Book)
                             .Include(c => c.User)
                             .AsNoTracking()
                             .ToListAsync();
    }
}
