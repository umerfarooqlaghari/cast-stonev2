using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Cast_Stone_api.Scripts;

public static class SeedData
{
    public static async Task SeedStatusesAsync(ApplicationDbContext context)
    {
        if (await context.Statuses.AnyAsync())
        {
            Console.WriteLine("Status data already exists. Skipping status seeding.");
            return;
        }

        var statuses = new List<Status>
        {
            // Order Statuses (1-8)
            new Status { Id = 1, StatusName = "Pending" },
            new Status { Id = 2, StatusName = "Confirmed" },
            new Status { Id = 3, StatusName = "Processing" },
            new Status { Id = 4, StatusName = "Shipped" },
            new Status { Id = 5, StatusName = "Delivered" },
            new Status { Id = 6, StatusName = "Cancelled" },
            new Status { Id = 7, StatusName = "Returned" },
            new Status { Id = 8, StatusName = "Refunded" },
            
            // Payment Statuses (9-13)
            new Status { Id = 9, StatusName = "Payment Pending" },
            new Status { Id = 10, StatusName = "Payment Completed" },
            new Status { Id = 11, StatusName = "Payment Failed" },
            new Status { Id = 12, StatusName = "Payment Refunded" },
            new Status { Id = 13, StatusName = "Payment Partially Refunded" },
            
            // Inventory Statuses (14-19)
            new Status { Id = 14, StatusName = "In Stock" },
            new Status { Id = 15, StatusName = "Out of Stock" },
            new Status { Id = 16, StatusName = "Low Stock" },
            new Status { Id = 17, StatusName = "Discontinued" },
            new Status { Id = 18, StatusName = "Pre-Order" },
            new Status { Id = 19, StatusName = "Back Order" },
            
            // Activity Statuses (20-25)
            new Status { Id = 20, StatusName = "Active" },
            new Status { Id = 21, StatusName = "Inactive" },
            new Status { Id = 22, StatusName = "Suspended" },
            new Status { Id = 23, StatusName = "Archived" },
            new Status { Id = 24, StatusName = "Draft" },
            new Status { Id = 25, StatusName = "Published" }
        };

        await context.Statuses.AddRangeAsync(statuses);
        await context.SaveChangesAsync();
        
        Console.WriteLine($"Successfully seeded {statuses.Count} status records.");
    }

    public static async Task SeedAdminUserAsync(ApplicationDbContext context)
    {
        var adminEmail = "mumerfarooqlaghari@gmail.com";
        
        if (await context.Users.AnyAsync(u => u.Email == adminEmail))
        {
            Console.WriteLine("Admin user already exists. Skipping admin user seeding.");
            return;
        }

        var adminUser = new User
        {
            Email = adminEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("132Trent@!"),
            Role = "admin",
            Name = "umer farooq",
            PhoneNumber = "+92 3009243063",
            Country = "Pakistan",
            City = "karachi",
            ZipCode = "75330",
            Active = true,
            CreatedAt = DateTime.UtcNow
        };

        await context.Users.AddAsync(adminUser);
        await context.SaveChangesAsync();
        
        Console.WriteLine("Successfully seeded admin user.");
    }

    public static async Task SeedSampleCollectionsAsync(ApplicationDbContext context)
    {
        if (await context.Collections.AnyAsync())
        {
            Console.WriteLine("Collection data already exists. Skipping collection seeding.");
            return;
        }

        var collections = new List<Collection>
        {
            // Level 1 Collections (Root)
            new Collection
            {
                Id = 1,
                Name = "Natural Stone",
                Description = "Premium natural stone products for construction and decoration",
                Level = 1,
                Tags = new List<string> { "natural", "stone", "premium" },
                Published = true,
                CreatedBy = "System",
                CreatedAt = DateTime.UtcNow
            },
            new Collection
            {
                Id = 2,
                Name = "Engineered Stone",
                Description = "High-quality engineered stone solutions",
                Level = 1,
                Tags = new List<string> { "engineered", "modern", "durable" },
                Published = true,
                CreatedBy = "System",
                CreatedAt = DateTime.UtcNow
            },
            
            // Level 2 Collections (Categories)
            new Collection
            {
                Id = 3,
                Name = "Marble",
                Description = "Luxurious marble stones",
                Level = 2,
                ParentCollectionId = 1,
                Tags = new List<string> { "marble", "luxury", "elegant" },
                Published = true,
                CreatedBy = "System",
                CreatedAt = DateTime.UtcNow
            },
            new Collection
            {
                Id = 4,
                Name = "Granite",
                Description = "Durable granite stones",
                Level = 2,
                ParentCollectionId = 1,
                Tags = new List<string> { "granite", "durable", "strong" },
                Published = true,
                CreatedBy = "System",
                CreatedAt = DateTime.UtcNow
            },
            new Collection
            {
                Id = 5,
                Name = "Quartz",
                Description = "Premium quartz surfaces",
                Level = 2,
                ParentCollectionId = 2,
                Tags = new List<string> { "quartz", "premium", "surface" },
                Published = true,
                CreatedBy = "System",
                CreatedAt = DateTime.UtcNow
            },
            
            // Level 3 Collections (Subcategories)
            new Collection
            {
                Id = 6,
                Name = "Carrara Marble",
                Description = "Classic Italian Carrara marble",
                Level = 3,
                ParentCollectionId = 3,
                Tags = new List<string> { "carrara", "italian", "classic" },
                Published = true,
                CreatedBy = "System",
                CreatedAt = DateTime.UtcNow
            },
            new Collection
            {
                Id = 7,
                Name = "Black Granite",
                Description = "Elegant black granite varieties",
                Level = 3,
                ParentCollectionId = 4,
                Tags = new List<string> { "black", "elegant", "granite" },
                Published = true,
                CreatedBy = "System",
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Collections.AddRangeAsync(collections);
        await context.SaveChangesAsync();
        
        Console.WriteLine($"Successfully seeded {collections.Count} collection records.");
    }

    public static async Task SeedSampleProductsAsync(ApplicationDbContext context)
    {
        if (await context.Products.AnyAsync())
        {
            Console.WriteLine("Product data already exists. Skipping product seeding.");
            return;
        }

        var products = new List<Product>
        {
            new Product
            {
                Name = "Carrara White Marble Slab",
                Description = "Premium Carrara white marble slab, perfect for countertops and flooring",
                Price = 89.99m,
                Stock = 25,
                CollectionId = 6,
                Images = new List<string> { "carrara-white-1.jpg", "carrara-white-2.jpg" },
                Tags = new List<string> { "white", "marble", "slab", "premium" },
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Black Galaxy Granite Tile",
                Description = "Stunning black galaxy granite tiles with gold speckles",
                Price = 45.50m,
                Stock = 100,
                CollectionId = 7,
                Images = new List<string> { "black-galaxy-1.jpg", "black-galaxy-2.jpg" },
                Tags = new List<string> { "black", "granite", "tile", "galaxy" },
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Calacatta Gold Marble",
                Description = "Luxurious Calacatta gold marble with distinctive veining",
                Price = 125.00m,
                Stock = 15,
                CollectionId = 6,
                Images = new List<string> { "calacatta-gold-1.jpg", "calacatta-gold-2.jpg" },
                Tags = new List<string> { "calacatta", "gold", "marble", "luxury" },
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Engineered Quartz Countertop",
                Description = "Modern engineered quartz countertop with consistent pattern",
                Price = 75.25m,
                Stock = 50,
                CollectionId = 5,
                Images = new List<string> { "quartz-counter-1.jpg", "quartz-counter-2.jpg" },
                Tags = new List<string> { "quartz", "countertop", "engineered", "modern" },
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();
        
        Console.WriteLine($"Successfully seeded {products.Count} product records.");
    }

    public static async Task SeedAllDataAsync(ApplicationDbContext context)
    {
        Console.WriteLine("Starting data seeding...");
        
        await SeedStatusesAsync(context);
        await SeedAdminUserAsync(context);
        await SeedSampleCollectionsAsync(context);
        await SeedSampleProductsAsync(context);
        
        Console.WriteLine("Data seeding completed successfully!");
    }
}
