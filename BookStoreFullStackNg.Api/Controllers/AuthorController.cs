using AutoMapper;
using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Common;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreFullStackNg.Api.Controllers
{
    [Route("api/authors")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AuthorController : ControllerBase
    {
        private readonly IAuthorRepository _authorRepository;
        private readonly IMapper _mapper;

        public AuthorController(IAuthorRepository authorRepository, IMapper mapper)
        {
            _authorRepository = authorRepository;
            _mapper = mapper;
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

        [HttpPost]
        public async Task<IActionResult> CreateAuthor(AuthorCreateDTO authorToCreate)
        {
            var author = _mapper.Map<Author>(authorToCreate);
            var createdAuthor = await _authorRepository.CreateAuthor(author);
            return CreatedAtRoute(nameof(GetAuthor), new { id = author.Id }, _mapper.Map<AuthorReadDTO>(author));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuthor(int id, [FromBody] AuthorUpdateDTO authorToUpdate)
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
            var author = _mapper.Map<Author>(authorToUpdate);
            await _authorRepository.UpdateAuthor(author);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var existingAuthor = await _authorRepository.GetAuthor(id);
            if (existingAuthor == null)
            {
                throw new NotFoundException($"Author with id : {id} not found");
            }
            await _authorRepository.DeleteAuthor(existingAuthor);
            return NoContent();
        }
    }
}
