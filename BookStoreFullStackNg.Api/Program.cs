using System.Text;
using BookStoreFullStackNg.Api.Helpers.Wrapper;
using BookStoreFullStackNg.Api.Hubs;
using BookStoreFullStackNg.Api.Middlewares;
using BookStoreFullStackNg.Data.Data;
using BookStoreFullStackNg.Data.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var allowedOrigins = "_allowedOrigins";
var configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
   .CreateLogger();


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "BookStore API",
        Version = "v1",
        Description = "ASP.NET Core 8 REST API for BookStore FullStack"
    });

    // JWT Bearer auth support in Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập JWT token (không cần tiền tố 'Bearer ')"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.RegisterDataServices();
builder.Services.Configure<BookStoreFullStackNg.Data.Services.CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddConfiguredDatabase(builder.Configuration);

// Real-time notifications for signed-in customers
builder.Services.AddSignalR();
builder.Services.AddSingleton<IUserIdProvider, UserNameUserIdProvider>();

// For Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
                .AddEntityFrameworkStores<AuthContext>()
                .AddDefaultTokenProviders();

// Adding Authentication  
builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })

// Adding Jwt Bearer  
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
                };

                // Browsers cannot send an Authorization header on a WebSocket
                // handshake, so SignalR passes the JWT as a query string value.
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments(NotificationHub.Route))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowedOrigins,
    policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddOutputCache(options =>
{
    options.AddBasePolicy(builder => builder
    .With(r => r.HttpContext.Request.Path.StartsWithSegments("/api/books"))
      .Tag("tag-book")
    .Expire(TimeSpan.FromMinutes(10)));

});

builder.Services.AddTransient<ICartItemMapper, CartItemMapper>();

builder.Host.UseSerilog();

var app = builder.Build();

// Swagger UI — available in all environments
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "BookStore API v1");
    c.RoutePrefix = "swagger";
    c.DisplayRequestDuration();
    c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.List);
});

app.UseCors(allowedOrigins);

app.UseHttpsRedirection();

// mapping Uploads folder to Resources folder 
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
           Path.Combine(builder.Environment.ContentRootPath, "Uploads")),
    RequestPath = "/Resources"
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
           Path.Combine(builder.Environment.ContentRootPath, "Uploads")),
    RequestPath = "/Uploads"
});

app.UseOutputCache();

app.UseAuthentication();

app.UseAuthorization();

app.UseMiddleware<ExceptionMiddleware>();

app.MapControllers();

app.MapHub<NotificationHub>(NotificationHub.Route);

// seeding default auth data
await AuthSeeder.SeedData(app);


app.Run();

public partial class Program { }