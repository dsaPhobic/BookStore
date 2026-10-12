using System;
using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.DTOs.Author;

public class AuthorUpdateDTO
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string AuthorName { get; set; } = string.Empty;
}
