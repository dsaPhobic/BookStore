using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Data.Constants;
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

    [ActivatorUtilitiesConstructor]
    public BooksController(
        IMapper mapper,
        IBookRepository bookRepo,
        ICloudinaryService? cloudinaryService = null,
        IIsbnLookupService? isbnLookupService = null)
    {
        _mapper = mapper;
        _bookRepo = bookRepo;
        _cloudinaryService = cloudinaryService;
        _isbnLookupService = isbnLookupService;
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
    [OutputCache(VaryByQueryKeys = new[] { "PageSize", "PageNumber", "SortBy", "SearchTerm", "PublishedFrom", "PublishedTo", "GenreIds" })]
    [HttpGet]
    public async Task<IActionResult> GetBooks([FromQuery] BookQueryParameter queryParameter)
    {
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
        return Ok(result);
    }
}
