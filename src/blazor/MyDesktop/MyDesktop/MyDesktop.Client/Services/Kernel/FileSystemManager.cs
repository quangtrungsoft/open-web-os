using MyDesktop.Client.Models;
using System.Collections.Generic;

namespace MyDesktop.Client.Services.Kernel
{
    public class FileSystemManager : IFileSystemManager
    {
        private readonly Dictionary<string, VirtualFile> _files = new();

        public async Task<VirtualFile> CreateFileAsync(string path, FileType type)
        {
            var file = new VirtualFile
            {
                Path = path,
                Type = type
            };

            _files[path] = file;
            return await Task.FromResult(file);
        }

        public async Task<bool> DeleteFileAsync(string path)
        {
            if (_files.ContainsKey(path))
            {
                _files.Remove(path);
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<VirtualFile> GetFileAsync(string path)
        {
            if (_files.TryGetValue(path, out var file))
            {
                return await Task.FromResult(file);
            }
            return await Task.FromResult<VirtualFile>(null);
        }

        public async Task<bool> FileExistsAsync(string path)
        {
            return await Task.FromResult(_files.ContainsKey(path));
        }
    }
}