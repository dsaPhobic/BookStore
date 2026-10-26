using AutoMapper;
using BookStoreFullStackNg.Api.Controllers;
using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;

namespace BookStoreFullStackNg.UnitTests;

public class GenreControllerTests
{

    private readonly IGenreRepository _genreRepository;
    private readonly IMapper _mapper;
    private readonly GenreController _genreController;

    static List<Genre> Genres = new List<Genre>
    {
       new Genre{Id=1, GenreName="Horror"},
       new Genre{Id=2, GenreName="Action"},
    };

    public GenreControllerTests()
    {
        _genreRepository = Substitute.For<IGenreRepository>();
        _mapper = Substitute.For<IMapper>();
        _genreController = new GenreController(_mapper, _genreRepository);
    }

    [Fact]
    public async Task GetGenres_ReturnsOk_With_GenreList()
    {
        // Arrange
        _genreRepository.GetGenres().Returns(Genres);
        _mapper.Map<IEnumerable<GenreReadDto>>(Arg.Any<List<Genre>>())
        .Returns(Genres.Select(g => new GenreReadDto { Id = g.Id, GenreName = g.GenreName }).ToList());

        // Act
        var result = await _genreController.GetGenres();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var genreList = Assert.IsType<List<GenreReadDto>>(okResult.Value);
        Assert.True(genreList.Count > 0);
    }

    [Fact]
    public async Task CreateGenre_ReturnsCreatedAtActionResult_With_GenreReadDto()
    {
        // Arrange
        var genreToAdd = new GenreCreateDto { GenreName = "Fantasy" };
        var expectedGenre = new Genre { Id = 1, GenreName = "Fantasy" };
        var expectedGenreReadDto = new GenreReadDto { Id = 1, GenreName = "Fantasy" };

        _mapper.Map<Genre>(Arg.Any<GenreCreateDto>()).Returns(expectedGenre);
        _genreRepository.AddGenre(Arg.Any<Genre>()).Returns(expectedGenre);
        _mapper.Map<GenreReadDto>(Arg.Any<Genre>()).Returns(expectedGenreReadDto);

        // Act
        var result = await _genreController.CreateGenre(genreToAdd);

        // Assert
        var createdResult = Assert.IsType<CreatedAtRouteResult>(result);
        Assert.Equal(nameof(_genreController.GetGenreById), createdResult.RouteName);
        Assert.Equal(1, createdResult.RouteValues["id"]);

        var genreReadDto = Assert.IsType<GenreReadDto>(createdResult.Value);
        Assert.Equal(expectedGenreReadDto.Id, genreReadDto.Id);
        Assert.Equal(expectedGenreReadDto.GenreName, genreReadDto.GenreName);

    }

    [Fact]
    public async Task GetGenreById_ReturnsOk_With_GenreReadDto()
    {
        // Arrange
        var expectedGenre = Genres.First();
        _genreRepository.GetGenreById(expectedGenre.Id).Returns(expectedGenre);
        _mapper.Map<GenreReadDto>(Arg.Any<Genre>()).Returns(new GenreReadDto { Id = expectedGenre.Id, GenreName = expectedGenre.GenreName });

        // Act
        var result = await _genreController.GetGenreById(expectedGenre.Id);

        // Response
        var okResult = Assert.IsType<OkObjectResult>(result);
        var genreReadDto = Assert.IsType<GenreReadDto>(okResult.Value);
        Assert.Equal(expectedGenre.Id, genreReadDto.Id);
    }

    [Fact]
    public async Task GetGenreById_ThrowsNotFoundFoundException_WhenGenreNotExists()
    {
        // Arrange
        int id = 999;

        // Act &  Assert
        await Assert.ThrowsAsync<NotFoundException>(() => _genreController.GetGenreById(id));
    }

    [Fact]
    public async Task DeleteGenre_ReturnsNoContent_OnDeletion()
    {
        // Arrange 
        Genre genreToDelete = Genres.First();
        _genreRepository.GetGenreById(genreToDelete.Id).Returns(genreToDelete);

        // Act
        var result = await _genreController.DeleteGenre(genreToDelete.Id);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteGenre_ThrowsNotFoundException_WhenGenreNotExists()
    {
        // arrange

        // act and assert
        await Assert.ThrowsAsync<NotFoundException>(() => _genreController.DeleteGenre(999));
    }

    [Fact]
    public async Task UpdateGenre_Returns_BadRequestException_WhenIdMismatch()
    {
        // Arrange
        var id = 1;
        var genreToUpdate = new GenreUpdateDto { Id = 2, GenreName = "Fantasy" };

        // Act and assert
        await Assert.ThrowsAsync<BadRequestException>(() => _genreController.UpdateGenre(id, genreToUpdate));
    }

    [Fact]
    public async Task UpdateGenre_Returns_NotFoundException_WhenGenreNotExists()
    {
        // Arrange
        var genreToUpdate = new GenreUpdateDto { Id = 999, GenreName = "Fantasy" };
        //Act and Assert
        await Assert.ThrowsAsync<NotFoundException>(() => _genreController.UpdateGenre(999, genreToUpdate));
    }

    [Fact]
    public async Task UpdateGenre_ReturnsNoContent_OnSuccessfulUpdate()
    {
        // Arrange
        Genre genreToUpdate = Genres.First();
        _mapper.Map<Genre>(Arg.Any<GenreUpdateDto>()).Returns(genreToUpdate);
        _genreRepository.GetGenreById(genreToUpdate.Id).Returns(genreToUpdate);
        _genreRepository.UpdateGenre(Arg.Any<Genre>()).Returns(genreToUpdate);

        // Act
        var result = await _genreController.UpdateGenre(genreToUpdate.Id, new GenreUpdateDto { Id = genreToUpdate.Id, GenreName = genreToUpdate.GenreName });

        // Assert
        Assert.IsType<NoContentResult>(result);

    }
}