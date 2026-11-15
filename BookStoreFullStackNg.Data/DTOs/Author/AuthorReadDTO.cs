using System;

namespace BookStoreFullStackNg.Data.DTOs.Author;

public class AuthorReadDTO
{
    public int Id { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string? OriginalName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? AvatarPublicId { get; set; }
    public string? Bio { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? Nationality { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    public int BooksCount { get; set; }

    public AuthorReadDTO(int id, string authorName)
    {
        Id = id;
        AuthorName = authorName;
    }

    public AuthorReadDTO()
    {
        
    }
}
