namespace BookStoreFullStackNg.Data.DTOs;

public class GenreReadDto
{
    public int Id { get; set; }
    public string GenreName { get; set; } = string.Empty;

    public GenreReadDto()
    {
        
    }

    public GenreReadDto(int id,string genreName)
    {
        Id = id;
        GenreName = genreName;
    }
}
