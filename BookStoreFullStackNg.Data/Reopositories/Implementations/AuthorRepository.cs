using System;
using System.Linq;
using System.Threading.Tasks;
using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Common;
using BookStoreFullStackNg.Data.Helpers;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookStoreFullStackNg.Data.Reopositories.Implementations;

public class AuthorRepository : IAuthorRepository
{
    private readonly BookStoreContext _bookStoreContext;
    private readonly ISortHelper<Author> _sortHelper;

    public AuthorRepository(BookStoreContext bookStoreContext, ISortHelper<Author> sortHelper)
    {
        _bookStoreContext = bookStoreContext;
        _sortHelper = sortHelper;
    }

    public async Task<Author> CreateAuthor(Author author)
    {
        if (author == null)
        {
            throw new ArgumentNullException(nameof(author));
        }
        _bookStoreContext.Authors.Add(author);
        await _bookStoreContext.SaveChangesAsync();
        return author;
    }

    public async Task UpdateAuthor(Author author)
    {
        if (author == null)
        {
            throw new ArgumentNullException(nameof(author));
        }
        _bookStoreContext.Authors.Update(author);
        await _bookStoreContext.SaveChangesAsync();
    }

    public async Task DeleteAuthor(Author author)
    {
        if (author == null)
        {
            throw new ArgumentNullException(nameof(author));
        }
        _bookStoreContext.Remove(author);
        await _bookStoreContext.SaveChangesAsync();
    }

    public async Task<Author?> GetAuthor(int id)
    {
        return await _bookStoreContext.Authors
            .Include(a => a.BookAuthors)
            .Where(a => a.Id == id)
            .AsNoTracking()
            .FirstOrDefaultAsync();
    }

    public async Task<PagedList<Author>> GetAuthors(AuthorQueryParameters queryParameters)
    {
        IQueryable<Author> authorsQuery = _bookStoreContext.Authors
            .Include(a => a.BookAuthors)
            .AsNoTracking();

        // filter by search term
        if (!string.IsNullOrEmpty(queryParameters.SearchTerm))
        {
            var term = queryParameters.SearchTerm.ToLower();
            authorsQuery = authorsQuery.Where(a =>
                a.AuthorName.ToLower().Contains(term) ||
                (a.Nationality != null && a.Nationality.ToLower().Contains(term)));
        }

        if (!string.IsNullOrEmpty(queryParameters.SortBy))
        {
            authorsQuery = _sortHelper.ApplySort(authorsQuery, queryParameters.SortBy);
        }
        else
        {
            authorsQuery = authorsQuery.OrderByDescending(a => a.Id);
        }

        return await PagedList<Author>.ToPagedListAsync(authorsQuery, queryParameters.PageNumber, queryParameters.PageSize);
    }

    public async Task<PagedList<Book>> GetBooksByAuthorId(int authorId, BookQueryParameter queryParameters)
    {
        var booksQuery = _bookStoreContext.Books
            .Include(x => x.BookAuthors)
            .ThenInclude(x => x.Author)
            .Include(x => x.BookGenres)
            .ThenInclude(x => x.Genre)
            .Where(b => b.BookAuthors.Any(ba => ba.AuthorId == authorId))
            .AsQueryable();

        if (!string.IsNullOrEmpty(queryParameters.SearchTerm))
        {
            var term = queryParameters.SearchTerm.ToLower();
            booksQuery = booksQuery.Where(a => a.Title.ToLower().Contains(term));
        }

        if (queryParameters.PublishedFrom != null && queryParameters.PublishedTo != null)
        {
            booksQuery = booksQuery.Where(a => a.PublishedYear >= queryParameters.PublishedFrom && a.PublishedYear <= queryParameters.PublishedTo);
        }

        if (queryParameters.GenreIds.Count > 0)
        {
            booksQuery = booksQuery.Where(b => b.BookGenres.Any(bg => queryParameters.GenreIds.Contains(bg.GenreId)));
        }

        booksQuery = booksQuery.OrderByDescending(b => b.Id);

        return await PagedList<Book>.ToPagedListAsync(booksQuery, queryParameters.PageNumber, queryParameters.PageSize);
    }

    public async Task<AuthorReadDTO?> GetAuthorDetailWithStats(int authorId)
    {
        var author = await _bookStoreContext.Authors
            .Include(a => a.BookAuthors)
            .Where(a => a.Id == authorId)
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (author == null) return null;

        return new AuthorReadDTO
        {
            Id = author.Id,
            AuthorName = author.AuthorName,
            OriginalName = author.OriginalName,
            AvatarUrl = author.AvatarUrl,
            AvatarPublicId = author.AvatarPublicId,
            Bio = author.Bio,
            BirthDate = author.BirthDate,
            Nationality = author.Nationality,
            IsFeatured = author.IsFeatured,
            CreatedAt = author.CreatedAt,
            BooksCount = author.BookAuthors.Count
        };
    }
}
