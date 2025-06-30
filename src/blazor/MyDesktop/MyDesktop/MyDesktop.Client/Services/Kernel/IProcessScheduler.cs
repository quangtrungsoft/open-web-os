using MyDesktop.Client.Models;

namespace MyDesktop.Client.Services.Kernel
{
    public interface IProcessScheduler
    {
        Task<VirtualProcess> ScheduleNextProcessAsync();
        Task<bool> AddProcessAsync(VirtualProcess process);
        Task<bool> RemoveProcessAsync(string processId);
    }
}