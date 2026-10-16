using AutoMapper;
using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreFullStackNg.Api.Controllers
{
    [Route("api/genres")]
    [Authorize(Roles ="Admin")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IGenreRepository _genreRepository;

        public GenreController(IMapper mapper, IGenreRepository genreRepository)
        {
            _mapper = mapper;
            _genreRepository = genreRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateGenre(GenreCreateDto genreToAdd)
        {
            var genre = _mapper.Map<Genre>(genreToAdd);
            var createdGenre = await _genreRepository.AddGenre(genre);
            return CreatedAtRoute(nameof(GetGenreById), new { id = createdGenre.Id }, _mapper.Map<GenreReadDto>(createdGenre));
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetGenres()
        {
            var genres = await _genreRepository.GetGenres();
            return Ok(_mapper.Map<IEnumerable<GenreReadDto>>(genres));
        }

        [HttpGet("{id}", Name = "GetGenreById")]
        public async Task<IActionResult> GetGenreById(int id)
        {
            var genre = await _genreRepository.GetGenreById(id);
            if (genre == null)
            {
                throw new NotFoundException("Genre not found");
            }
            return Ok(_mapper.Map<GenreReadDto>(genre));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            var genre = await _genreRepository.GetGenreById(id);
            if (genre == null)
            {
                throw new NotFoundException("Genre not found");
            }
            await _genreRepository.DeleteGenre(genre);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGenre(int id, GenreUpdateDto genreToUpdate)
        {
            if (id != genreToUpdate.Id)
            {
                throw new BadRequestException("Id mismatch");
            }
            var genre = await _genreRepository.GetGenreById(genreToUpdate.Id);
            if (genre == null)
            {
                throw new NotFoundException("Genre not found");
            }
            genre = _mapper.Map<Genre>(genreToUpdate);
            await _genreRepository.UpdateGenre(genre);
            return NoContent();
        }
    }
}
