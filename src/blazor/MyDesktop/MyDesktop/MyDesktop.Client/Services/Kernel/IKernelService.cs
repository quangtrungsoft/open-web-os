using MyDesktop.Client.Models;

namespace MyDesktop.Client.Services.Kernel
{
    public interface IKernelService
    {
        Task<VirtualProcess> CreateProcessAsync(string appId, ProcessOptions options);
        Task<bool> TerminateProcessAsync(string processId);
        Task<MemoryInfo> AllocateMemoryAsync(int size);
        Task<bool> FreeMemoryAsync(string memoryId);
        Task<VirtualFile> CreateFileAsync(string path, FileType type);
        Task<bool> DeleteFileAsync(string path);
    }
}