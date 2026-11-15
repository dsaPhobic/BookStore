using System;
using System.IO;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BookStoreFullStackNg.Data.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary? _cloudinary;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<CloudinaryService> _logger;

    public CloudinaryService(
        IOptions<CloudinarySettings> config,
        IWebHostEnvironment environment,
        ILogger<CloudinaryService> logger)
    {
        _environment = environment;
        _logger = logger;

        var cloudName = config.Value.CloudName;
        var apiKey = config.Value.ApiKey;
        var apiSecret = config.Value.ApiSecret;

        if (!string.IsNullOrWhiteSpace(cloudName) &&
            !string.IsNullOrWhiteSpace(apiKey) &&
            !string.IsNullOrWhiteSpace(apiSecret) &&
            cloudName != "your-cloud-name")
        {
            var acc = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(acc);
            _cloudinary.Api.Secure = true;
            _logger.LogInformation("CloudinaryService initialized successfully with CloudName: {CloudName}", cloudName);
        }
        else
        {
            _logger.LogWarning("Cloudinary credentials not configured. Falling back to local file storage.");
        }
    }

    public async Task<CloudinaryUploadResult> UploadImageAsync(IFormFile file, string folder, int? width = null, int? height = null)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty or null.", nameof(file));
        }

        // 1. If Cloudinary is configured, upload to Cloudinary
        if (_cloudinary != null)
        {
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

            return new CloudinaryUploadResult
            {
                Url = uploadResult.SecureUrl?.ToString() ?? uploadResult.Url?.ToString() ?? string.Empty,
                PublicId = uploadResult.PublicId
            };
        }

        // 2. Fallback to local storage if Cloudinary is not yet configured
        var contentPath = _environment.ContentRootPath;
        var uploadDir = Path.Combine(contentPath, "Uploads", folder);
        if (!Directory.Exists(uploadDir))
        {
            Directory.CreateDirectory(uploadDir);
        }

        var ext = Path.GetExtension(file.FileName);
        var uniqueFileName = $"{Guid.NewGuid():N}{ext}";
        var fullPath = Path.Combine(uploadDir, uniqueFileName);

        await using (var localStream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(localStream);
        }

        // For local fallback, store relative URL
        var relativeUrl = $"/Uploads/{folder}/{uniqueFileName}";
        return new CloudinaryUploadResult
        {
            Url = relativeUrl,
            PublicId = $"local_{uniqueFileName}"
        };
    }

    public async Task<CloudinaryUploadResult> UploadImageFromUrlAsync(string imageUrl, string folder, int? width = null, int? height = null)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            throw new ArgumentException("Image URL cannot be empty.", nameof(imageUrl));
        }

        // 1. If Cloudinary is configured, upload the remote URL directly to Cloudinary
        if (_cloudinary != null)
        {
            try
            {
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
                    _logger.LogError("Cloudinary upload from URL failed: {Error}. Preserving original URL.", uploadResult.Error.Message);
                    return new CloudinaryUploadResult
                    {
                        Url = imageUrl,
                        PublicId = string.Empty
                    };
                }

                _logger.LogInformation("Successfully uploaded image from URL to Cloudinary: {PublicId}", uploadResult.PublicId);
                return new CloudinaryUploadResult
                {
                    Url = uploadResult.SecureUrl?.ToString() ?? uploadResult.Url?.ToString() ?? imageUrl,
                    PublicId = uploadResult.PublicId
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Exception while uploading remote image {Url} to Cloudinary. Falling back to original URL.", imageUrl);
                return new CloudinaryUploadResult
                {
                    Url = imageUrl,
                    PublicId = string.Empty
                };
            }
        }

        // 2. Fallback to local storage if Cloudinary is not configured
        try
        {
            using var client = new HttpClient();
            using var response = await client.GetAsync(imageUrl);
            if (response.IsSuccessStatusCode)
            {
                var contentPath = _environment.ContentRootPath;
                var uploadDir = Path.Combine(contentPath, "Uploads", folder);
                if (!Directory.Exists(uploadDir))
                {
                    Directory.CreateDirectory(uploadDir);
                }

                var uniqueFileName = $"{Guid.NewGuid():N}.jpg";
                var fullPath = Path.Combine(uploadDir, uniqueFileName);
                await using var localStream = new FileStream(fullPath, FileMode.Create);
                await response.Content.CopyToAsync(localStream);

                return new CloudinaryUploadResult
                {
                    Url = $"/Uploads/{folder}/{uniqueFileName}",
                    PublicId = $"local_{uniqueFileName}"
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to download image from {Url} for local storage fallback", imageUrl);
        }

        return new CloudinaryUploadResult
        {
            Url = imageUrl,
            PublicId = string.Empty
        };
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return false;
        }

        // 1. If Cloudinary is configured and it's a Cloudinary publicId
        if (_cloudinary != null && !publicId.StartsWith("local_"))
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok";
        }

        // 2. If local fallback
        if (publicId.StartsWith("local_"))
        {
            var fileName = publicId.Replace("local_", "");
            var contentPath = _environment.ContentRootPath;
            // Check in Uploads and subfolders
            var files = Directory.GetFiles(Path.Combine(contentPath, "Uploads"), fileName, SearchOption.AllDirectories);
            foreach (var f in files)
            {
                if (File.Exists(f))
                {
                    File.Delete(f);
                    return true;
                }
            }
        }

        return false;
    }
}

