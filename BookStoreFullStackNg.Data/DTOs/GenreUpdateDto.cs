using System;
using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.DTOs;

public class GenreUpdateDto
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string GenreName { get; set; } = string.Empty;
}
