using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace BookStoreFullStackNg.Data.Services;

public class CloudinaryUploadResult
{
    public string Url { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
}

public class CloudinarySettings
{
    public string CloudName { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string ApiSecret { get; set; } = string.Empty;
}

public interface ICloudinaryService
{
    Task<CloudinaryUploadResult> UploadImageAsync(IFormFile file, string folder, int? width = null, int? height = null);
    Task<CloudinaryUploadResult> UploadImageFromUrlAsync(string imageUrl, string folder, int? width = null, int? height = null);
    Task<bool> DeleteImageAsync(string publicId);
}

