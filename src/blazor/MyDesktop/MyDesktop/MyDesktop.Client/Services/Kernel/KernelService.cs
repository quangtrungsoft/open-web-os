using MyDesktop.Client.Models;

namespace MyDesktop.Client.Services.Kernel
{
    public class KernelService : IKernelService
    {
        private readonly IProcessScheduler _processScheduler;
        private readonly IMemoryManager _memoryManager;
        private readonly IFileSystemManager _fileSystemManager;

        public KernelService(IProcessScheduler processScheduler, IMemoryManager memoryManager, IFileSystemManager fileSystemManager)
        {
            _processScheduler = processScheduler;
            _memoryManager = memoryManager;
            _fileSystemManager = fileSystemManager;
        }

        public async Task<VirtualProcess> CreateProcessAsync(string appId, ProcessOptions options)
        {
            var process = new VirtualProcess
            {
                Id = Guid.NewGuid().ToString(),
                AppId = appId,
                State = ProcessState.Running
            };

            return await Task.FromResult(process);
        }

        public async Task<bool> TerminateProcessAsync(string processId)
        {
            return await Task.FromResult(true);
        }

        public async Task<MemoryInfo> AllocateMemoryAsync(int size)
        {
            var memoryInfo = new MemoryInfo
            {
                Id = Guid.NewGuid().ToString(),
                Size = size
            };

            return await Task.FromResult(memoryInfo);
        }

        public async Task<bool> FreeMemoryAsync(string memoryId)
        {
            return await Task.FromResult(true);
        }

        public async Task<VirtualFile> CreateFileAsync(string path, FileType type)
        {
            var file = new VirtualFile
            {
                Path = path,
                Type = type
            };

            return await Task.FromResult(file);
        }

        public async Task<bool> DeleteFileAsync(string path)
        {
            return await Task.FromResult(true);
        }
    }
}