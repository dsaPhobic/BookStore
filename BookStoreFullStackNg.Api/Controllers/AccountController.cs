using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.DTOs;
using BookStoreFullStackNg.Data.DTOs.Order;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using BookStoreFullStackNg.Data.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreFullStackNg.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserRepository _userRepository;
        public AccountController(
            IAuthService authService,
            IUserRepository userRepository,
            ILogger<AccountController> logger)
        {
            _authService = authService;
            _userRepository = userRepository;
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

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> Profile()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrWhiteSpace(username))
            {
                return Unauthorized();
            }

            var user = await _userRepository.GetUserByUserNameAsync(username);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new UserProfileDto
            {
                Name = user.Name,
                Email = user.Username
            });
        }
    }
}
