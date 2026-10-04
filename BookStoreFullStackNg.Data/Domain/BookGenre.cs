using System;

namespace BookStoreFullStackNg.Data.Domain;

public class BookGenre
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public Book Book { get; set; } = null!;

    public int GenreId { get; set; }
    public Genre Genre { get; set; } = null!;

    public BookGenre()
    {
        
    }
    public BookGenre(int id,int bookId,int genreId)
    {
        Id = id;
        BookId=bookId;
        GenreId = genreId;
    }
}
