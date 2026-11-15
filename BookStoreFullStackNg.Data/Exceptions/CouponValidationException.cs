namespace BookStoreFullStackNg.Data.Exceptions;

public class CouponValidationException : Exception
{
    public CouponValidationException(string message) : base(message)
    {
    }
}
