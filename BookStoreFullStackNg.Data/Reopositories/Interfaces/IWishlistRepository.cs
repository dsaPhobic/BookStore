using BookStoreFullStackNg.Data.Domain;

namespace BookStoreFullStackNg.Data.Reopositories.Interfaces;

public interface IWishlistRepository
{
    Task<WishlistItem> AddAsync(int userId, int bookId);
    Task<IReadOnlyList<WishlistItem>> GetByUserIdAsync(int userId);
    Task<bool> RemoveAsync(int userId, int bookId);
}
