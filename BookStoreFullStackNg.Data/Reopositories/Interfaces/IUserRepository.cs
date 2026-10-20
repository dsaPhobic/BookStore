using BookStoreFullStackNg.Data.Domain;

namespace BookStoreFullStackNg.Data.Reopositories.Interfaces;

public interface IUserRepository
{
   Task<User?> GetUserByUserNameAsync(string userName);
}
