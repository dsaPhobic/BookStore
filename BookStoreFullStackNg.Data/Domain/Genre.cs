using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.Domain;

public class Genre
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string GenreName { get; set; } = string.Empty;
    public ICollection<BookGenre> BookGenres { get; set; } = [];

}
