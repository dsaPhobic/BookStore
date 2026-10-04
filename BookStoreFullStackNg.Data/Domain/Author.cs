using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.Domain;

public class Author
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string AuthorName { get; set; } = string.Empty;

    public ICollection<BookAuthor> BookAuthors { get; set; } = [];

}
