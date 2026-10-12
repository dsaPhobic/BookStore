using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.DTOs.Author;

public class AuthorCreateDTO
{
    [Required]
    [MaxLength(30)]
    public string AuthorName { get; set; } = string.Empty;
}
