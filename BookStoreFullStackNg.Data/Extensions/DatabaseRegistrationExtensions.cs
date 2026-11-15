using System;
using BookStoreFullStackNg.Data.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BookStoreFullStackNg.Data.Extensions;

public static class DatabaseRegistrationExtensions
{
    public static IServiceCollection AddConfiguredDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var provider = configuration.GetValue<string>("DatabaseSettings:Provider") ?? "Sqlite";
        var pgConn = configuration.GetConnectionString("PostgreSqlConnection")
            ?? configuration.GetValue<string>("DatabaseSettings:PostgreSql:ConnectionString");

        bool usePostgreSql = provider.Equals("PostgreSQL", StringComparison.OrdinalIgnoreCase)
            && !string.IsNullOrWhiteSpace(pgConn)
            && !pgConn.Contains("[YOUR_PASSWORD]");

        if (usePostgreSql)
        {
            // Both contexts connect to PostgreSQL (Supabase / Cloud)
            // QuerySplittingBehavior.SplitQuery avoids cartesian explosion on multiple collection includes
            // Default ExecutionStrategy allows explicit user-initiated transactions (BeginTransactionAsync)
            services.AddDbContext<BookStoreContext>(options =>
                options.UseNpgsql(pgConn, npgsqlOptions =>
                {
                    npgsqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                }));

            services.AddDbContext<AuthContext>(options =>
                options.UseNpgsql(pgConn, npgsqlOptions =>
                {
                    npgsqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                }));
        }
        else
        {
            // Local SQLite mode
            var bsConn = configuration.GetValue<string>("DatabaseSettings:Sqlite:BookStoreConnectionString")
                ?? configuration.GetConnectionString("DefaultConnection")
                ?? "Data source=BookStore.db";

            var authConn = configuration.GetValue<string>("DatabaseSettings:Sqlite:AuthConnectionString")
                ?? "Data source=Auth.db";

            services.AddDbContext<BookStoreContext>(options => options.UseSqlite(bsConn));
            services.AddDbContext<AuthContext>(options => options.UseSqlite(authConn));
        }

        return services;
    }
}
