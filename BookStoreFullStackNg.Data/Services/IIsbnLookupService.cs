using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookStoreFullStackNg.Data.Services;

public class AuthorLookupMatchDto
{
    public int Id { get; set; }
    public string AuthorName { get; set; } = string.Empty;
}

public class IsbnLookupResultDto
{
    public bool Found { get; set; }
    public string? ISBN { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public List<string> Authors { get; set; } = [];
    public List<AuthorLookupMatchDto> MatchedAuthors { get; set; } = [];
    public List<int> AuthorIds { get; set; } = [];
    public int? PublishedYear { get; set; }
    public int? PageCount { get; set; }
    public string? Language { get; set; }
    public string? Publisher { get; set; }
    public string? ImageUrl { get; set; }
}

public interface IIsbnLookupService
{
    Task<IsbnLookupResultDto> LookupByIsbnAsync(string isbn);
}

