using System;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BookStoreFullStackNg.Data.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;
    private readonly ILogger<CloudinaryService> _logger;

    public CloudinaryService(
        IOptions<CloudinarySettings> config,
        ILogger<CloudinaryService> logger)
    {
        _logger = logger;

        var cloudName = config.Value.CloudName;
        var apiKey = config.Value.ApiKey;
        var apiSecret = config.Value.ApiSecret;

        if (string.IsNullOrWhiteSpace(cloudName) ||
            string.IsNullOrWhiteSpace(apiKey) ||
            string.IsNullOrWhiteSpace(apiSecret) ||
            cloudName == "your-cloud-name")
        {
            throw new InvalidOperationException(
                "Cloudinary is not configured. Set CloudinarySettings__CloudName, " +
                "CloudinarySettings__ApiKey and CloudinarySettings__ApiSecret.");
        }

        var acc = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(acc);
        _cloudinary.Api.Secure = true;
        _logger.LogInformation("CloudinaryService initialized successfully with CloudName: {CloudName}", cloudName);
    }

    public async Task<CloudinaryUploadResult> UploadImageAsync(IFormFile file, string folder, int? width = null, int? height = null)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty or null.", nameof(file));
        }

        await using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = folder,
            Transformation = width.HasValue && height.HasValue
                ? new Transformation().Width(width.Value).Height(height.Value).Crop("fill").Gravity("auto").FetchFormat("auto").Quality("auto")
                : new Transformation().FetchFormat("auto").Quality("auto")
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        if (uploadResult.Error != null)
        {
            _logger.LogError("Cloudinary upload failed: {Error}", uploadResult.Error.Message);
            throw new InvalidOperationException($"Cloudinary upload error: {uploadResult.Error.Message}");
        }

        var secureUrl = uploadResult.SecureUrl?.ToString();
        if (string.IsNullOrWhiteSpace(secureUrl) || string.IsNullOrWhiteSpace(uploadResult.PublicId))
        {
            throw new InvalidOperationException("Cloudinary upload completed without a secure URL or public ID.");
        }

        return new CloudinaryUploadResult
        {
            Url = secureUrl,
            PublicId = uploadResult.PublicId
        };
    }

    public async Task<CloudinaryUploadResult> UploadImageFromUrlAsync(string imageUrl, string folder, int? width = null, int? height = null)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            throw new ArgumentException("Image URL cannot be empty.", nameof(imageUrl));
        }

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(imageUrl),
            Folder = folder,
            Transformation = width.HasValue && height.HasValue
                ? new Transformation().Width(width.Value).Height(height.Value).Crop("fill").Gravity("auto").FetchFormat("auto").Quality("auto")
                : new Transformation().FetchFormat("auto").Quality("auto")
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        if (uploadResult.Error != null)
        {
            _logger.LogError("Cloudinary upload from URL failed: {Error}", uploadResult.Error.Message);
            throw new InvalidOperationException($"Cloudinary upload error: {uploadResult.Error.Message}");
        }

        var secureUrl = uploadResult.SecureUrl?.ToString();
        if (string.IsNullOrWhiteSpace(secureUrl) || string.IsNullOrWhiteSpace(uploadResult.PublicId))
        {
            throw new InvalidOperationException("Cloudinary upload completed without a secure URL or public ID.");
        }

        _logger.LogInformation("Successfully uploaded image from URL to Cloudinary: {PublicId}", uploadResult.PublicId);
        return new CloudinaryUploadResult
        {
            Url = secureUrl,
            PublicId = uploadResult.PublicId
        };
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return false;
        }

        if (publicId.StartsWith("local_", StringComparison.Ordinal))
        {
            _logger.LogWarning("Ignoring legacy local image public ID: {PublicId}", publicId);
            return false;
        }

        var deleteParams = new DeletionParams(publicId);
        var result = await _cloudinary.DestroyAsync(deleteParams);
        return result.Result == "ok" || result.Result == "not found";
    }
}

