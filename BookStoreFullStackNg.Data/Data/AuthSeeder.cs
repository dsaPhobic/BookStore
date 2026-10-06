using BookStoreFullStackNg.Data.Constants;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BookStoreFullStackNg.Data.Data;

public static class AuthSeeder
{
    public static async Task SeedData(IApplicationBuilder app)
    {
        try
        {
            using var scope = app.ApplicationServices.CreateScope();
            var authContext = scope.ServiceProvider.GetService<AuthContext>();

            if (authContext.Database.GetPendingMigrations().Count() > 0)
            {
                await authContext.Database.MigrateAsync();
            }
            var userMgr = scope.ServiceProvider.GetService<UserManager<IdentityUser>>();
            var roleMgr = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();
            // adding some roles to db
            if (!await roleMgr.RoleExistsAsync(Roles.Admin))
            {
                await roleMgr.CreateAsync(new IdentityRole(Roles.Admin));
            }
            if (!await roleMgr.RoleExistsAsync(Roles.User))
            {
                await roleMgr.CreateAsync(new IdentityRole(Roles.User));
            }

            // create admin user

            var admin = new IdentityUser
            {
                UserName = "admin@gmail.com",
                Email = "admin@gmail.com",
                EmailConfirmed = true
            };

            var userInDb = await userMgr.FindByEmailAsync(admin.Email);
            if (userInDb is null)
            {
                await userMgr.CreateAsync(admin, "Admin@123");
                await userMgr.AddToRoleAsync(admin, Roles.Admin);
            }
        }
        catch (Exception ex)
        {
            throw;
        }

    }
}