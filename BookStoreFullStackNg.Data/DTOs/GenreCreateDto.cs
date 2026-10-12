using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.DTOs;

public class GenreCreateDto
{
    [Required]
    [MaxLength(30)]
    public string GenreName { get; set; } = string.Empty;
}
