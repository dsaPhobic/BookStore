using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.Domain;

public class Book
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Description { get; set; } = string.Empty;
    public double Price { get; set; }

    public string ? ImageUrl { get; set; }
    public int PublishedYear { get; set; }

    public ICollection<BookAuthor> BookAuthors { get; set; } = [];
    public ICollection<BookGenre> BookGenres { get; set; } = [];
}
