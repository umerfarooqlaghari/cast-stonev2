using Cast_Stone_api.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Cast_Stone_api.Scripts;

public class TestAndFixDatabase
{
    private readonly ApplicationDbContext _context;

    public TestAndFixDatabase(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task TestDatabaseConnectionAsync()
    {
        try
        {
            Console.WriteLine("Testing database connection...");
            
            // Test basic connection
            var canConnect = await _context.Database.CanConnectAsync();
            Console.WriteLine($"Can connect to database: {canConnect}");

            if (!canConnect)
            {
                Console.WriteLine("❌ Cannot connect to database!");
                return;
            }

            // Check if WholesaleBuyers table exists
            var tableExists = await TableExistsAsync("WholesaleBuyers");
            Console.WriteLine($"WholesaleBuyers table exists: {tableExists}");

            if (!tableExists)
            {
                Console.WriteLine("❌ WholesaleBuyers table does not exist!");
                return;
            }

            // Check if GeoLocation column exists
            var geoLocationExists = await ColumnExistsAsync("WholesaleBuyers", "GeoLocation");
            Console.WriteLine($"GeoLocation column exists: {geoLocationExists}");

            // Count wholesale buyers
            var totalBuyers = await _context.WholesaleBuyers.CountAsync();
            Console.WriteLine($"Total wholesale buyers: {totalBuyers}");

            if (totalBuyers > 0)
            {
                var approvedBuyers = await _context.WholesaleBuyers
                    .Where(wb => wb.Status == "Approved")
                    .CountAsync();
                Console.WriteLine($"Approved wholesale buyers: {approvedBuyers}");

                // Check buyers with proper GeoLocation format
                var buyersWithCoordinates = await _context.WholesaleBuyers
                    .Where(wb => !string.IsNullOrEmpty(wb.GeoLocation) && wb.GeoLocation.Contains(","))
                    .CountAsync();
                Console.WriteLine($"Buyers with proper GeoLocation format: {buyersWithCoordinates}");
            }

            Console.WriteLine("✅ Database test completed successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Database test failed: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }

    public async Task AddMissingColumnsAsync()
    {
        try
        {
            Console.WriteLine("Checking and adding missing columns...");

            var geoLocationExists = await ColumnExistsAsync("WholesaleBuyers", "GeoLocation");

            if (!geoLocationExists)
            {
                Console.WriteLine("Adding GeoLocation column...");
                await _context.Database.ExecuteSqlRawAsync(
                    "ALTER TABLE \"WholesaleBuyers\" ADD COLUMN \"GeoLocation\" character varying(500) NOT NULL DEFAULT ''");
                Console.WriteLine("✅ GeoLocation column added");
            }

            if (geoLocationExists)
            {
                Console.WriteLine("✅ GeoLocation column already exists");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Failed to add columns: {ex.Message}");
            throw;
        }
    }

    private async Task<bool> TableExistsAsync(string tableName)
    {
        try
        {
            var result = await _context.Database.ExecuteSqlRawAsync(
                "SELECT 1 FROM information_schema.tables WHERE table_name = {0} LIMIT 1", 
                tableName);
            return true;
        }
        catch
        {
            return false;
        }
    }

    private async Task<bool> ColumnExistsAsync(string tableName, string columnName)
    {
        try
        {
            var query = @"
                SELECT COUNT(*) 
                FROM information_schema.columns 
                WHERE table_name = @tableName 
                AND column_name = @columnName";

            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            
            using var command = connection.CreateCommand();
            command.CommandText = query;
            command.Parameters.Add(new NpgsqlParameter("@tableName", tableName));
            command.Parameters.Add(new NpgsqlParameter("@columnName", columnName));
            
            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result) > 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error checking column {columnName}: {ex.Message}");
            return false;
        }
    }
}
