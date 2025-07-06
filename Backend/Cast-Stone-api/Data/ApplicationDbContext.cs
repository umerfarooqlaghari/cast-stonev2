using Cast_Stone_api.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Cast_Stone_api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets for all domain models
    public DbSet<Collection> Collections { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<ContactFormSubmission> ContactFormSubmissions { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<Status> Statuses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Collection relationships
        modelBuilder.Entity<Collection>()
            .HasOne(c => c.ParentCollection)
            .WithMany()
            .HasForeignKey(c => c.ParentCollectionId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Collection>()
         .Property(c => c.Tags)
         .HasColumnType("jsonb")
         .HasConversion(
        v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
        v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
    );

        modelBuilder.Entity<Product>()
       .Property(c => c.Tags)
       .HasColumnType("jsonb")
       .HasConversion(
      v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
      v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
  );

        modelBuilder.Entity<Product>()
   .Property(c => c.Images)
   .HasColumnType("jsonb")
   .HasConversion(
  v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
  v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
);

        modelBuilder.Entity<Collection>()
            .HasOne(c => c.ChildCollection)
            .WithMany()
            .HasForeignKey(c => c.ChildCollectionId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Product relationships
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Collection)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CollectionId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Order relationships
        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Status)
            .WithMany(s => s.Orders)
            .HasForeignKey(o => o.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure OrderItem relationships
        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Cart relationships
        modelBuilder.Entity<Cart>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure CartItem relationships
        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Cart)
            .WithMany(c => c.CartItems)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Product)
            .WithMany()
            .HasForeignKey(ci => ci.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure indexes for better performance
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Collection>()
            .HasIndex(c => c.Name);

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Name);

        modelBuilder.Entity<Subscription>()
            .HasIndex(s => s.Email)
            .IsUnique();

        // Cart indexes for performance
        modelBuilder.Entity<Cart>()
            .HasIndex(c => c.UserId);

        modelBuilder.Entity<Cart>()
            .HasIndex(c => c.SessionId);

        modelBuilder.Entity<CartItem>()
            .HasIndex(ci => ci.CartId);

        modelBuilder.Entity<CartItem>()
            .HasIndex(ci => ci.ProductId);

        // Seed comprehensive Status data for eCommerce
        modelBuilder.Entity<Status>().HasData(
            // Order Statuses
            new Status { Id = 1, StatusName = "Pending" },
            new Status { Id = 2, StatusName = "Confirmed" },
            new Status { Id = 3, StatusName = "Processing" },
            new Status { Id = 4, StatusName = "Shipped" },
            new Status { Id = 5, StatusName = "Delivered" },
            new Status { Id = 6, StatusName = "Cancelled" },
            new Status { Id = 7, StatusName = "Returned" },
            new Status { Id = 8, StatusName = "Refunded" },

            // Payment Statuses
            new Status { Id = 9, StatusName = "Payment Pending" },
            new Status { Id = 10, StatusName = "Payment Completed" },
            new Status { Id = 11, StatusName = "Payment Failed" },
            new Status { Id = 12, StatusName = "Payment Refunded" },
            new Status { Id = 13, StatusName = "Payment Partially Refunded" },

            // Inventory Statuses
            new Status { Id = 14, StatusName = "In Stock" },
            new Status { Id = 15, StatusName = "Out of Stock" },
            new Status { Id = 16, StatusName = "Low Stock" },
            new Status { Id = 17, StatusName = "Discontinued" },
            new Status { Id = 18, StatusName = "Pre-Order" },
            new Status { Id = 19, StatusName = "Back Order" },

            // Activity Statuses
            new Status { Id = 20, StatusName = "Active" },
            new Status { Id = 21, StatusName = "Inactive" },
            new Status { Id = 22, StatusName = "Suspended" },
            new Status { Id = 23, StatusName = "Archived" },
            new Status { Id = 24, StatusName = "Draft" },
            new Status { Id = 25, StatusName = "Published" }
        );
    }
}
