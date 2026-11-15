using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.Domain;

public class Author
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string AuthorName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? OriginalName { get; set; }

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }

    [MaxLength(150)]
    public string? AvatarPublicId { get; set; }

    [MaxLength(2000)]
    public string? Bio { get; set; }

    public DateTime? BirthDate { get; set; }

    [MaxLength(100)]
    public string? Nationality { get; set; }

    public bool IsFeatured { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<BookAuthor> BookAuthors { get; set; } = [];
}
