using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.Domain;
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

            if (authContext!.Database.GetPendingMigrations().Any())
            {
                await authContext.Database.MigrateAsync();
            }
            var userMgr = scope.ServiceProvider.GetService<UserManager<IdentityUser>>();
            var roleMgr = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();
            // adding some roles to db
            if (!await roleMgr!.RoleExistsAsync(Roles.Admin))
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

            var userInDb = await userMgr!.FindByEmailAsync(admin.Email);
            if (userInDb is null)
            {
                await userMgr.CreateAsync(admin, "Admin@123");
                await userMgr.AddToRoleAsync(admin, Roles.Admin);
            }

            // Seed catalog data (Genres, Authors, Books) if empty
            var bookContext = scope.ServiceProvider.GetService<BookStoreContext>();
            if (bookContext is not null)
            {
                if (bookContext.Database.GetPendingMigrations().Any())
                {
                    await bookContext.Database.MigrateAsync();
                }

                if (!await bookContext.Books.AnyAsync())
                {
                    var genres = new List<Genre>
                    {
                        new() { GenreName = "Programming" },
                        new() { GenreName = "Sci-Fi & Fantasy" },
                        new() { GenreName = "Business & Strategy" },
                        new() { GenreName = "Psychology" },
                        new() { GenreName = "Classic Fiction" }
                    };
                    await bookContext.Genres.AddRangeAsync(genres);

                    var authors = new List<Author>
                    {
                        new() { AuthorName = "Robert C. Martin" },
                        new() { AuthorName = "Martin Kleppmann" },
                        new() { AuthorName = "James Clear" },
                        new() { AuthorName = "Frank Herbert" },
                        new() { AuthorName = "Daniel Kahneman" },
                        new() { AuthorName = "Andrew Hunt" },
                        new() { AuthorName = "F. Scott Fitzgerald" }
                    };
                    await bookContext.Authors.AddRangeAsync(authors);
                    await bookContext.SaveChangesAsync();

                    var books = new List<Book>
                    {
                        new()
                        {
                            Title = "Clean Architecture",
                            Description = "A craftsman's guide to software structure, modular design principles, and resilient enterprise systems.",
                            Price = 499,
                            PublishedYear = 2018,
                            ImageUrl = "2f8897ce-7591-4238-b8b2-b924bb2f81c2.jpg"
                        },
                        new()
                        {
                            Title = "Data-Intensive Apps",
                            Description = "The big ideas behind reliable, scalable, and maintainable distributed systems and modern databases.",
                            Price = 649,
                            PublishedYear = 2017,
                            ImageUrl = "4dfbcd75-fb7e-4b67-b58f-fc66580c504c.jpg"
                        },
                        new()
                        {
                            Title = "Atomic Habits",
                            Description = "An easy and proven framework for building good daily habits and breaking destructive routines.",
                            Price = 399,
                            PublishedYear = 2019,
                            ImageUrl = "7ad4536b-58d6-46a8-bbb9-0bc850f1d964.jpg"
                        },
                        new()
                        {
                            Title = "Dune Chronicles",
                            Description = "Epic science fiction masterpiece set on the desert planet Arrakis amidst interstellar politics.",
                            Price = 550,
                            PublishedYear = 2021,
                            ImageUrl = "85a1d969-3a25-49cd-9f15-667c44678206.jpg"
                        },
                        new()
                        {
                            Title = "Thinking, Fast & Slow",
                            Description = "Groundbreaking exploration of the two systems that drive the way we think and make choices.",
                            Price = 450,
                            PublishedYear = 2015,
                            ImageUrl = "b42234ad-761b-49d4-9e31-1f5d1f33ec96.jpg"
                        },
                        new()
                        {
                            Title = "Pragmatic Programmer",
                            Description = "Your journey to mastery in modern software craftsmanship, career growth, and pragmatic coding.",
                            Price = 599,
                            PublishedYear = 2020,
                            ImageUrl = "f2c541ad-2d43-46bf-984c-19343c693e91.jpg"
                        },
                        new()
                        {
                            Title = "The Great Gatsby",
                            Description = "Timeless portrait of Jazz Age ambition, wealth, and illusion on Long Island's Gold Coast.",
                            Price = 299,
                            PublishedYear = 2016,
                            ImageUrl = "1aa9a436-694e-4c8c-b237-1b7d6eff9b0c.jfif"
                        }
                    };
                    await bookContext.Books.AddRangeAsync(books);
                    await bookContext.SaveChangesAsync();

                    var bookAuthors = new List<BookAuthor>
                    {
                        new() { BookId = books[0].Id, AuthorId = authors[0].Id },
                        new() { BookId = books[1].Id, AuthorId = authors[1].Id },
                        new() { BookId = books[2].Id, AuthorId = authors[2].Id },
                        new() { BookId = books[3].Id, AuthorId = authors[3].Id },
                        new() { BookId = books[4].Id, AuthorId = authors[4].Id },
                        new() { BookId = books[5].Id, AuthorId = authors[5].Id },
                        new() { BookId = books[6].Id, AuthorId = authors[6].Id }
                    };
                    var bookGenres = new List<BookGenre>
                    {
                        new() { BookId = books[0].Id, GenreId = genres[0].Id },
                        new() { BookId = books[1].Id, GenreId = genres[0].Id },
                        new() { BookId = books[2].Id, GenreId = genres[2].Id },
                        new() { BookId = books[2].Id, GenreId = genres[3].Id },
                        new() { BookId = books[3].Id, GenreId = genres[1].Id },
                        new() { BookId = books[4].Id, GenreId = genres[3].Id },
                        new() { BookId = books[5].Id, GenreId = genres[0].Id },
                        new() { BookId = books[6].Id, GenreId = genres[4].Id }
                    };
                    await bookContext.BookAuthors.AddRangeAsync(bookAuthors);
                    await bookContext.BookGenres.AddRangeAsync(bookGenres);
                    await bookContext.SaveChangesAsync();
                }
            }
        }
        catch (Exception)
        {
            throw;
        }
    }
}
