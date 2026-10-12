using BookStoreFullStackNg.Data.Domain;

namespace BookStoreFullStackNg.Data.Reopositories.Interfaces;

public interface IGenreRepository
{
    public Task<Genre> AddGenre(Genre genre);
    public Task<Genre> UpdateGenre(Genre genre);
    public Task DeleteGenre(Genre genre);
    public Task<IEnumerable<Genre>> GetGenres();
    public Task<Genre?> GetGenreById(int id);
}
