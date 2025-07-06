using Npgsql;
using Microsoft.Extensions.Configuration;

namespace Cast_Stone_api;

public class TestConnection
{
    public static async Task TestDatabaseConnection()
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.Development.json")
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        try
        {
            using var connection = new NpgsqlConnection(connectionString);
            await connection.OpenAsync();
            Console.WriteLine("✅ Database connection successful!");
            
            using var command = new NpgsqlCommand("SELECT version()", connection);
            var result = await command.ExecuteScalarAsync();
            Console.WriteLine($"PostgreSQL Version: {result}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Database connection failed: {ex.Message}");
            Console.WriteLine($"Connection String: {connectionString}");
        }
    }
}
