using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Book;
using BookStoreFullStackNg.Data.DTOs.Common;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using BookStoreFullStackNg.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreFullStackNg.Api.Controllers
{
    [Route("api/authors")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly IAuthorRepository _authorRepository;
        private readonly IMapper _mapper;
        private readonly ICloudinaryService? _cloudinaryService;

        public AuthorController(IAuthorRepository authorRepository, IMapper mapper, ICloudinaryService? cloudinaryService = null)
        {
            _authorRepository = authorRepository;
            _mapper = mapper;
            _cloudinaryService = cloudinaryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAuthors([FromQuery] AuthorQueryParameters queryParameters)
        {
            PagedList<Author>? authorPagedData = await _authorRepository.GetAuthors(queryParameters);
            var authors = _mapper.Map<IEnumerable<AuthorReadDTO>>(authorPagedData.Items).ToList();
            var newList = new PagedList<AuthorReadDTO>(authors, authorPagedData.TotalCount, authorPagedData.PageNumber, authorPagedData.PageSize);
            return Ok(newList);
        }

        [HttpGet("{id}", Name = "GetAuthor")]
        public async Task<IActionResult> GetAuthor(int id)
        {
            var author = await _authorRepository.GetAuthor(id);
            if (author == null)
            {
                throw new NotFoundException($"Author with id : {id} not found");
            }
            return Ok(_mapper.Map<AuthorReadDTO>(author));
        }

        [HttpGet("{id}/books")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBooksByAuthor(int id, [FromQuery] BookQueryParameter queryParameters)
        {
            var existingAuthor = await _authorRepository.GetAuthor(id);
            if (existingAuthor == null)
            {
                throw new NotFoundException($"Author with id : {id} not found");
            }

            PagedList<Book> booksPagedData = await _authorRepository.GetBooksByAuthorId(id, queryParameters);
            var books = _mapper.Map<IEnumerable<BookReadDto>>(booksPagedData.Items).ToList();
            var result = new PagedList<BookReadDto>(books, booksPagedData.TotalCount, booksPagedData.PageNumber, booksPagedData.PageSize);
            return Ok(result);
        }

        [HttpGet("{id}/stats")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAuthorStats(int id)
        {
            var stats = await _authorRepository.GetAuthorDetailWithStats(id);
            if (stats == null)
            {
                throw new NotFoundException($"Author with id : {id} not found");
            }
            return Ok(stats);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAuthor([FromForm] AuthorCreateDTO authorToCreate)
        {
            if (authorToCreate.AvatarFile != null)
            {
                if (authorToCreate.AvatarFile.Length > 2 * 1024 * 1024)
                {
                    throw new BadRequestException("Avatar image file size should not exceed 2 MB");
                }
                if (_cloudinaryService != null)
                {
                    var uploadResult = await _cloudinaryService.UploadImageAsync(authorToCreate.AvatarFile, "authors", 300, 300);
                    authorToCreate.AvatarUrl = uploadResult.Url;
                    authorToCreate.AvatarPublicId = uploadResult.PublicId;
                }
            }

            var author = _mapper.Map<Author>(authorToCreate);
            var createdAuthor = await _authorRepository.CreateAuthor(author);
            return CreatedAtRoute(nameof(GetAuthor), new { id = author.Id }, _mapper.Map<AuthorReadDTO>(createdAuthor));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAuthor(int id, [FromForm] AuthorUpdateDTO authorToUpdate)
        {
            if (id != authorToUpdate.Id)
            {
                throw new BadRequestException("Id mismatch");
            }
            var existingAuthor = await _authorRepository.GetAuthor(id);
            if (existingAuthor == null)
            {
                throw new NotFoundException($"Author with id : {id} not found");
            }

            if (authorToUpdate.AvatarFile != null)
            {
                if (authorToUpdate.AvatarFile.Length > 2 * 1024 * 1024)
                {
                    throw new BadRequestException("Avatar image file size should not exceed 2 MB");
                }
                if (_cloudinaryService != null)
                {
                    var uploadResult = await _cloudinaryService.UploadImageAsync(authorToUpdate.AvatarFile, "authors", 300, 300);

                    // If old image existed, delete it
                    if (!string.IsNullOrEmpty(existingAuthor.AvatarPublicId))
                    {
                        await _cloudinaryService.DeleteImageAsync(existingAuthor.AvatarPublicId);
                    }

                    authorToUpdate.AvatarUrl = uploadResult.Url;
                    authorToUpdate.AvatarPublicId = uploadResult.PublicId;
                }
            }
            else
            {
                // Preserve existing avatar if no new file uploaded
                authorToUpdate.AvatarUrl = existingAuthor.AvatarUrl;
                authorToUpdate.AvatarPublicId = existingAuthor.AvatarPublicId;
            }

            var author = _mapper.Map<Author>(authorToUpdate);
            author.CreatedAt = existingAuthor.CreatedAt;
            await _authorRepository.UpdateAuthor(author);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var existingAuthor = await _authorRepository.GetAuthor(id);
            if (existingAuthor == null)
            {
                throw new NotFoundException($"Author with id : {id} not found");
            }

            if (!string.IsNullOrEmpty(existingAuthor.AvatarPublicId) && _cloudinaryService != null)
            {
                await _cloudinaryService.DeleteImageAsync(existingAuthor.AvatarPublicId);
            }

            await _authorRepository.DeleteAuthor(existingAuthor);
            return NoContent();
        }
    }
}
