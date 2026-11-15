namespace BookStoreFullStackNg.Data.Exceptions;

public class StockUnavailableException : Exception
{
    public StockUnavailableException(string message) : base(message)
    {
    }
}
