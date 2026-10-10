using Microsoft.AspNetCore.Http;

namespace BookStoreFullStackNg.Data.Services
{
    public interface IFileService
    {
        void DeleteFile(string fileNameWithExtension);
        Task<string> SaveFileAsync(IFormFile imageFile, string[] allowedFileExtensions);
    }
}