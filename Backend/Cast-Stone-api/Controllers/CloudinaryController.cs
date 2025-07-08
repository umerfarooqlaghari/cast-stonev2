using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cast_Stone_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CloudinaryController : ControllerBase
    {
        public CloudinaryService _cloudinaryService;

        public CloudinaryController(CloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        [HttpPost("uploadImage")]
        public async Task<IActionResult> UploadImage(IFormFile image)
        {
            try
            {
                if (image == null || image.Length == 0)
                {
                    return BadRequest(new { message = "No image file provided" });
                }

                // Validate file type
                var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
                if (!allowedTypes.Contains(image.ContentType.ToLower()))
                {
                    return BadRequest(new { message = "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." });
                }

                // Validate file size (max 10MB)
                if (image.Length > 10 * 1024 * 1024)
                {
                    return BadRequest(new { message = "File size too large. Maximum size is 10MB." });
                }

                var url = await _cloudinaryService.UploadImageAsync(image);
                return Ok(new { imageUrl = url, message = "Image uploaded successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to upload image", error = ex.Message });
            }
        }

        [HttpGet("images")]
        public async Task<IActionResult> GetAllImages()
        {
            try
            {
                var images = await _cloudinaryService.GetAllImagesAsync();
                return Ok(new { images, message = "Images retrieved successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve images", error = ex.Message });
            }
        }

        [HttpDelete("images/{publicId}")]
        public async Task<IActionResult> DeleteImage(string publicId)
        {
            try
            {
                // Decode the publicId in case it's URL encoded
                publicId = Uri.UnescapeDataString(publicId);

                var success = await _cloudinaryService.DeleteImageAsync(publicId);
                if (success)
                {
                    return Ok(new { message = "Image deleted successfully" });
                }
                else
                {
                    return NotFound(new { message = "Image not found or could not be deleted" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete image", error = ex.Message });
            }
        }

    }
}
