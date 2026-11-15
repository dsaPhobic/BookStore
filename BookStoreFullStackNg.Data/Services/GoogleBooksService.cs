using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using BookStoreFullStackNg.Data.DTOs;
using Microsoft.Extensions.Logging;

namespace BookStoreFullStackNg.Data.Services;

public class GoogleBooksService : IIsbnLookupService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<GoogleBooksService> _logger;

    public GoogleBooksService(HttpClient httpClient, ILogger<GoogleBooksService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        if (!_httpClient.DefaultRequestHeaders.Contains("User-Agent"))
        {
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "BookStoreApp/1.0 (Windows NT 10.0; Win64; x64)");
        }
    }

    public async Task<IsbnLookupResultDto> LookupByIsbnAsync(string isbn)
    {
        if (string.IsNullOrWhiteSpace(isbn))
        {
            return new IsbnLookupResultDto { Found = false };
        }

        var cleanedIsbn = isbn.Replace("-", "").Replace(" ", "").Trim();

        // 1. Try Google Books API first
        try
        {
            var googleResult = await TryGoogleBooksAsync(cleanedIsbn);
            if (googleResult != null && googleResult.Found)
            {
                return googleResult;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Google Books API failed for ISBN {ISBN}. Falling back to Open Library.", cleanedIsbn);
        }

        // 2. Fallback to Open Library /isbn/{isbn}.json
        try
        {
            var olResult = await TryOpenLibraryAsync(cleanedIsbn);
            if (olResult != null && olResult.Found)
            {
                return olResult;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Open Library ISBN endpoint failed for ISBN {ISBN}.", cleanedIsbn);
        }

        // 3. Fallback to Open Library bibkeys data API
        try
        {
            var olDataResult = await TryOpenLibraryDataApiAsync(cleanedIsbn);
            if (olDataResult != null && olDataResult.Found)
            {
                return olDataResult;
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Open Library data API failed for ISBN {ISBN}.", cleanedIsbn);
        }

        return new IsbnLookupResultDto { Found = false, ISBN = cleanedIsbn };
    }

    private async Task<IsbnLookupResultDto?> TryGoogleBooksAsync(string cleanedIsbn)
    {
        var url = $"https://www.googleapis.com/books/v1/volumes?q=isbn:{cleanedIsbn}";
        using var response = await _httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        using var jsonStream = await response.Content.ReadAsStreamAsync();
        using var doc = await JsonDocument.ParseAsync(jsonStream);
        var root = doc.RootElement;

        if (!root.TryGetProperty("totalItems", out var totalItems) || totalItems.GetInt32() == 0)
        {
            return null;
        }

        if (!root.TryGetProperty("items", out var items) || items.GetArrayLength() == 0)
        {
            return null;
        }

        var firstItem = items[0];
        if (!firstItem.TryGetProperty("volumeInfo", out var volumeInfo))
        {
            return null;
        }

        var result = new IsbnLookupResultDto
        {
            Found = true,
            ISBN = cleanedIsbn
        };

        if (volumeInfo.TryGetProperty("title", out var titleProp))
        {
            result.Title = titleProp.GetString();
        }

        if (volumeInfo.TryGetProperty("description", out var descProp))
        {
            result.Description = descProp.GetString();
        }

        if (volumeInfo.TryGetProperty("publisher", out var pubProp))
        {
            result.Publisher = pubProp.GetString();
        }

        if (volumeInfo.TryGetProperty("language", out var langProp))
        {
            result.Language = langProp.GetString();
        }

        if (volumeInfo.TryGetProperty("pageCount", out var pageProp))
        {
            result.PageCount = pageProp.GetInt32();
        }

        if (volumeInfo.TryGetProperty("publishedDate", out var pubDateProp))
        {
            var pubDateStr = pubDateProp.GetString();
            if (!string.IsNullOrEmpty(pubDateStr) && pubDateStr.Length >= 4)
            {
                if (int.TryParse(pubDateStr.Substring(0, 4), out var year))
                {
                    result.PublishedYear = year;
                }
            }
        }

        if (volumeInfo.TryGetProperty("authors", out var authorsProp) && authorsProp.ValueKind == JsonValueKind.Array)
        {
            foreach (var author in authorsProp.EnumerateArray())
            {
                var authorStr = author.GetString();
                if (!string.IsNullOrEmpty(authorStr))
                {
                    result.Authors.Add(authorStr);
                }
            }
        }

        if (volumeInfo.TryGetProperty("imageLinks", out var imageLinks))
        {
            string? imgUrl = null;
            if (imageLinks.TryGetProperty("thumbnail", out var thumbProp))
            {
                imgUrl = thumbProp.GetString();
            }
            else if (imageLinks.TryGetProperty("smallThumbnail", out var smallThumbProp))
            {
                imgUrl = smallThumbProp.GetString();
            }

            if (!string.IsNullOrEmpty(imgUrl))
            {
                if (imgUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase))
                {
                    imgUrl = "https://" + imgUrl.Substring(7);
                }
                result.ImageUrl = imgUrl;
            }
        }

        return result;
    }

    private async Task<IsbnLookupResultDto?> TryOpenLibraryAsync(string cleanedIsbn)
    {
        var url = $"https://openlibrary.org/isbn/{cleanedIsbn}.json";
        using var response = await _httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        using var jsonStream = await response.Content.ReadAsStreamAsync();
        using var doc = await JsonDocument.ParseAsync(jsonStream);
        var root = doc.RootElement;

        var result = new IsbnLookupResultDto
        {
            Found = true,
            ISBN = cleanedIsbn
        };

        if (root.TryGetProperty("title", out var titleProp))
        {
            result.Title = titleProp.GetString();
            if (root.TryGetProperty("subtitle", out var subProp))
            {
                var sub = subProp.GetString();
                if (!string.IsNullOrEmpty(sub))
                {
                    result.Title = $"{result.Title}: {sub}";
                }
            }
        }

        if (root.TryGetProperty("description", out var descProp))
        {
            if (descProp.ValueKind == JsonValueKind.String)
            {
                result.Description = descProp.GetString();
            }
            else if (descProp.ValueKind == JsonValueKind.Object && descProp.TryGetProperty("value", out var descVal))
            {
                result.Description = descVal.GetString();
            }
        }

        if (root.TryGetProperty("publishers", out var pubProp) && pubProp.ValueKind == JsonValueKind.Array)
        {
            foreach (var p in pubProp.EnumerateArray())
            {
                if (p.ValueKind == JsonValueKind.String)
                {
                    result.Publisher = p.GetString();
                    break;
                }
                else if (p.ValueKind == JsonValueKind.Object && p.TryGetProperty("name", out var pName))
                {
                    result.Publisher = pName.GetString();
                    break;
                }
            }
        }

        if (root.TryGetProperty("number_of_pages", out var pageProp))
        {
            result.PageCount = pageProp.GetInt32();
        }

        if (root.TryGetProperty("publish_date", out var pubDateProp))
        {
            var pubDateStr = pubDateProp.GetString();
            if (!string.IsNullOrEmpty(pubDateStr))
            {
                var match = Regex.Match(pubDateStr, @"\b(19\d\d|20\d\d)\b");
                if (match.Success && int.TryParse(match.Value, out var year))
                {
                    result.PublishedYear = year;
                }
            }
        }

        if (root.TryGetProperty("covers", out var coversProp) && coversProp.ValueKind == JsonValueKind.Array)
        {
            foreach (var cov in coversProp.EnumerateArray())
            {
                if (cov.ValueKind == JsonValueKind.Number)
                {
                    var coverId = cov.GetInt64();
                    if (coverId > 0)
                    {
                        result.ImageUrl = $"https://covers.openlibrary.org/b/id/{coverId}-L.jpg";
                        break;
                    }
                }
            }
        }

        return string.IsNullOrEmpty(result.Title) ? null : result;
    }

    private async Task<IsbnLookupResultDto?> TryOpenLibraryDataApiAsync(string cleanedIsbn)
    {
        var bibKey = $"ISBN:{cleanedIsbn}";
        var url = $"https://openlibrary.org/api/books?bibkeys={bibKey}&format=json&jscmd=data";
        using var response = await _httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        using var jsonStream = await response.Content.ReadAsStreamAsync();
        using var doc = await JsonDocument.ParseAsync(jsonStream);
        var root = doc.RootElement;

        if (!root.TryGetProperty(bibKey, out var bookData))
        {
            return null;
        }

        var result = new IsbnLookupResultDto
        {
            Found = true,
            ISBN = cleanedIsbn
        };

        if (bookData.TryGetProperty("title", out var titleProp))
        {
            result.Title = titleProp.GetString();
            if (bookData.TryGetProperty("subtitle", out var subProp))
            {
                var sub = subProp.GetString();
                if (!string.IsNullOrEmpty(sub))
                {
                    result.Title = $"{result.Title}: {sub}";
                }
            }
        }

        if (bookData.TryGetProperty("notes", out var notesProp))
        {
            if (notesProp.ValueKind == JsonValueKind.String)
            {
                result.Description = notesProp.GetString();
            }
        }

        if (bookData.TryGetProperty("publishers", out var pubProp) && pubProp.ValueKind == JsonValueKind.Array)
        {
            foreach (var p in pubProp.EnumerateArray())
            {
                if (p.TryGetProperty("name", out var pName))
                {
                    result.Publisher = pName.GetString();
                    break;
                }
            }
        }

        if (bookData.TryGetProperty("number_of_pages", out var pageProp))
        {
            result.PageCount = pageProp.GetInt32();
        }

        if (bookData.TryGetProperty("publish_date", out var pubDateProp))
        {
            var pubDateStr = pubDateProp.GetString();
            if (!string.IsNullOrEmpty(pubDateStr))
            {
                var match = Regex.Match(pubDateStr, @"\b(19\d\d|20\d\d)\b");
                if (match.Success && int.TryParse(match.Value, out var year))
                {
                    result.PublishedYear = year;
                }
            }
        }

        if (bookData.TryGetProperty("authors", out var authorsProp) && authorsProp.ValueKind == JsonValueKind.Array)
        {
            foreach (var a in authorsProp.EnumerateArray())
            {
                if (a.TryGetProperty("name", out var aName))
                {
                    var aStr = aName.GetString();
                    if (!string.IsNullOrEmpty(aStr))
                    {
                        result.Authors.Add(aStr);
                    }
                }
            }
        }

        if (bookData.TryGetProperty("cover", out var coverProp))
        {
            if (coverProp.TryGetProperty("large", out var largeCov))
            {
                result.ImageUrl = largeCov.GetString();
            }
            else if (coverProp.TryGetProperty("medium", out var medCov))
            {
                result.ImageUrl = medCov.GetString();
            }
        }

        return string.IsNullOrEmpty(result.Title) ? null : result;
    }
}
