using System;

namespace BookStoreFullStackNg.Data.Domain;

public class BookAuthor
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public Book Book { get; set; } = null!;

    public int AuthorId { get; set; }
    public Author Author { get; set; } = null!;

    public BookAuthor()
    {
        
    }
    public BookAuthor(int id,int bookId,int authorId)
    {
        Id = id;
        BookId=bookId;
        AuthorId = authorId;
    }
}
