namespace MyDesktop.Client.Services.Kernel
{
    public interface ISecurityGuard
    {
        Task<bool> ValidatePermissionAsync(string pluginId, string permission);
        Task<bool> SandboxExecuteAsync(string pluginId, Func<Task> action);
        Task<T> SandboxExecuteAsync<T>(string pluginId, Func<Task<T>> action);
    }
}