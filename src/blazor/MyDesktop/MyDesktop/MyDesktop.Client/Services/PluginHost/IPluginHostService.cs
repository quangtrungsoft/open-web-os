namespace MyDesktop.Client.Services.PluginHost
{
    public interface IPluginHostService
    {
        Task<PluginInfo> LoadPluginAsync(string pluginPath);
        Task<bool> UnloadPluginAsync(string pluginId);
        Task<IEnumerable<PluginInfo>> GetLoadedPluginsAsync();
        Task<T> GetPluginServiceAsync<T>(string pluginId) where T : class;
    }

    public class PluginInfo
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Version { get; set; }
        public string Description { get; set; }
        public string EntryPoint { get; set; }
        public List<string> Dependencies { get; set; }
        public List<string> Capabilities { get; set; }
        public Dictionary<string, object> Configuration { get; set; }
    }
}