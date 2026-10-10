using System.ComponentModel.DataAnnotations;

namespace BookStoreFullStackNg.Data.DTOs;

public class RegistrationModel
{
    [Required(ErrorMessage = "Name is required")]
    public string? Name { get; set; }

    [EmailAddress]
    [Required(ErrorMessage = "Email is required")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    public string? Password { get; set; }
}