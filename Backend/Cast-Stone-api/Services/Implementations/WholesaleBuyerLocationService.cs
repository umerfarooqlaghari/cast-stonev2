using AutoMapper;
using Cast_Stone_api.Domain.Models;
using Cast_Stone_api.DTOs.Request;
using Cast_Stone_api.DTOs.Response;
using Cast_Stone_api.Repositories.Interfaces;
using Cast_Stone_api.Services.Interfaces;

namespace Cast_Stone_api.Services.Implementations;

public class WholesaleBuyerLocationService : IWholesaleBuyerLocationService
{
    private readonly IWholesaleBuyerLocationRepository _locationRepository;
    private readonly IMapper _mapper;

    public WholesaleBuyerLocationService(
        IWholesaleBuyerLocationRepository locationRepository,
        IMapper mapper)
    {
        _locationRepository = locationRepository;
        _mapper = mapper;
    }

    public async Task<BuyerLocationResponse?> GetByIdAsync(int id)
    {
        var location = await _locationRepository.GetByIdAsync(id);
        return location == null ? null : _mapper.Map<BuyerLocationResponse>(location);
    }

    public async Task<IEnumerable<BuyerLocationResponse>> GetAllAsync()
    {
        var locations = await _locationRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<BuyerLocationResponse>>(locations);
    }

    public async Task<IEnumerable<BuyerLocationResponse>> GetByWholesaleBuyerIdAsync(int wholesaleBuyerId)
    {
        var locations = await _locationRepository.GetByWholesaleBuyerIdAsync(wholesaleBuyerId);
        return _mapper.Map<IEnumerable<BuyerLocationResponse>>(locations);
    }

    public async Task<BuyerLocationResponse> CreateAsync(CreateWholesaleBuyerLocationRequest request)
    {
        // Validate that the wholesale buyer exists
        var buyerExists = await _locationRepository.WholesaleBuyerExistsAsync(request.WholesaleBuyerId);
        if (!buyerExists)
        {
            throw new ArgumentException($"Wholesale buyer with ID {request.WholesaleBuyerId} does not exist");
        }

        // Validate latitude and longitude ranges
        if (request.Latitude < -90 || request.Latitude > 90)
        {
            throw new ArgumentException("Latitude must be between -90 and 90");
        }

        if (request.Longitude < -180 || request.Longitude > 180)
        {
            throw new ArgumentException("Longitude must be between -180 and 180");
        }

        var location = _mapper.Map<WholesaleBuyerLocation>(request);
        location.CreatedAt = DateTime.UtcNow;

        var createdLocation = await _locationRepository.AddAsync(location);
        return _mapper.Map<BuyerLocationResponse>(createdLocation);
    }

    public async Task<BuyerLocationResponse?> UpdateAsync(int id, UpdateWholesaleBuyerLocationRequest request)
    {
        var location = await _locationRepository.GetByIdAsync(id);
        if (location == null)
        {
            return null;
        }

        // Validate latitude and longitude if provided
        if (request.Latitude.HasValue && (request.Latitude < -90 || request.Latitude > 90))
        {
            throw new ArgumentException("Latitude must be between -90 and 90");
        }

        if (request.Longitude.HasValue && (request.Longitude < -180 || request.Longitude > 180))
        {
            throw new ArgumentException("Longitude must be between -180 and 180");
        }

        // Update only provided fields
        if (request.Address != null)
        {
            location.Address = request.Address;
        }

        if (request.Latitude.HasValue)
        {
            location.Latitude = request.Latitude.Value;
        }

        if (request.Longitude.HasValue)
        {
            location.Longitude = request.Longitude.Value;
        }

        location.UpdatedAt = DateTime.UtcNow;

        var updatedLocation = await _locationRepository.UpdateAsync(location);
        return _mapper.Map<BuyerLocationResponse>(updatedLocation);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var location = await _locationRepository.GetByIdAsync(id);
        if (location == null)
        {
            return false;
        }

        await _locationRepository.DeleteAsync(location);
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _locationRepository.ExistsAsync(id);
    }
}

