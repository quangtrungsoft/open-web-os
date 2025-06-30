using System.Collections.Generic;

namespace MyDesktop.Client.Services.Kernel
{
    public class SecurityGuard : ISecurityGuard
    {
        private readonly Dictionary<string, List<string>> _pluginPermissions = new();

        public async Task<bool> ValidatePermissionAsync(string pluginId, string permission)
        {
            if (_pluginPermissions.TryGetValue(pluginId, out var permissions))
            {
                return await Task.FromResult(permissions.Contains(permission));
            }
            return await Task.FromResult(false);
        }

        public async Task<bool> SandboxExecuteAsync(string pluginId, Func<Task> action)
        {
            try
            {
                await action();
                return await Task.FromResult(true);
            }
            catch
            {
                return await Task.FromResult(false);
            }
        }

        public async Task<T> SandboxExecuteAsync<T>(string pluginId, Func<Task<T>> action)
        {
            try
            {
                return await action();
            }
            catch
            {
                return await Task.FromResult<T>(default);
            }
        }
    }
}