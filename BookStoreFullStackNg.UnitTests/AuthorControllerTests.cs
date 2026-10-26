using AutoMapper;
using BookStoreFullStackNg.Api.Controllers;
using BookStoreFullStackNg.Api.Exceptions;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.DTOs.Author;
using BookStoreFullStackNg.Data.DTOs.Common;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;

namespace BookStoreFullStackNg.UnitTests;

public class AuthorControllerTests
{
    private readonly IAuthorRepository _authorRepository;
    private readonly IMapper _mapper;
    private readonly AuthorController _authorController;

    private static List<Author> authors = [
                                           new Author{Id=1,AuthorName="Author 1"},
                                           new Author{Id=2,AuthorName="Author 2"}
                                          ];

    public AuthorControllerTests()
    {
        _authorRepository = Substitute.For<IAuthorRepository>();
        _mapper = Substitute.For<IMapper>();
        _authorController = new AuthorController(_authorRepository, _mapper);
    }

    [Fact]
    public async Task GetAuthors_ReturnsOk_WithAuthorsList()
    {
        // Arrange
        var queryParameters = new AuthorQueryParameters();
        var pagedList = new PagedList<Author>(authors, authors.Count, 1, 10);
        _authorRepository.GetAuthors(queryParameters).Returns(pagedList);
        var authorReadDto = authors.Select(a => new AuthorReadDTO { Id = a.Id, AuthorName = a.AuthorName });
        _mapper.Map<IEnumerable<AuthorReadDTO>>(pagedList.Items).Returns(authorReadDto);

        // Act
        var result = await _authorController.GetAuthors(queryParameters);

        // Assert
        var okObjectResult = Assert.IsType<OkObjectResult>(result);
        var newList = Assert.IsType<PagedList<AuthorReadDTO>>(okObjectResult.Value);
        Assert.Equal(pagedList.Items.Count, newList.Items.Count);
    }

    [Fact]
    public async Task CreateAuthor_ReturnsCreatedAtActionResult_With_AuthorReadDto()
    {
        // Arrange
        AuthorCreateDTO authorToAdd = new() { AuthorName = "test" };
        Author expectedAuthor = new() { Id = 1, AuthorName = "test" };
        AuthorReadDTO authorReadDTO = new() { Id = 1, AuthorName = "test" };

        _mapper.Map<Author>(Arg.Any<AuthorCreateDTO>()).Returns(expectedAuthor);
        _authorRepository.CreateAuthor(Arg.Any<Author>()).Returns(expectedAuthor);
        _mapper.Map<AuthorReadDTO>(Arg.Any<Author>()).Returns(authorReadDTO);

        // Act
        var result = await _authorController.CreateAuthor(authorToAdd);

        // Assert
        var createdResult = Assert.IsType<CreatedAtRouteResult>(result);
        Assert.Equal(nameof(_authorController.GetAuthor), createdResult.RouteName);
        Assert.Equal(1, createdResult.RouteValues["id"]);

        var createdAuthor = Assert.IsType<AuthorReadDTO>(createdResult.Value);

        Assert.NotNull(createdAuthor);
        Assert.Equal(authorReadDTO.Id, createdAuthor.Id);

    }

    [Fact]
    public async Task GetAuthor_ReturnsOk_With_AuthorReadDto()
    {
        // Arrange
        var expectedAuthor = authors.First();
        _authorRepository.GetAuthor(Arg.Any<int>()).Returns(expectedAuthor);
        var authorReadDto = new AuthorReadDTO { Id = expectedAuthor.Id, AuthorName = expectedAuthor.AuthorName };
        _mapper.Map<AuthorReadDTO>(Arg.Any<Author>()).Returns(authorReadDto);

        // Act
        var result = await _authorController.GetAuthor(expectedAuthor.Id);

        // Assert
        var okObjectResult = Assert.IsType<OkObjectResult>(result);
        var author = Assert.IsType<AuthorReadDTO>(okObjectResult.Value);
        Assert.NotNull(author);
        Assert.Equal(expectedAuthor.Id, author.Id);
        Assert.Equal(expectedAuthor.AuthorName, author.AuthorName);
    }

    [Fact]
    public async Task GetAuthor_ThrowsNotFoundFoundException_WhenAuthorDoesNotExist()
    {
        // Arrange
        int id = 9999;

        // Act and  Assert
        await Assert.ThrowsAsync<NotFoundException>(() => _authorController.GetAuthor(id));
    }

    [Fact]
    public async Task DeleteAuthor_ReturnsNoContent_OnDeletion()
    {
        // Arrange
        var authorToDelete = authors.First();
        _authorRepository.GetAuthor(authorToDelete.Id).Returns(authorToDelete);

        // Act
        var result = await _authorController.DeleteAuthor(authorToDelete.Id);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteAuthor_ThrowsNotFoundFoundException_WhenAuthorDoesNotExist()
    {
        // Act and Assert
        await Assert.ThrowsAsync<NotFoundException>(() => _authorController.DeleteAuthor(999));
    }

    [Fact]
    public async Task UpdateAuthor_ReturnsNoContent_OnSuccess()
    {
        // arrange
        var authorToUpdate = authors.First();
        var authorUpdateDto = new AuthorUpdateDTO { Id = authorToUpdate.Id, AuthorName = authorToUpdate.AuthorName };
        _mapper.Map<Author>(Arg.Any<AuthorUpdateDTO>()).Returns(authorToUpdate);
        _authorRepository.GetAuthor(authorToUpdate.Id).Returns(authorToUpdate);
        //_authorRepository.UpdateAuthor(authorToUpdate).Returns();

        // act
        var result = await _authorController.UpdateAuthor(authorToUpdate.Id, authorUpdateDto);

        // assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task UpdateGenre_ThrowsBadRequest_WhenIdMismatch()
    {
        // arrange
        var id = 1;
        var authorToUpdate = new AuthorUpdateDTO { Id = 2, AuthorName = "test" };

        // act and assert
        await Assert.ThrowsAsync<BadRequestException>(() => _authorController.UpdateAuthor(id, authorToUpdate));
    }

    [Fact]
    public async Task UpdateGenre_ThrowsNotFound_WhenPersonNotFound()
    {
        // arrange
        var id = 999;
        var authorToUpdate = new AuthorUpdateDTO { Id = id, AuthorName = "test" };

        // act and assert
        await Assert.ThrowsAsync<NotFoundException>(() => _authorController.UpdateAuthor(id, authorToUpdate));
    }

}
