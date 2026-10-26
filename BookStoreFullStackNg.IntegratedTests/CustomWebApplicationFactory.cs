using BookStoreFullStackNg.Data.Constants;
using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Domain;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using System.Data.Common;

namespace BookStoreFullStackNg.IntegratedTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>,IAsyncLifetime
{

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<BookStoreContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            //services.AddDbContext<BookStoreContext>(options =>
            //{
            //    options.UseInMemoryDatabase("InMem");
            //    options.ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning));
            //}
            //   );

            services.AddSingleton<DbConnection>(container =>
            {
                var connection = new SqliteConnection("DataSource=:memory:");
                connection.Open();

                return connection;
            });

            services.AddDbContext<BookStoreContext>((container, options) =>
            {
                var connection = container.GetRequiredService<DbConnection>();
                options.UseSqlite(connection);
            });

            // DB for Identity mgt
            //services.AddSingleton<DbConnection>(container =>
            //{
            //    var connection = new SqliteConnection("DataSource=:memory:");
            //    connection.Open();

            //    return connection;
            //});

            services.AddDbContext<AuthContext>((container, options) =>
            {
                var connection = container.GetRequiredService<DbConnection>();
                options.UseSqlite(connection);
            });

            // Add a test authentication scheme
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "TestScheme";
                options.DefaultChallengeScheme = "TestScheme";
            })
            .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("TestScheme", options => { });



            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            using var appContext = scope.ServiceProvider.GetRequiredService<BookStoreContext>();
            //try
            //{
            //    //appContext.Database.EnsureDeleted();
            //    //appContext.Database.EnsureCreated();
            //    //SeedData(appContext);
            //}
            //catch (Exception ex)
            //{
            //    throw;
            //}
        });
    }

    //private static async Task DisposeExisitingData(BookStoreContext context)
    //{
    //    context.Genres.RemoveRange(context.Genres);
    //    context.Authors.RemoveRange(context.Authors);
    //    context.BookAuthors.RemoveRange(context.BookAuthors);
    //    context.BookGenres.RemoveRange(context.BookGenres);
    //    context.Books.RemoveRange(context.Books);
    //    context.CartItems.RemoveRange(context.CartItems);
    //    context.Carts.RemoveRange(context.Carts);
    //    context.Users.RemoveRange(context.Users);
    //    await context.SaveChangesAsync();
    //}

    private static void SeedData(BookStoreContext context)
    {
        SeedUser(context);

        SeedGenres(context);
        
        SeedAuthors(context);

        SeedBooks(context);

        SeedCart(context);

        SeedOrders(context);

        context.SaveChanges();
    }

    private static void SeedOrders(BookStoreContext context)
    {
        if(!context.Users.Any())
        {
            var order = new Order
            {
                Name = "Xyz",
                Email = "xyz@g.c",
                MobileNumber = "1234",
                OrderDate = DateTime.Now,
                OrderStatus = Data.Constants.OrderStatus.Pending,
                TaxInPercent = 18,
                UserId = 1,
                OrderItems = new List<OrderItem>
                {
                    new OrderItem
                    {
                        BookId=1,
                        Quantity=1,
                        OrderId=1,
                        Price=123
                    }
                }
            };
            context.Orders.Add(order);
        }
    }

    private static void SeedUser(BookStoreContext context)
    {
        if(!context.Users.Any())
        {
            List<User> users =[ 
                new User { Id = 1, Name = "TestUser", Username = "TestUser" },
                new User { Id = 2, Name = "TestUser2", Username = "test2" },
                ];
            context.Users.AddRange(users);
        }
    }

    private static void SeedCart(BookStoreContext context)
    {
        if (!context.Carts.Any())
        {
            var cart = new Cart
            {
                Id = 1,
                UserId = 1,
                CartItems = new[] {
                  new CartItem {Id=1,BookId=1,CartId=1,Quantity=1},
                  new CartItem {Id=2,BookId=2,CartId=1,Quantity=2},
              }
            };
            context.Carts.Add(cart);
        }
    }

    private static void SeedGenres(BookStoreContext context)
    {
        if (!context.Genres.Any())
        {
            var genres = new List<Genre>{
                new Genre{GenreName="G1"},
                new Genre{GenreName="G2"},
            };
            context.Genres.AddRange(genres);
        }
    }

    private static void SeedAuthors(BookStoreContext context)
    {
        if (!context.Authors.Any())
        {

            var authors = new List<Author> {
              new Author {AuthorName="A1"},
              new Author {AuthorName="A2"},
              new Author {AuthorName="A3"},
            };
            context.Authors.AddRange(authors);
        }
    }

    private static void SeedBooks(BookStoreContext context)
    {
        if (!context.Books.Any())
        {
            var books = new List<Book>
             {
    new Book
    {
        Id = 1,
        Title = "book1",
        Price = 123,
        Description = "desc1",
        PublishedYear = 2008,
        ImageUrl = null,
        BookAuthors = new List<BookAuthor>
        {
            new BookAuthor { Id = 1, BookId = 1, AuthorId = 1 }
        },
        BookGenres = new List<BookGenre>
        {
            new BookGenre { Id = 1, BookId = 1, GenreId = 1 }
        }
    },
    new Book
    {
        Id = 2,
        Title = "book2",
        Price = 120,
        Description = "desc2",
        PublishedYear = 2009,
        ImageUrl = null,
        BookAuthors = new List<BookAuthor>
        {
            new BookAuthor { Id = 2, BookId = 2, AuthorId = 2 }
        },
        BookGenres = new List<BookGenre>
        {
            new BookGenre { Id = 2, BookId = 2, GenreId = 2 }
        }
    }
};
            context.Books.AddRange(books);
        }
    }

    public async Task InitializeAsync()
    {
        using var scope = Services.CreateScope();
        var appContext = scope.ServiceProvider.GetService<BookStoreContext>();
        await appContext.Database.EnsureCreatedAsync();
        SeedData(appContext);
        await Task.CompletedTask;
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BookStoreContext>();
        await context.Database.EnsureDeletedAsync();
        // await context.Database.EnsureCreatedAsync();
        //await Task.CompletedTask;
    }
}
