using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.Domain;

public class Book
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    public double Price { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [MaxLength(150)]
    public string? ImagePublicId { get; set; }

    public int PublishedYear { get; set; }

    [MaxLength(30)]
    public string? ISBN { get; set; }

    public int? PageCount { get; set; }

    [MaxLength(100)]
    public string? Language { get; set; }

    [MaxLength(50)]
    public string? Format { get; set; }

    [MaxLength(150)]
    public string? Publisher { get; set; }

    [MaxLength(30)]
    public string Status { get; set; } = "Active";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<BookAuthor> BookAuthors { get; set; } = [];
    public ICollection<BookGenre> BookGenres { get; set; } = [];
}
