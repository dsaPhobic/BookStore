using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookStoreFullStackNg.Data.Reopositories.Implementations;

public class CouponRepository : ICouponRepository
{
    private readonly BookStoreContext _context;

    public CouponRepository(BookStoreContext context)
    {
        _context = context;
    }

    public async Task<Coupon?> GetByCodeAsync(string code)
    {
        var normalizedCode = code.Trim().ToUpperInvariant();
        return await _context.Coupons
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Code == normalizedCode);
    }

    public async Task<IEnumerable<Coupon>> GetAllAsync()
    {
        return await _context.Coupons.AsNoTracking().ToListAsync();
    }

    public async Task<Coupon> CreateAsync(Coupon coupon)
    {
        coupon.Code = coupon.Code.Trim().ToUpper();
        _context.Coupons.Add(coupon);
        await _context.SaveChangesAsync();
        return coupon;
    }

    public async Task<Coupon?> GetByIdAsync(int id)
    {
        return await _context.Coupons.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task UpdateAsync(Coupon coupon)
    {
        _context.Coupons.Update(coupon);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var coupon = await _context.Coupons.FindAsync(id);
        if (coupon != null)
        {
            _context.Coupons.Remove(coupon);
            await _context.SaveChangesAsync();
        }
    }
}
