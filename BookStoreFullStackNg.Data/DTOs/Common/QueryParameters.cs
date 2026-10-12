namespace BookStoreFullStackNg.Data.DTOs.Common;

public abstract class QueryParameters
{
    private int _pageSize = 10;
    private int _pageNumber = 1;

    private string? _sortBy;
    private const int MaxPageSize = 50;

    private string? _searchTerm;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }

    public int PageNumber
    {
        get => _pageNumber;
        set => _pageNumber = (value <= 0) ? 1 : value;
    }

    public string? SortBy
    {
        get => _sortBy;
        set
        {
            if (value == null)
            {
                _sortBy = value;
            }
            else
            {
                _sortBy = value.ToLower();
            }
        }
    }

    // Filtering
    public string? SearchTerm
    {
        get => _searchTerm;
        set
        {
            if (value == null)
            {
                _searchTerm = value;
            }
            else
            {
                _searchTerm = value.ToLower();
            }
        }
    }
}
