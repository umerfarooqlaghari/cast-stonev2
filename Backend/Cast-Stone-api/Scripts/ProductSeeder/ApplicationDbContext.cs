using Microsoft.EntityFrameworkCore;
using System.Text.Json;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets for the models we need
    public DbSet<Collection> Collections { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductSpecifications> ProductSpecifications { get; set; }
    public DbSet<ProductDetails> ProductDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Collection parent-child relationships
        modelBuilder.Entity<Collection>()
            .HasOne(c => c.ParentCollection)
            .WithMany(c => c.ChildCollections)
            .HasForeignKey(c => c.ParentCollectionId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Product relationships
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Collection)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CollectionId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Product-ProductSpecifications relationship (1:1)
        modelBuilder.Entity<Product>()
            .HasOne(p => p.ProductSpecifications)
            .WithOne(ps => ps.Product)
            .HasForeignKey<ProductSpecifications>(ps => ps.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Product-ProductDetails relationship (1:1)
        modelBuilder.Entity<Product>()
            .HasOne(p => p.ProductDetails)
            .WithOne(pd => pd.Product)
            .HasForeignKey<ProductDetails>(pd => pd.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure JSONB columns for Product with JSON serialization
        modelBuilder.Entity<Product>()
            .Property(p => p.Images)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => string.IsNullOrEmpty(v) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new List<string>()
            );

        modelBuilder.Entity<Product>()
            .Property(p => p.Tags)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => string.IsNullOrEmpty(v) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new List<string>()
            );

        // Configure JSONB columns for Collection with JSON serialization
        modelBuilder.Entity<Collection>()
            .Property(c => c.Images)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => string.IsNullOrEmpty(v) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new List<string>()
            );

        modelBuilder.Entity<Collection>()
            .Property(c => c.Tags)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => string.IsNullOrEmpty(v) ? new List<string>() : JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new List<string>()
            );

        modelBuilder.Entity<Collection>()
            .Property(c => c.ProductIds)
            .HasColumnType("jsonb")
            .HasConversion(
                v => v != null ? JsonSerializer.Serialize(v, (JsonSerializerOptions)null) : null,
                v => string.IsNullOrEmpty(v) ? null : JsonSerializer.Deserialize<List<int>>(v, (JsonSerializerOptions)null)
            );

        modelBuilder.Entity<Collection>()
            .Property(c => c.ChildCollectionIds)
            .HasColumnType("jsonb")
            .HasConversion(
                v => v != null ? JsonSerializer.Serialize(v, (JsonSerializerOptions)null) : null,
                v => string.IsNullOrEmpty(v) ? null : JsonSerializer.Deserialize<List<int>>(v, (JsonSerializerOptions)null)
            );

        modelBuilder.Entity<Collection>()
            .Property(c => c.CollageImageSection)
            .HasColumnType("jsonb")
            .HasConversion(
                v => v != null ? JsonSerializer.Serialize(v, (JsonSerializerOptions)null) : null,
                v => string.IsNullOrEmpty(v) ? null : JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
            );
    }
}

