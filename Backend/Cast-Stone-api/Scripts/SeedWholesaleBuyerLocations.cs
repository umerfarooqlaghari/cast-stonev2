using Cast_Stone_api.Data;
using Cast_Stone_api.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Cast_Stone_api.Scripts;

public class SeedWholesaleBuyerLocations
{
    private readonly ApplicationDbContext _context;
    private readonly Random _random = new Random();

    // Major US cities with their coordinates
    private readonly List<(string City, string State, double Lat, double Lng)> _usCities = new()
    {
        ("New York", "NY", 40.7128, -74.0060),
        ("Los Angeles", "CA", 34.0522, -118.2437),
        ("Chicago", "IL", 41.8781, -87.6298),
        ("Houston", "TX", 29.7604, -95.3698),
        ("Phoenix", "AZ", 33.4484, -112.0740),
        ("Philadelphia", "PA", 39.9526, -75.1652),
        ("San Antonio", "TX", 29.4241, -98.4936),
        ("San Diego", "CA", 32.7157, -117.1611),
        ("Dallas", "TX", 32.7767, -96.7970),
        ("San Jose", "CA", 37.3382, -121.8863),
        ("Austin", "TX", 30.2672, -97.7431),
        ("Jacksonville", "FL", 30.3322, -81.6557),
        ("Fort Worth", "TX", 32.7555, -97.3308),
        ("Columbus", "OH", 39.9612, -82.9988),
        ("Charlotte", "NC", 35.2271, -80.8431),
        ("San Francisco", "CA", 37.7749, -122.4194),
        ("Indianapolis", "IN", 39.7684, -86.1581),
        ("Seattle", "WA", 47.6062, -122.3321),
        ("Denver", "CO", 39.7392, -104.9903),
        ("Washington", "DC", 38.9072, -77.0369),
        ("Boston", "MA", 42.3601, -71.0589),
        ("El Paso", "TX", 31.7619, -106.4850),
        ("Nashville", "TN", 36.1627, -86.7816),
        ("Detroit", "MI", 42.3314, -83.0458),
        ("Oklahoma City", "OK", 35.4676, -97.5164),
        ("Portland", "OR", 45.5152, -122.6784),
        ("Las Vegas", "NV", 36.1699, -115.1398),
        ("Memphis", "TN", 35.1495, -90.0490),
        ("Louisville", "KY", 38.2527, -85.7585),
        ("Baltimore", "MD", 39.2904, -76.6122),
        ("Milwaukee", "WI", 43.0389, -87.9065),
        ("Albuquerque", "NM", 35.0844, -106.6504),
        ("Tucson", "AZ", 32.2226, -110.9747),
        ("Fresno", "CA", 36.7378, -119.7871),
        ("Sacramento", "CA", 38.5816, -121.4944),
        ("Mesa", "AZ", 33.4152, -111.8315),
        ("Kansas City", "MO", 39.0997, -94.5786),
        ("Atlanta", "GA", 33.7490, -84.3880),
        ("Long Beach", "CA", 33.7701, -118.1937),
        ("Colorado Springs", "CO", 38.8339, -104.8214),
        ("Raleigh", "NC", 35.7796, -78.6382),
        ("Miami", "FL", 25.7617, -80.1918),
        ("Virginia Beach", "VA", 36.8529, -75.9780),
        ("Omaha", "NE", 41.2565, -95.9345),
        ("Oakland", "CA", 37.8044, -122.2711),
        ("Minneapolis", "MN", 44.9778, -93.2650),
        ("Tulsa", "OK", 36.1540, -95.9928),
        ("Arlington", "TX", 32.7357, -97.1081),
        ("Tampa", "FL", 27.9506, -82.4572),
        ("New Orleans", "LA", 29.9511, -90.0715)
    };

    public SeedWholesaleBuyerLocations(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SeedLocationsAsync()
    {
        try
        {
            Console.WriteLine("Starting to seed wholesale buyer locations...");

            // Get all wholesale buyers that don't have coordinates yet
            var buyersWithoutCoordinates = await _context.WholesaleBuyers
                .Where(wb => wb.Latitude == null || wb.Longitude == null)
                .ToListAsync();

            Console.WriteLine($"Found {buyersWithoutCoordinates.Count} wholesale buyers without coordinates");

            if (!buyersWithoutCoordinates.Any())
            {
                Console.WriteLine("All wholesale buyers already have coordinates assigned.");
                return;
            }

            foreach (var buyer in buyersWithoutCoordinates)
            {
                // Get a random city
                var randomCity = _usCities[_random.Next(_usCities.Count)];
                
                // Add some random variation to coordinates (within ~10 mile radius)
                var latVariation = (_random.NextDouble() - 0.5) * 0.2; // ~±0.1 degrees
                var lngVariation = (_random.NextDouble() - 0.5) * 0.2; // ~±0.1 degrees
                
                buyer.Latitude = randomCity.Lat + latVariation;
                buyer.Longitude = randomCity.Lng + lngVariation;
                
                // Update the location string to match the city
                buyer.GeoLocation = $"{buyer.Latitude:F6}, {buyer.Longitude:F6}";
                buyer.City = randomCity.City;
                buyer.State = randomCity.State;
                buyer.Country = "United States";
                
                Console.WriteLine($"Assigned coordinates to {buyer.FirstName} {buyer.LastName}: {buyer.Latitude:F6}, {buyer.Longitude:F6} ({randomCity.City}, {randomCity.State})");
            }

            await _context.SaveChangesAsync();
            Console.WriteLine($"Successfully updated {buyersWithoutCoordinates.Count} wholesale buyers with random US locations");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding wholesale buyer locations: {ex.Message}");
            throw;
        }
    }
}
