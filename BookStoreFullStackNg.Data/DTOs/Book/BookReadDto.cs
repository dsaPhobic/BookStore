using System;
using System.Collections.Generic;
using System.Linq;
using BookStoreFullStackNg.Data.DTOs.Author;

namespace BookStoreFullStackNg.Data.DTOs.Book;

public class BookReadDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Price { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImagePublicId { get; set; }
    public int PublishedYear { get; set; }

    public string? ISBN { get; set; }
    public int? PageCount { get; set; }
    public string? Language { get; set; }
    public string? Format { get; set; }
    public string? Publisher { get; set; }
    public string Status { get; set; } = "Active";
    public DateTime CreatedAt { get; set; }

    public List<AuthorReadDTO> Authors { get; set; } = [];
    public List<GenreReadDto> Genres { get; set; } = [];

    public string AuthorNames => string.Join(", ", Authors.Select(a => a.AuthorName));
    public string GenreNames => string.Join(", ", Genres.Select(g => g.GenreName));
}
