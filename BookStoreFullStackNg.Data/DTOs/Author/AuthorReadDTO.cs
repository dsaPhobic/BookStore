
namespace BookStoreFullStackNg.Data.DTOs.Author;

public class AuthorReadDTO
{
    public int Id { get; set; }

    public string AuthorName { get; set; } = string.Empty;

    public AuthorReadDTO(int id,string authorName)
    {
        Id = id;
        AuthorName = authorName;
    }

    public AuthorReadDTO()
    {
        
    }
}
