using MyDesktop.Client.Models;
using System.Collections.Generic;

namespace MyDesktop.Client.Services.Kernel
{
    public class ProcessScheduler : IProcessScheduler
    {
        private readonly Queue<VirtualProcess> _readyQueue = new();
        private readonly Dictionary<string, VirtualProcess> _runningProcesses = new();

        public async Task<VirtualProcess> ScheduleNextProcessAsync()
        {
            // Round-Robin scheduling implementation
            if (_readyQueue.Count > 0)
            {
                var process = _readyQueue.Dequeue();
                _runningProcesses[process.Id] = process;
                return await Task.FromResult(process);
            }
            return await Task.FromResult<VirtualProcess>(null);
        }

        public async Task<bool> AddProcessAsync(VirtualProcess process)
        {
            _readyQueue.Enqueue(process);
            return await Task.FromResult(true);
        }

        public async Task<bool> RemoveProcessAsync(string processId)
        {
            if (_runningProcesses.ContainsKey(processId))
            {
                _runningProcesses.Remove(processId);
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }
    }
}