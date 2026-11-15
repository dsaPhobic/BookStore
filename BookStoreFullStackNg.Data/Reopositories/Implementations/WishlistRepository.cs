using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookStoreFullStackNg.Data.Reopositories.Implementations;

public class WishlistRepository : IWishlistRepository
{
    private readonly BookStoreContext _context;

    public WishlistRepository(BookStoreContext context)
    {
        _context = context;
    }

    public async Task<WishlistItem> AddAsync(int userId, int bookId)
    {
        var existingItem = await WishlistQuery()
            .FirstOrDefaultAsync(item => item.UserId == userId && item.BookId == bookId);

        if (existingItem != null)
        {
            return existingItem;
        }

        var item = new WishlistItem
        {
            UserId = userId,
            BookId = bookId,
            CreatedAt = DateTime.UtcNow
        };
        _context.WishlistItems.Add(item);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            _context.Entry(item).State = EntityState.Detached;
            var concurrentlyCreatedItem = await WishlistQuery()
                .FirstOrDefaultAsync(wishlistItem =>
                    wishlistItem.UserId == userId && wishlistItem.BookId == bookId);
            if (concurrentlyCreatedItem != null)
            {
                return concurrentlyCreatedItem;
            }

            throw;
        }

        return await WishlistQuery().SingleAsync(wishlistItem => wishlistItem.Id == item.Id);
    }

    public async Task<IReadOnlyList<WishlistItem>> GetByUserIdAsync(int userId)
    {
        return await WishlistQuery()
            .Where(item => item.UserId == userId)
            .OrderByDescending(item => item.CreatedAt)
            .ThenByDescending(item => item.Id)
            .ToListAsync();
    }

    public async Task<bool> RemoveAsync(int userId, int bookId)
    {
        var item = await _context.WishlistItems
            .SingleOrDefaultAsync(wishlistItem =>
                wishlistItem.UserId == userId && wishlistItem.BookId == bookId);

        if (item == null)
        {
            return false;
        }

        _context.WishlistItems.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }

    private IQueryable<WishlistItem> WishlistQuery()
    {
        return _context.WishlistItems
            .AsNoTracking()
            .Include(item => item.Book)
                .ThenInclude(book => book.BookAuthors)
                    .ThenInclude(bookAuthor => bookAuthor.Author)
            .Include(item => item.Book)
                .ThenInclude(book => book.BookGenres)
                    .ThenInclude(bookGenre => bookGenre.Genre);
    }
}
