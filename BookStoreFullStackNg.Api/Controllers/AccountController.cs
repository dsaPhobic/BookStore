using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.DTOs;
using BookStoreFullStackNg.Data.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreFullStackNg.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AccountController(IAuthService authService, ILogger<AccountController> logger)
        {
            _authService = authService;
        }


        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var token = await _authService.Login(model);
            return Ok(token);
        }

        [HttpPost]
        [Route("signup")]
        public async Task<IActionResult> Signup(RegistrationModel model)
        {
                await _authService.Registeration(model, Roles.User);
                return CreatedAtAction(nameof(Signup), model);
        }
    }
}
