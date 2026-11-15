using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        using var transaction = await _context.Database.BeginTransactionAsync();
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
        catch
        {
            await transaction.RollbackAsync();
            throw;
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
            ImageUrl = bookToCreate.ImageUrl,
            ImagePublicId = bookToCreate.ImagePublicId,
            Description = bookToCreate.Description ?? string.Empty,
            ISBN = bookToCreate.ISBN,
            PageCount = bookToCreate.PageCount,
            Language = bookToCreate.Language,
            Format = bookToCreate.Format,
            Publisher = bookToCreate.Publisher,
            Status = string.IsNullOrWhiteSpace(bookToCreate.Status) ? "Active" : bookToCreate.Status,
            CreatedAt = DateTime.UtcNow
        };
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return book.Id;
    }
    #endregion

    public async Task UpdateBookAsync(BookUpdateDto bookToUpdate)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var book = await _context.Books.FindAsync(bookToUpdate.Id);
            if (book == null)
            {
                throw new InvalidOperationException($"Book with id: {bookToUpdate.Id} not found");
            }

            book.Title = bookToUpdate.Title;
            book.Price = bookToUpdate.Price;
            book.PublishedYear = bookToUpdate.PublishedYear;
            book.ImageUrl = bookToUpdate.ImageUrl;
            book.ImagePublicId = bookToUpdate.ImagePublicId;
            book.Description = bookToUpdate.Description ?? string.Empty;
            book.ISBN = bookToUpdate.ISBN;
            book.PageCount = bookToUpdate.PageCount;
            book.Language = bookToUpdate.Language;
            book.Format = bookToUpdate.Format;
            book.Publisher = bookToUpdate.Publisher;
            book.Status = string.IsNullOrWhiteSpace(bookToUpdate.Status) ? "Active" : bookToUpdate.Status;

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
        catch
        {
            await transaction.RollbackAsync();
            throw;
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
                    ImageUrl = b.ImageUrl,
                    ImagePublicId = b.ImagePublicId,
                    Price = b.Price,
                    ISBN = b.ISBN,
                    PageCount = b.PageCount,
                    Language = b.Language,
                    Format = b.Format,
                    Publisher = b.Publisher,
                    Status = b.Status,
                    CreatedAt = b.CreatedAt,
                    Authors = b.BookAuthors.Select(ab => new AuthorReadDTO
                    {
                        Id = ab.Author.Id,
                        AuthorName = ab.Author.AuthorName,
                        AvatarUrl = ab.Author.AvatarUrl,
                        Nationality = ab.Author.Nationality
                    }).ToList(),
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

        // filter by search term (Title or ISBN)
        if (!string.IsNullOrEmpty(queryParameters.SearchTerm))
        {
            var term = queryParameters.SearchTerm.ToLower();
            booksQuery = booksQuery.Where(a =>
                a.Title.ToLower().Contains(term) ||
                (a.ISBN != null && a.ISBN.ToLower().Contains(term))
            );
        }

        // filter by publish year
        if (queryParameters.PublishedFrom != null && queryParameters.PublishedTo != null)
        {
            booksQuery = booksQuery.Where(a => a.PublishedYear >= queryParameters.PublishedFrom && a.PublishedYear <= queryParameters.PublishedTo);
        }

        // filter by genreIds
        if (queryParameters.GenreIds.Count > 0)
        {
            booksQuery = booksQuery.Where(b => b.BookGenres.Any(bg => queryParameters.GenreIds.Contains(bg.GenreId)));
        }

        if (!string.IsNullOrEmpty(queryParameters.SortBy))
        {
            booksQuery = _sortHelper.ApplySort(booksQuery, queryParameters.SortBy);
        }
        else
        {
            booksQuery = booksQuery.OrderByDescending(b => b.Id);
        }

        return await PagedList<Book>.ToPagedListAsync(booksQuery, queryParameters.PageNumber, queryParameters.PageSize);
    }

    public async Task DeleteBookAsync(Book book)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.BookAuthors.RemoveRange(_context.BookAuthors.Where(ba => ba.BookId == book.Id));
            _context.BookGenres.RemoveRange(_context.BookGenres.Where(ba => ba.BookId == book.Id));
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}

