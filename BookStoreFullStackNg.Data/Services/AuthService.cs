using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

using BookStoreFullStackNg.Data.DTOs;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;

namespace BookStoreFullStackNg.Data.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<IdentityUser> userManager;
    private readonly RoleManager<IdentityRole> roleManager;
    private readonly IConfiguration _configuration;
    private readonly BookStoreContext _bookContext;
    public AuthService(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, BookStoreContext bookContext)
    {
        this.userManager = userManager;
        this.roleManager = roleManager;
        _configuration = configuration;
        _bookContext = bookContext;
    }
    public async Task Registeration(RegistrationModel model, string role)
    {
        // TODO: Make sure the atomicity of whole. Since I am using two db context here, it might be tricky
        using var transaction = await _bookContext.Database.BeginTransactionAsync();
        try
        {
            // saving to user table of book store context
            var userInBookStore = new User
            {
                Name = model.Name,
                Username = model.Email
            };
            _bookContext.Users.Add(userInBookStore);
            await _bookContext.SaveChangesAsync();

            // identity section
            var userExists = await userManager.FindByNameAsync(model.Email);
            if (userExists != null)
                throw new InvalidOperationException("User already exists");

            IdentityUser user = new()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Email,
            };
            var createUserResult = await userManager.CreateAsync(user, model.Password);
            if (!createUserResult.Succeeded)
                throw new Exception("User creation failed! Please check user details and try again.");

            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));

            await userManager.AddToRoleAsync(user, role);
            await transaction.CommitAsync();
        }
        catch(Exception ex)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<string> Login(LoginModel model)
    {
        var user = await userManager.FindByNameAsync(model.Username);
        if (user == null)
            throw new InvalidOperationException("Invalid username");
        if (!await userManager.CheckPasswordAsync(user, model.Password))
            throw new InvalidOperationException("Invalid password");

        var userRoles = await userManager.GetRolesAsync(user);
        var authClaims = new List<Claim>
            {
               new Claim(ClaimTypes.Name, user.UserName),
               new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

        foreach (var userRole in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
        }
        string token = GenerateToken(authClaims);
        return token;
    }


    private string GenerateToken(IEnumerable<Claim> claims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _configuration["JWT:ValidIssuer"],
            Audience = _configuration["JWT:ValidAudience"],
            Expires = DateTime.UtcNow.AddHours(3),
            SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256),
            Subject = new ClaimsIdentity(claims)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
