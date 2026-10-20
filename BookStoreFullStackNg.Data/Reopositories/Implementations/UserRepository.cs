using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookStoreFullStackNg.Data.Reopositories.Implementations;
public class UserRepository : IUserRepository
{
    private readonly BookStoreContext _context;
    public UserRepository(BookStoreContext context)
    {
        _context = context;
    }
    public async Task<User?> GetUserByUserNameAsync(string userName)
    {
        return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u=>u.Username== userName);
    }
}
