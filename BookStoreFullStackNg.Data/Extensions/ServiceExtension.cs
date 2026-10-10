using BookStoreFullStackNg.Data.Reopositories.Implementations;
using BookStoreFullStackNg.Data.Reopositories.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using BookStoreFullStackNg.Data.Services;
using BookStoreFullStackNg.Data.Helpers;
using BookStoreFullStackNg.Data.Domain;

namespace BookStoreFullStackNg.Data.Extensions;

public static class ServiceExtension
{
    public static void RegisterDataServices(this IServiceCollection services)
    {
        services.AddScoped<IGenreRepository, GenreRepository>();
        services.AddScoped<IAuthorRepository, AuthorRepository>();
        services.AddScoped<IBookRepository, BookRepository>();
        services.AddTransient<IAuthService, AuthService>();
        services.AddTransient<ISortHelper<Author>, SortHelper<Author>>();
        services.AddTransient<ISortHelper<Book>, SortHelper<Book>>();
        services.AddTransient<ISortHelper<Order>, SortHelper<Order>>();
        services.AddTransient<IFileService, FileService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICartRepository, CartRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
    }
}
