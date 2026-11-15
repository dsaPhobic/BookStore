using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Common;

namespace BookStoreFullStackNg.Data.Reopositories.Interfaces
{
    public interface IBookRepository
    {
        Task<BookReadDto> AddBookAsync(BookCreateDto bookToCreate);
        Task DeleteBookAsync(Book book);
        Task<BookReadDto?> GetBookByIdAsync(int bookId);
        Task<IReadOnlyList<BookReadDto>> GetRelatedBooksAsync(int bookId, int limit);
        Task<PagedList<Book>> GetBooksAsync(BookQueryParameter queryParameters);
        Task UpdateBookAsync(BookUpdateDto bookToUpdate);
    }
}
