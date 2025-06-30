using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyDesktop.Client.Services.SystemServices
{
    public interface IWindowManagerService
    {
        Task<WindowInfo> CreateWindowAsync(string appId, WindowOptions options);
        Task<bool> CloseWindowAsync(string windowId);
        Task<bool> MinimizeWindowAsync(string windowId);
        Task<bool> MaximizeWindowAsync(string windowId);
        Task<bool> MoveWindowAsync(string windowId, int x, int y);
        Task<bool> ResizeWindowAsync(string windowId, int width, int height);
        Task<IEnumerable<WindowInfo>> GetOpenWindowsAsync();
    }

    public class WindowInfo
    {
        public string Id { get; set; }
        public string AppId { get; set; }
        public string Title { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public WindowState State { get; set; }
    }

    public enum WindowState
    {
        Normal,
        Minimized,
        Maximized,
        FullScreen
    }

    public class WindowOptions
    {
        public string Title { get; set; }
        public int Width { get; set; } = 800;
        public int Height { get; set; } = 600;
        public int X { get; set; } = 100;
        public int Y { get; set; } = 100;
        public bool Resizable { get; set; } = true;
        public bool Minimizable { get; set; } = true;
        public bool Maximizable { get; set; } = true;
    }
}