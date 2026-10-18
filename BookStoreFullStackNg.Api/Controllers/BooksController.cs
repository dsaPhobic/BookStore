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

namespace BookStoreFullStackNg.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles =Roles.Admin)]
public class BooksController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IBookRepository _bookRepo;
    private readonly IFileService _fileService;
    public BooksController(IMapper mapper, IBookRepository bookRepo, IFileService fileService)
    {
        _mapper = mapper;
        _bookRepo = bookRepo;
        _fileService = fileService;

    }

    [HttpPost]
    public async Task<IActionResult> AddBook(BookCreateDto bookCreateDto,IOutputCacheStore cache)
    {
        if (bookCreateDto.ImageFile?.Length > 1 * 1024 * 1024)
        {
            throw new BadRequestException("File size should not exceed 1 MB");
        }
        if (bookCreateDto.ImageFile != null)
        {
            string[] allowedFileExtentions = [".jpg", ".jpeg", ".png",".jfif"];
            string createdImageName = await _fileService.SaveFileAsync(bookCreateDto.ImageFile, allowedFileExtentions);
            bookCreateDto.ImageUrl = createdImageName;
        }

        BookReadDto createdBook = await _bookRepo.AddBookAsync(bookCreateDto);
        // evicting the cache
        await cache.EvictByTagAsync("tag-book", default);
        return CreatedAtRoute(nameof(GetBookById), new { id = createdBook.Id }, createdBook);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, BookUpdateDto bookToUpdate,IOutputCacheStore cache)
    {
        if (id != bookToUpdate.Id)
        {
            throw new BadRequestException($"Id mismatch");
        }

        var existingBook = await _bookRepo.GetBookByIdAsync(id);
        if (existingBook == null)
        {
            throw new NotFoundException($"Book with id:{id} does not found");
        }

        // If book have image, but you forget to pass it
        if(string.IsNullOrWhiteSpace(existingBook.ImageUrl)==false && string.IsNullOrWhiteSpace(bookToUpdate.ImageUrl))
        {
            throw new NotFoundException("You are not passing the imageUrl, while this book has an image");
        }

        // if someone is manually trying to change the imageUrl
        // if book has image, you are not uploading the file but you are passing the different url than the existing one
        if (bookToUpdate.ImageFile == null && existingBook.ImageUrl != bookToUpdate.ImageUrl)
        {
            throw new NotFoundException("Invalid imageUrl");
        }

        string? oldImage = existingBook.ImageUrl;
        if (bookToUpdate.ImageFile != null)
        {
            if (bookToUpdate.ImageFile?.Length > 1 * 1024 * 1024)
            {
                throw new BadRequestException("File size should not exceed 1 MB");
            }
            string[] allowedFileExtentions = [".jpg", ".jpeg", ".png",".jfif"];
            string createdImageName = await _fileService.SaveFileAsync(bookToUpdate.ImageFile!, allowedFileExtentions);
            bookToUpdate.ImageUrl = createdImageName;
        }

        await _bookRepo.UpdateBookAsync(bookToUpdate);

        // if image is updated, then we have to delete old image from directory
        if (bookToUpdate.ImageFile != null)
        {
            // however, this condition will never meet
            if (string.IsNullOrWhiteSpace(oldImage))
            {
                throw new BadRequestException("Old image is null, so can't be deleted");
            }
            _fileService.DeleteFile(oldImage);
        }

        // evicting cache
        await cache.EvictByTagAsync("tag-book", default);


        // return the update entries
        BookReadDto? bookToReturn = await _bookRepo.GetBookByIdAsync(bookToUpdate.Id);

        return Ok(bookToReturn);
    }


    [AllowAnonymous]
    [OutputCache(VaryByQueryKeys = ["PageSize", "PageNumber", "SortBy", "SearchTerm", "PublishedFrom", "PublishedTo", "GenreIds"])]
    [HttpGet]
    public async Task<IActionResult> GetBooks([FromQuery] BookQueryParameter queryParameter)
    {
        var pagedBooks = await _bookRepo.GetBooksAsync(queryParameter); // have related data
        var books = pagedBooks.Items.Select(b =>
            new BookReadDto
            {
                Id = b.Id,
                Title = b.Title,
                Description = b.Description,
                Price = b.Price,
                ImageUrl = b.ImageUrl,
                PublishedYear = b.PublishedYear,
                Authors = b.BookAuthors.Select(ba => new AuthorReadDTO(ba.Author.Id, ba.Author.AuthorName)).ToList(),
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
    public async Task<IActionResult> DeleteBook(int id,IOutputCacheStore cache)
    {
        BookReadDto? existingBook = await _bookRepo.GetBookByIdAsync(id);
        if (existingBook == null)
        {
            throw new NotFoundException($"Book with id:{id} does not found");
        }
        Book book = _mapper.Map<Book>(existingBook);
        await _bookRepo.DeleteBookAsync(book);
        // After deleting product from database,remove file from directory.
        if (string.IsNullOrEmpty(existingBook.ImageUrl) == false)
        {
            _fileService.DeleteFile(existingBook.ImageUrl);
        }
        await cache.EvictByTagAsync("tag-book", default);

        return NoContent();
    }
}
