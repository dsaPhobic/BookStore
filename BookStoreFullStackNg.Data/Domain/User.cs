using System;
using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.Domain;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(30)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Username { get; set; } = string.Empty;
    public Cart? Cart { get; set; }

    public ICollection<Order> Orders = [];
}
