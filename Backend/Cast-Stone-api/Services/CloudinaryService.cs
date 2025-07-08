using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

public class CloudinaryService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryService(IConfiguration config)
    {
        var account = new Account(
        config["Cloudinary:CloudName"],
        config["Cloudinary:ApiKey"],
        config["Cloudinary:ApiSecret"]
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(IFormFile file)
    {
        await using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            PublicId = Guid.NewGuid().ToString(), // Unique ID
            Folder = "cast-stone-images" // Unified folder for all images
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult.SecureUrl.ToString();
    }

    public async Task<List<CloudinaryImageInfo>> GetAllImagesAsync()
    {
        var listParams = new ListResourcesParams
        {
            Type = "upload",
            MaxResults = 500
        };

        var listResult = await _cloudinary.ListResourcesAsync(listParams);

        // Filter by folder prefix and convert to our model
        return listResult.Resources
            .Where(resource => resource.PublicId.StartsWith("cast-stone-images/"))
            .Select(resource => new CloudinaryImageInfo
            {
                PublicId = resource.PublicId,
                SecureUrl = resource.SecureUrl.ToString(),
                FileName = resource.PublicId.Split('/').LastOrDefault() ?? resource.PublicId,
                CreatedAt = DateTime.TryParse(resource.CreatedAt, out var date) ? date : DateTime.UtcNow
            }).ToList();
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        var deleteResult = await _cloudinary.DestroyAsync(deleteParams);

        return deleteResult.Result == "ok";
    }
}

public class CloudinaryImageInfo
{
    public string PublicId { get; set; } = string.Empty;
    public string SecureUrl { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
