using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace BookStoreFullStackNg.Data.DTOs.Book;

public class BookUpdateDto
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0, 100000000)]
    public double Price { get; set; }

    public string? ImageUrl { get; set; }
    public string? ImagePublicId { get; set; }

    public IFormFile? ImageFile { get; set; }

    [Required]
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

    public List<int> AuthorIds { get; set; } = [];
    public List<int> GenreIds { get; set; } = [];
}
