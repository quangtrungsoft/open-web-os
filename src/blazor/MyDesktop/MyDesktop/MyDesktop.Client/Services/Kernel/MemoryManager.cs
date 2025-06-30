using MyDesktop.Client.Models;
using System.Collections.Generic;

namespace MyDesktop.Client.Services.Kernel
{
    public class MemoryManager : IMemoryManager
    {
        private readonly Dictionary<string, MemoryInfo> _allocatedMemory = new();

        public async Task<MemoryInfo> AllocateAsync(int size)
        {
            var memoryInfo = new MemoryInfo
            {
                Id = Guid.NewGuid().ToString(),
                Size = size
            };

            _allocatedMemory[memoryInfo.Id] = memoryInfo;
            return await Task.FromResult(memoryInfo);
        }

        public async Task<bool> FreeAsync(string memoryId)
        {
            if (_allocatedMemory.ContainsKey(memoryId))
            {
                _allocatedMemory.Remove(memoryId);
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<MemoryInfo> GetMemoryInfoAsync(string memoryId)
        {
            if (_allocatedMemory.TryGetValue(memoryId, out var memoryInfo))
            {
                return await Task.FromResult(memoryInfo);
            }
            return await Task.FromResult<MemoryInfo>(null);
        }
    }
}