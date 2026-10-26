

using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace BookStoreFullStackNg.IntegratedTests;


public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string TestUserRolesHeader = "X-TestUserRoles";
    public TestAuthHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger,
        UrlEncoder encoder, ISystemClock clock)
        : base(options, logger, encoder, clock)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Check for a header to simulate unauthenticated user
        if (Request.Headers.ContainsKey("X-ForceUnAuthenticated"))
        {
            return Task.FromResult(AuthenticateResult.Fail("Unauthenticated user"));
        }
        var rolesHeader = Request.Headers[TestUserRolesHeader].FirstOrDefault() ?? "User";
        var roles = rolesHeader.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

        string username = Request.Headers["X-UserName"].FirstOrDefault() ?? "";
        var claims = new List<Claim>();

        if (string.IsNullOrEmpty(username))
        {
            claims = [ new Claim(ClaimTypes.Name, "TestUser")];
        }
        else
        {
            claims = [new Claim(ClaimTypes.Name, username)];
        }

        // Add role claims after trimming whitespace
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role.Trim()));
        }

        var identity = new ClaimsIdentity(claims, "TestScheme");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "TestScheme");

        return Task.FromResult(AuthenticateResult.Success(ticket));

    }
}