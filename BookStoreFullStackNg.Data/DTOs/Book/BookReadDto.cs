using BookStoreFullStackNg.Data.DTOs.Author;

namespace BookStoreFullStackNg.Data.DTOs.Book;

public class BookReadDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
    public double Price { get; set; }
    public string? ImageUrl { get; set; }
    public int PublishedYear { get; set; }

    public List<AuthorReadDTO> Authors { get; set; } = [];
    public List<GenreReadDto> Genres { get; set; } = [];

    public string AuthorNames {
        get
        {
            return string.Join(',', Authors.Select(a => a.AuthorName));
        }
    }

    public string GenreNames
    {
        get
        {
            return string.Join(',', Genres.Select(g => g.GenreName));
        }
    }
}
