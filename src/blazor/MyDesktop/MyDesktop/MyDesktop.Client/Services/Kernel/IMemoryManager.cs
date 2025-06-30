using MyDesktop.Client.Models;

namespace MyDesktop.Client.Services.Kernel
{
    public interface IMemoryManager
    {
        Task<MemoryInfo> AllocateAsync(int size);
        Task<bool> FreeAsync(string memoryId);
        Task<MemoryInfo> GetMemoryInfoAsync(string memoryId);
    }
}