using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Common;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using BookStoreFullStackNg.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BookStoreFullStackNg.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = Roles.Admin)]
public class BooksController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IBookRepository _bookRepo;
    private readonly ICloudinaryService? _cloudinaryService;
    private readonly IIsbnLookupService? _isbnLookupService;
    private readonly BookStoreContext? _context;

    [ActivatorUtilitiesConstructor]
    public BooksController(
        IMapper mapper,
        IBookRepository bookRepo,
        ICloudinaryService? cloudinaryService = null,
        IIsbnLookupService? isbnLookupService = null,
        BookStoreContext? context = null)
    {
        _mapper = mapper;
        _bookRepo = bookRepo;
        _cloudinaryService = cloudinaryService;
        _isbnLookupService = isbnLookupService;
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddBook([FromForm] BookCreateDto bookCreateDto, IOutputCacheStore cache)
    {
        if (bookCreateDto.ImageFile?.Length > 3 * 1024 * 1024)
        {
            throw new BadRequestException("File size should not exceed 3 MB");
        }

        if (bookCreateDto.ImageFile != null && _cloudinaryService != null)
        {
            var uploadResult = await _cloudinaryService.UploadImageAsync(bookCreateDto.ImageFile, "books", 400, 600);
            bookCreateDto.ImageUrl = uploadResult.Url;
            bookCreateDto.ImagePublicId = uploadResult.PublicId;
        }
        else if (_cloudinaryService != null && !string.IsNullOrWhiteSpace(bookCreateDto.ImageUrl) && IsRemoteUrl(bookCreateDto.ImageUrl) && !IsCloudinaryUrl(bookCreateDto.ImageUrl))
        {
            var uploadResult = await _cloudinaryService.UploadImageFromUrlAsync(bookCreateDto.ImageUrl, "books", 400, 600);
            if (!string.IsNullOrEmpty(uploadResult.Url))
            {
                bookCreateDto.ImageUrl = uploadResult.Url;
                bookCreateDto.ImagePublicId = uploadResult.PublicId;
            }
        }

        BookReadDto createdBook = await _bookRepo.AddBookAsync(bookCreateDto);

        // evicting the cache
        await cache.EvictByTagAsync("tag-book", default);
        return CreatedAtRoute(nameof(GetBookById), new { id = createdBook.Id }, createdBook);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromForm] BookUpdateDto bookToUpdate, IOutputCacheStore cache)
    {
        if (id != bookToUpdate.Id)
        {
            throw new BadRequestException("Id mismatch");
        }

        var existingBook = await _bookRepo.GetBookByIdAsync(id);
        if (existingBook == null)
        {
            throw new NotFoundException($"Book with id:{id} does not found");
        }

        if (bookToUpdate.ImageFile != null)
        {
            if (bookToUpdate.ImageFile.Length > 3 * 1024 * 1024)
            {
                throw new BadRequestException("File size should not exceed 3 MB");
            }

            if (_cloudinaryService != null)
            {
                var uploadResult = await _cloudinaryService.UploadImageAsync(bookToUpdate.ImageFile, "books", 400, 600);

                // Delete old image from Cloudinary
                if (!string.IsNullOrEmpty(existingBook.ImagePublicId))
                {
                    await _cloudinaryService.DeleteImageAsync(existingBook.ImagePublicId);
                }

                bookToUpdate.ImageUrl = uploadResult.Url;
                bookToUpdate.ImagePublicId = uploadResult.PublicId;
            }
        }
        else if (_cloudinaryService != null && !string.IsNullOrWhiteSpace(bookToUpdate.ImageUrl) && IsRemoteUrl(bookToUpdate.ImageUrl) && !IsCloudinaryUrl(bookToUpdate.ImageUrl))
        {
            var uploadResult = await _cloudinaryService.UploadImageFromUrlAsync(bookToUpdate.ImageUrl, "books", 400, 600);
            if (!string.IsNullOrEmpty(uploadResult.Url))
            {
                if (!string.IsNullOrEmpty(existingBook.ImagePublicId) && existingBook.ImagePublicId != uploadResult.PublicId)
                {
                    await _cloudinaryService.DeleteImageAsync(existingBook.ImagePublicId);
                }
                bookToUpdate.ImageUrl = uploadResult.Url;
                bookToUpdate.ImagePublicId = uploadResult.PublicId;
            }
        }
        else
        {
            // Preserve existing image if no new file is uploaded
            bookToUpdate.ImageUrl = existingBook.ImageUrl;
            bookToUpdate.ImagePublicId = existingBook.ImagePublicId;
        }

        await _bookRepo.UpdateBookAsync(bookToUpdate);

        // evicting cache
        await cache.EvictByTagAsync("tag-book", default);

        BookReadDto? bookToReturn = await _bookRepo.GetBookByIdAsync(bookToUpdate.Id);
        return Ok(bookToReturn);
    }

    [AllowAnonymous]
    [OutputCache(VaryByQueryKeys = new[] { "PageSize", "PageNumber", "SortBy", "SearchTerm", "PublishedFrom", "PublishedTo", "MinPrice", "MaxPrice", "GenreIds" })]
    [HttpGet]
    public async Task<IActionResult> GetBooks([FromQuery] BookQueryParameter queryParameter)
    {
        ValidateBookQuery(queryParameter);

        var pagedBooks = await _bookRepo.GetBooksAsync(queryParameter);
        var books = pagedBooks.Items.Select(b =>
            new BookReadDto
            {
                Id = b.Id,
                Title = b.Title,
                Description = b.Description,
                Price = b.Price,
                ImageUrl = b.ImageUrl,
                ImagePublicId = b.ImagePublicId,
                PublishedYear = b.PublishedYear,
                ISBN = b.ISBN,
                PageCount = b.PageCount,
                Language = b.Language,
                Format = b.Format,
                Publisher = b.Publisher,
                Status = b.Status,
                CreatedAt = b.CreatedAt,
                Authors = b.BookAuthors.Select(ba => new AuthorReadDTO
                {
                    Id = ba.Author.Id,
                    AuthorName = ba.Author.AuthorName,
                    AvatarUrl = ba.Author.AvatarUrl,
                    Nationality = ba.Author.Nationality
                }).ToList(),
                Genres = b.BookGenres.Select(bg => new GenreReadDto(bg.Genre.Id, bg.Genre.GenreName)).ToList()
            }).ToList();

        var newBookPagedList = new PagedList<BookReadDto>(books, pagedBooks.TotalCount, pagedBooks.PageNumber, pagedBooks.PageSize);
        return Ok(newBookPagedList);
    }

    private static void ValidateBookQuery(BookQueryParameter queryParameter)
    {
        if (queryParameter.PageSize <= 0)
        {
            throw new BadRequestException("Page size must be greater than zero");
        }

        if (queryParameter.PublishedFrom.HasValue
            && queryParameter.PublishedTo.HasValue
            && queryParameter.PublishedFrom > queryParameter.PublishedTo)
        {
            throw new BadRequestException("Published from year cannot be greater than published to year");
        }

        if (queryParameter.MinPrice < 0 || queryParameter.MaxPrice < 0)
        {
            throw new BadRequestException("Price filters cannot be negative");
        }

        if (queryParameter.MinPrice.HasValue
            && queryParameter.MaxPrice.HasValue
            && queryParameter.MinPrice > queryParameter.MaxPrice)
        {
            throw new BadRequestException("Minimum price cannot be greater than maximum price");
        }
    }

    [HttpGet("{id}", Name = nameof(GetBookById))]
    [AllowAnonymous]
    public async Task<IActionResult> GetBookById(int id)
    {
        BookReadDto? book = await _bookRepo.GetBookByIdAsync(id);
        if (book == null)
        {
            throw new NotFoundException($"Book with id:{id} does not found");
        }
        return Ok(book);
    }

    [HttpGet("{id}/related")]
    [AllowAnonymous]
    [OutputCache(VaryByQueryKeys = ["limit"])]
    public async Task<IActionResult> GetRelatedBooks(int id, [FromQuery] int limit = 4)
    {
        if (limit is < 1 or > 12)
        {
            throw new BadRequestException("Related books limit must be between 1 and 12");
        }

        BookReadDto? currentBook = await _bookRepo.GetBookByIdAsync(id);
        if (currentBook == null)
        {
            throw new NotFoundException($"Book with id:{id} does not found");
        }

        var relatedBooks = await _bookRepo.GetRelatedBooksAsync(id, limit);
        return Ok(relatedBooks);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id, IOutputCacheStore cache)
    {
        BookReadDto? existingBook = await _bookRepo.GetBookByIdAsync(id);
        if (existingBook == null)
        {
            throw new NotFoundException($"Book with id:{id} does not found");
        }

        var book = await _bookRepo.GetBookByIdAsync(id);
        Book bookEntity = new Book
        {
            Id = existingBook.Id,
            Title = existingBook.Title,
            Description = existingBook.Description
        };

        await _bookRepo.DeleteBookAsync(bookEntity);

        if (!string.IsNullOrEmpty(existingBook.ImagePublicId) && _cloudinaryService != null)
        {
            await _cloudinaryService.DeleteImageAsync(existingBook.ImagePublicId);
        }

        await cache.EvictByTagAsync("tag-book", default);
        return NoContent();
    }

    [HttpGet("isbn-lookup/{isbn}")]
    [AllowAnonymous]
    public async Task<IActionResult> LookupByIsbn(string isbn)
    {
        if (string.IsNullOrWhiteSpace(isbn))
        {
            throw new BadRequestException("ISBN cannot be empty.");
        }

        if (_isbnLookupService == null)
        {
            return Ok(new IsbnLookupResultDto { Found = false, ISBN = isbn });
        }

        var result = await _isbnLookupService.LookupByIsbnAsync(isbn);
        if (result.Found && result.Authors.Count > 0 && _context != null)
        {
            foreach (var authorName in result.Authors)
            {
                if (string.IsNullOrWhiteSpace(authorName)) continue;
                var trimmed = authorName.Trim();
                var existingAuthor = await _context.Authors.FirstOrDefaultAsync(a => a.AuthorName.ToLower() == trimmed.ToLower());
                if (existingAuthor == null)
                {
                    existingAuthor = new Author { AuthorName = trimmed };
                    _context.Authors.Add(existingAuthor);
                    await _context.SaveChangesAsync();
                }

                if (!result.AuthorIds.Contains(existingAuthor.Id))
                {
                    result.AuthorIds.Add(existingAuthor.Id);
                    result.MatchedAuthors.Add(new AuthorLookupMatchDto
                    {
                        Id = existingAuthor.Id,
                        AuthorName = existingAuthor.AuthorName
                    });
                }
            }
        }
        return Ok(result);
    }

    private static bool IsRemoteUrl(string? url) =>
        !string.IsNullOrWhiteSpace(url) &&
        (url.StartsWith("http://", StringComparison.OrdinalIgnoreCase) ||
         url.StartsWith("https://", StringComparison.OrdinalIgnoreCase));

    private static bool IsCloudinaryUrl(string? url) =>
        !string.IsNullOrWhiteSpace(url) &&
        url.Contains("res.cloudinary.com", StringComparison.OrdinalIgnoreCase);
}
