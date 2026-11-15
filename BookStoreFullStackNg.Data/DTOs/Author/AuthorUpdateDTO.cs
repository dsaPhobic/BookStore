using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace BookStoreFullStackNg.Data.DTOs.Author;

public class AuthorUpdateDTO
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string AuthorName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? OriginalName { get; set; }

    public string? AvatarUrl { get; set; }
    public string? AvatarPublicId { get; set; }

    public IFormFile? AvatarFile { get; set; }

    [MaxLength(2000)]
    public string? Bio { get; set; }

    public DateTime? BirthDate { get; set; }

    [MaxLength(100)]
    public string? Nationality { get; set; }

    public bool IsFeatured { get; set; } = false;
}
