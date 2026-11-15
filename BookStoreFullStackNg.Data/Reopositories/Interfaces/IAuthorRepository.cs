using System.Threading.Tasks;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Common;

namespace BookStoreFullStackNg.Data.Reopositories.Interfaces;

public interface IAuthorRepository
{
    Task<Author> CreateAuthor(Author author);
    Task UpdateAuthor(Author author);
    Task DeleteAuthor(Author author);
    Task<PagedList<Author>> GetAuthors(AuthorQueryParameters queryParameters);
    Task<Author?> GetAuthor(int id);
    Task<PagedList<Book>> GetBooksByAuthorId(int authorId, BookQueryParameter queryParameters);
    Task<AuthorReadDTO?> GetAuthorDetailWithStats(int authorId);
}
