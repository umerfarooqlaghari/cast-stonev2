using Cast_Stone_api.Data;
using Cast_Stone_api.Scripts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Cast_Stone_api.Scripts;

public class SeedDataRunner
{
    public static async Task Main(string[] args)
    {
        Console.WriteLine("Cast Stone API - Data Seeding Tool");
        Console.WriteLine("===================================");

        try
        {
            // Build configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json", optional: false)
                .Build();

            // Get connection string
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrEmpty(connectionString))
            {
                Console.WriteLine("❌ Connection string not found in appsettings.Development.json");
                return;
            }

            // Configure DbContext
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            using var context = new ApplicationDbContext(optionsBuilder.Options);

            // Test database connection
            Console.WriteLine("🔗 Testing database connection...");
            if (!await context.Database.CanConnectAsync())
            {
                Console.WriteLine("❌ Cannot connect to database. Please check your connection string and ensure the database is running.");
                return;
            }
            Console.WriteLine("✅ Database connection successful!");

            // Apply pending migrations
            Console.WriteLine("🔄 Applying pending migrations...");
            await context.Database.MigrateAsync();
            Console.WriteLine("✅ Migrations applied successfully!");

            // Seed data
            await SeedData.SeedAllDataAsync(context);

            Console.WriteLine("\n🎉 All operations completed successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ An error occurred: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }

        Console.WriteLine("\nPress any key to exit...");
        Console.ReadKey();
    }
}
