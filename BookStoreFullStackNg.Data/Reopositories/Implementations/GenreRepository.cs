using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookStoreFullStackNg.Data.Reopositories.Implementations;

public class GenreRepository : IGenreRepository
{
    private readonly BookStoreContext _bookStoreContext;

    public GenreRepository(BookStoreContext bookStoreContext)
    {
        _bookStoreContext = bookStoreContext;
    }

    public async Task<Genre> AddGenre(Genre genre)
    {
        _bookStoreContext.Genres.Add(genre);
        await _bookStoreContext.SaveChangesAsync();
        return genre;
    }

    public async Task DeleteGenre(Genre genre)
    {
        _bookStoreContext.Genres.Remove(genre);
        await _bookStoreContext.SaveChangesAsync();
    }

    public async Task<Genre?> GetGenreById(int id)
    {
        var book = await _bookStoreContext.Genres.AsNoTracking().FirstOrDefaultAsync(a => a.Id == id);
        return book;
    }

    public async Task<IEnumerable<Genre>> GetGenres()
    {
        return await _bookStoreContext.Genres.ToListAsync();
    }

    public async Task<Genre> UpdateGenre(Genre genre)
    {
        _bookStoreContext.Genres.Update(genre);
        await _bookStoreContext.SaveChangesAsync();
        return genre;
    }
}
