using BookStoreFullStackNg.Data.Domain;
using Microsoft.EntityFrameworkCore;

namespace BookStoreFullStackNg.Data.Data;

public class BookStoreContext : DbContext
{
    public BookStoreContext(DbContextOptions<BookStoreContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Author>().ToTable("Author");
        modelBuilder.Entity<Book>().ToTable("Book", entity =>
        {
            entity.HasCheckConstraint("CK_Book_StockQuantity_NonNegative", "\"StockQuantity\" >= 0");
        });
        modelBuilder.Entity<Book>()
            .Property(book => book.StockQuantity)
            .HasDefaultValue(0);
        modelBuilder.Entity<BookAuthor>().ToTable("BookAuthor");
        modelBuilder.Entity<BookGenre>().ToTable("BookGenre");
        modelBuilder.Entity<Cart>().ToTable("Cart");
        modelBuilder.Entity<CartItem>().ToTable("CartItem");
        modelBuilder.Entity<Genre>().ToTable("Genre");
        modelBuilder.Entity<Order>().ToTable("Order");
        modelBuilder.Entity<OrderItem>().ToTable("OrderItem");
        modelBuilder.Entity<Payment>().ToTable("Payment");
        modelBuilder.Entity<User>().ToTable("User");
        modelBuilder.Entity<Coupon>().ToTable("Coupon");
        modelBuilder.Entity<WishlistItem>().ToTable("WishlistItem");
        modelBuilder.Entity<WishlistItem>(entity =>
        {
            entity.HasIndex(item => new { item.UserId, item.BookId }).IsUnique();
            entity.HasOne(item => item.User)
                .WithMany()
                .HasForeignKey(item => item.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(item => item.Book)
                .WithMany()
                .HasForeignKey(item => item.BookId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<Coupon>(entity =>
        {
            entity.Property(coupon => coupon.Code).HasMaxLength(50);
            entity.HasIndex(coupon => coupon.Code).IsUnique();
        });
    }

    public DbSet<Author> Authors { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<BookAuthor> BookAuthors { get; set; }
    public DbSet<BookGenre> BookGenres { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
    public DbSet<WishlistItem> WishlistItems { get; set; }

}
