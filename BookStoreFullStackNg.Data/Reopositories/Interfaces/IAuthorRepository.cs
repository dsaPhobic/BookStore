using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Common;

namespace BookStoreFullStackNg.Data.Reopositories.Interfaces;

public interface IAuthorRepository
{
    Task<Author> CreateAuthor(Author author);
    Task UpdateAuthor(Author author);
    Task DeleteAuthor(Author author);
    Task<PagedList<Author>> GetAuthors(AuthorQueryParameters queryParameters);
    Task<Author?> GetAuthor(int id);
}
