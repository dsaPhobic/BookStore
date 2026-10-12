using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Common;
using BookStoreFullStackNg.Data.Helpers;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookStoreFullStackNg.Data.Reopositories.Implementations;

public class BookRepository : IBookRepository
{
    private readonly BookStoreContext _context;
    private readonly ISortHelper<Book> _sortHelper;

    public BookRepository(BookStoreContext context, ISortHelper<Book> sortHelper)
    {
        _context = context;
        _sortHelper = sortHelper;
    }

    public async Task<BookReadDto> AddBookAsync(BookCreateDto bookToCreate)
    {
        using var transaction = _context.Database.BeginTransaction();
        try
        {
            int bookId = await CreateBook(bookToCreate);
            await AddBookAuthors(bookId, bookToCreate.AuthorIds);
            await AddBookGenres(bookId, bookToCreate.GenreIds);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            BookReadDto? book = await GetBookByIdAsync(bookId);

            if (book == null)
            {
                throw new InvalidOperationException($"Book with id: {bookId} does not found");
            }

            return book;
        }
        catch (Exception ex)
        {
            transaction.Rollback();
            throw ex;
        }
    }

    #region AddBookAsync private methods
    private async Task AddBookGenres(int bookId, List<int> genreIds)
    {
        foreach (var genreId in genreIds)
        {
            var genre = await _context.Genres.FindAsync(genreId);
            if (genre == null)
            {
                throw new InvalidOperationException($"genre with id: {genreId} does not exists");
            }
            _context.BookGenres.Add(new BookGenre(0, bookId, genreId));
        }
    }
    private async Task AddBookAuthors(int bookId, List<int> authorIds)
    {
        foreach (var authorId in authorIds)
        {
            var author = await _context.Authors.FindAsync(authorId);
            if (author == null)
            {
                throw new InvalidOperationException($"Author with id: {authorId} does not exists");
            }
            _context.BookAuthors.Add(new BookAuthor(0, bookId, authorId));
        }
    }

    private async Task<int> CreateBook(BookCreateDto bookToCreate)
    {
        var book = new Book
        {
            Title = bookToCreate.Title,
            Price = bookToCreate.Price,
            PublishedYear = bookToCreate.PublishedYear,
            ImageUrl= bookToCreate.ImageUrl,
            Description = bookToCreate.Description
        };
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return book.Id;
    }
    #endregion

    public async Task UpdateBookAsync(BookUpdateDto bookToUpdate)
    {
        using var transaction = _context.Database.BeginTransaction();
        try
        {
            // updating book
            var book = new Book
            {
                Id = bookToUpdate.Id,
                Title = bookToUpdate.Title,
                Price = bookToUpdate.Price,
                PublishedYear = bookToUpdate.PublishedYear,
                ImageUrl=bookToUpdate.ImageUrl,
                Description = bookToUpdate.Description
            };
            _context.Books.Update(book);

            // delete all the related book authors to avoid duplicacy
            _context.BookAuthors.RemoveRange(_context.BookAuthors.Where(a => a.BookId == book.Id));

            // delete all the related book genres to avoid duplicacy
            _context.BookGenres.RemoveRange(_context.BookGenres.Where(a => a.BookId == book.Id));

            // adding the BookAuthor
            await AddBookAuthors(bookToUpdate.Id, bookToUpdate.AuthorIds);

            // adding the BookGenre
            await AddBookGenres(bookToUpdate.Id, bookToUpdate.GenreIds);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw ex;
        }
    }

    public async Task<BookReadDto?> GetBookByIdAsync(int bookId)
    {
        BookReadDto? book = await _context.Books
                .Include(x => x.BookAuthors)
                .ThenInclude(x => x.Author)
                .Include(x => x.BookGenres)
                .ThenInclude(x => x.Genre)
                .Where(b => b.Id == bookId)
                .Select(b => new BookReadDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Description = b.Description,
                    PublishedYear = b.PublishedYear,
                    ImageUrl=b.ImageUrl,
                    Price = b.Price,
                    Authors = b.BookAuthors.Select(ab => new AuthorReadDTO(ab.Author.Id, ab.Author.AuthorName)).ToList(),
                    Genres = b.BookGenres.Select(bg => new GenreReadDto(bg.Genre.Id, bg.Genre.GenreName)).ToList()
                }).FirstOrDefaultAsync();
        return book;
    }

    public async Task<PagedList<Book>> GetBooksAsync(BookQueryParameter queryParameters)
    {
        var booksQuery = _context.Books
                .Include(x => x.BookAuthors)
                .ThenInclude(x => x.Author)
                .Include(x => x.BookGenres)
                .ThenInclude(x => x.Genre)
                .AsQueryable();

        // filter by search term
        if (!string.IsNullOrEmpty(queryParameters.SearchTerm))
        {
            booksQuery = booksQuery.Where(a =>
            a.Title.ToLower().Contains(queryParameters.SearchTerm)
            );
        }

        // filter by publish year
        if (queryParameters.PublishedFrom != null && queryParameters.PublishedTo != null)
        {
            booksQuery = booksQuery.Where(a => a.PublishedYear >= queryParameters.PublishedFrom && a.PublishedYear <= queryParameters.PublishedTo);
        }

        // filter by genreIds
        if(queryParameters.GenreIds.Count>0)
        {
            booksQuery = booksQuery.Where(b => b.BookGenres.Any(bg=> queryParameters.GenreIds.Contains(bg.GenreId)));
        }

        if (!string.IsNullOrEmpty(queryParameters.SortBy))
        {
            booksQuery = _sortHelper.ApplySort(booksQuery, queryParameters.SortBy);
        }

        return await PagedList<Book>.ToPagedListAsync(booksQuery, queryParameters.PageNumber, queryParameters.PageSize);
    }


    public async Task DeleteBookAsync(Book book)
    {
        using var transaction = _context.Database.BeginTransaction();
        try
        {
            _context.BookAuthors.RemoveRange(_context.BookAuthors.Where(ba => ba.BookId == book.Id));
            _context.BookGenres.RemoveRange(_context.BookGenres.Where(ba => ba.BookId == book.Id));
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            throw ex;
        }
    }

}
