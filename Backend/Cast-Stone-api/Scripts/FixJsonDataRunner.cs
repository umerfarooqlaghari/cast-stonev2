using Cast_Stone_api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Cast_Stone_api.Scripts;

public class FixJsonDataRunner
{
    public static async Task FixJsonData()
    {
        try
        {
            Console.WriteLine("🔧 Fixing JSON data in database...");
            
            // Setup configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json", optional: false)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");
            
            using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();
            
            // Fix Collections table
            Console.WriteLine("📦 Fixing Collections table...");
            
            var fixCollectionsSql = @"
                UPDATE ""Collections"" 
                SET ""Tags"" = '[]'::jsonb 
                WHERE ""Tags"" IS NULL OR ""Tags""::text = '' OR ""Tags""::text = 'null';
                
                UPDATE ""Collections""
                SET ""Images"" = '[]'::jsonb
                WHERE ""Images"" IS NULL OR ""Images""::text = '' OR ""Images""::text = 'null' OR ""Images""::text = '{}';
                
                UPDATE ""Collections"" 
                SET ""ProductIds"" = NULL 
                WHERE ""ProductIds""::text = '' OR ""ProductIds""::text = 'null';
                
                UPDATE ""Collections"" 
                SET ""ChildCollectionIds"" = NULL 
                WHERE ""ChildCollectionIds""::text = '' OR ""ChildCollectionIds""::text = 'null';
            ";
            
            using var command1 = new NpgsqlCommand(fixCollectionsSql, connection);
            await command1.ExecuteNonQueryAsync();
            
            // Fix Products table
            Console.WriteLine("🛍️ Fixing Products table...");
            
            var fixProductsSql = @"
                UPDATE ""Products"" 
                SET ""Tags"" = '[]'::jsonb 
                WHERE ""Tags"" IS NULL OR ""Tags""::text = '' OR ""Tags""::text = 'null';
                
                UPDATE ""Products""
                SET ""Images"" = '[]'::jsonb
                WHERE ""Images"" IS NULL OR ""Images""::text = '' OR ""Images""::text = 'null' OR ""Images""::text = '{}';
            ";
            
            using var command2 = new NpgsqlCommand(fixProductsSql, connection);
            await command2.ExecuteNonQueryAsync();
            
            Console.WriteLine("✅ JSON data fixed successfully!");

            // Now refresh ProductIds for all collections
            Console.WriteLine("🔄 Refreshing ProductIds for all collections...");
            await RefreshProductIds(connectionString);
            
            // Verify the fix
            Console.WriteLine("🔍 Verifying data...");
            var verifySql = @"
                SELECT ""Id"", ""Name"", ""Tags"", ""Images"", ""ProductIds"", ""ChildCollectionIds"" 
                FROM ""Collections"" 
                LIMIT 3;
            ";
            
            using var verifyCommand = new NpgsqlCommand(verifySql, connection);
            using var reader = await verifyCommand.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                var id = reader.GetInt32(0);
                var name = reader.GetString(1);
                var tags = reader.IsDBNull(2) ? "NULL" : reader.GetString(2);
                var images = reader.IsDBNull(3) ? "NULL" : reader.GetString(3);
                var productIds = reader.IsDBNull(4) ? "NULL" : reader.GetString(4);
                var childIds = reader.IsDBNull(5) ? "NULL" : reader.GetString(5);

                Console.WriteLine($"   Collection {id}: {name}");
                Console.WriteLine($"     Tags: {tags}");
                Console.WriteLine($"     Images: {images}");
                Console.WriteLine($"     ProductIds: {productIds}");
                Console.WriteLine($"     ChildCollectionIds: {childIds}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error fixing JSON data: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }

    private static async Task RefreshProductIds(string connectionString)
    {
        try
        {
            using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();

            // Get all collections and their products
            var sql = @"
                UPDATE ""Collections""
                SET ""ProductIds"" = (
                    SELECT CASE
                        WHEN COUNT(p.""Id"") > 0 THEN
                            jsonb_agg(p.""Id"" ORDER BY p.""Id"")
                        ELSE NULL
                    END
                    FROM ""Products"" p
                    WHERE p.""CollectionId"" = ""Collections"".""Id""
                )
            ";

            using var command = new NpgsqlCommand(sql, connection);
            var rowsAffected = await command.ExecuteNonQueryAsync();

            Console.WriteLine($"✅ Updated ProductIds for {rowsAffected} collections");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error refreshing ProductIds: {ex.Message}");
        }
    }
}
