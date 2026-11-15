using BookStoreFullStackNg.Data.Domain;

namespace BookStoreFullStackNg.Data.Reopositories.Interfaces;

public interface ICouponRepository
{
    Task<Coupon?> GetByCodeAsync(string code);
    Task<IEnumerable<Coupon>> GetAllAsync();
    Task<Coupon> CreateAsync(Coupon coupon);
    Task<Coupon?> GetByIdAsync(int id);
    Task UpdateAsync(Coupon coupon);
    Task DeleteAsync(int id);
}
