using MyDesktop.Client.Models;

namespace MyDesktop.Client.Services.Kernel
{
    public interface IFileSystemManager
    {
        Task<VirtualFile> CreateFileAsync(string path, FileType type);
        Task<bool> DeleteFileAsync(string path);
        Task<VirtualFile> GetFileAsync(string path);
        Task<bool> FileExistsAsync(string path);
    }
}