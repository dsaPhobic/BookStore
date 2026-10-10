using BookStoreFullStackNg.Data.DTOs;

namespace BookStoreFullStackNg.Data.Services;
public interface IAuthService
{
    Task Registeration(RegistrationModel model, string role);
    Task<string> Login(LoginModel model);
}