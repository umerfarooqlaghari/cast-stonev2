using Cast_Stone_api.Data;
using Cast_Stone_api.Services.Implementations;
using Cast_Stone_api.Repositories.Implementations;
using AutoMapper;
using Cast_Stone_api.Mappings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Cast_Stone_api;

public class TestApiEndpoints
{
    public static async Task TestCollectionsAndProducts()
    {
        try
        {
            Console.WriteLine("🧪 Testing Collections and Products APIs...");
            
            // Setup configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json", optional: false)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");
            
            // Setup DbContext
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseNpgsql(connectionString)
                .Options;

            using var context = new ApplicationDbContext(options);
            
            // Setup AutoMapper
            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            var mapper = config.CreateMapper();
            
            // Setup repositories and services
            var collectionRepo = new CollectionRepository(context);
            var productRepo = new ProductRepository(context);
            var productSpecRepo = new ProductSpecificationsRepository(context);
            var productDetailsRepo = new ProductDetailsRepository(context);
            var downloadableContentRepo = new DownloadableContentRepository(context);
            var collectionService = new CollectionService(collectionRepo, mapper);
            // Create a mock authentication service for testing
            var userRepo = new UserRepository(context);
            var wholesaleBuyerRepo = new WholesaleBuyerRepository(context);
            var authService = new AuthenticationService(userRepo, wholesaleBuyerRepo, mapper);
            var productService = new ProductService(productRepo, collectionRepo, productSpecRepo, productDetailsRepo, downloadableContentRepo, authService, mapper);
            
            // Test Collections API
            Console.WriteLine("📦 Testing Collections GetAll...");
            var collections = await collectionService.GetAllAsync();
            Console.WriteLine($"✅ Collections retrieved: {collections.Count()}");
            
            foreach (var collection in collections.Take(3))
            {
                Console.WriteLine($"   - {collection.Name} (Level {collection.Level}, ProductCount: {collection.ProductCount})");
                if (collection.ProductIds != null && collection.ProductIds.Any())
                {
                    Console.WriteLine($"     ProductIds: [{string.Join(", ", collection.ProductIds)}]");
                }
                if (collection.ChildCollectionIds != null && collection.ChildCollectionIds.Any())
                {
                    Console.WriteLine($"     ChildCollectionIds: [{string.Join(", ", collection.ChildCollectionIds)}]");
                }
            }
            
            // Test Products API
            Console.WriteLine("\n🛍️ Testing Products GetAll...");
            var products = await productService.GetAllAsync();
            Console.WriteLine($"✅ Products retrieved: {products.Count()}");
            
            foreach (var product in products.Take(3))
            {
                Console.WriteLine($"   - {product.Name} (Price: ${product.Price}, Stock: {product.Stock})");
                Console.WriteLine($"     CollectionId: {product.CollectionId}");
            }
            
            // Test Hierarchy API
            Console.WriteLine("\n🌳 Testing Collections Hierarchy...");
            var hierarchy = await collectionService.GetHierarchyAsync();
            Console.WriteLine($"✅ Hierarchy retrieved: {hierarchy.Count()} root collections");
            
            foreach (var root in hierarchy.Take(2))
            {
                Console.WriteLine($"   - {root.Name} (ProductCount: {root.ProductCount})");
                foreach (var child in root.Children.Take(2))
                {
                    Console.WriteLine($"     └─ {child.Name} (ProductCount: {child.ProductCount})");
                }
            }
            
            Console.WriteLine("\n🎉 All tests completed successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Test failed: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }
}
