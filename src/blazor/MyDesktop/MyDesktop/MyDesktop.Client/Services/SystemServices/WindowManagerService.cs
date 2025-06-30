using System.Collections.Generic;
using System.Threading.Tasks;
using MyDesktop.Client.Models;

namespace MyDesktop.Client.Services.SystemServices
{
    public class WindowManagerService : IWindowManagerService
    {
        private readonly Dictionary<string, WindowInfo> _openWindows = new();
        private readonly IEventBusService _eventBus;

        public WindowManagerService(IEventBusService eventBus)
        {
            _eventBus = eventBus;
        }

        public async Task<WindowInfo> CreateWindowAsync(string appId, WindowOptions options)
        {
            var window = new WindowInfo
            {
                Id = Guid.NewGuid().ToString(),
                AppId = appId,
                Title = options.Title,
                X = options.X,
                Y = options.Y,
                Width = options.Width,
                Height = options.Height,
                State = WindowState.Normal
            };

            _openWindows[window.Id] = window;
            await _eventBus.PublishAsync(new WindowCreatedEvent { Window = window });
            return await Task.FromResult(window);
        }

        public async Task<bool> CloseWindowAsync(string windowId)
        {
            if (_openWindows.ContainsKey(windowId))
            {
                _openWindows.Remove(windowId);
                await _eventBus.PublishAsync(new WindowClosedEvent { WindowId = windowId });
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<bool> MinimizeWindowAsync(string windowId)
        {
            if (_openWindows.TryGetValue(windowId, out var window))
            {
                window.State = WindowState.Minimized;
                await _eventBus.PublishAsync(new WindowMinimizedEvent { WindowId = windowId });
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<bool> MaximizeWindowAsync(string windowId)
        {
            if (_openWindows.TryGetValue(windowId, out var window))
            {
                window.State = WindowState.Maximized;
                await _eventBus.PublishAsync(new WindowMaximizedEvent { WindowId = windowId });
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<bool> MoveWindowAsync(string windowId, int x, int y)
        {
            if (_openWindows.TryGetValue(windowId, out var window))
            {
                window.X = x;
                window.Y = y;
                await _eventBus.PublishAsync(new WindowMovedEvent { WindowId = windowId, X = x, Y = y });
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<bool> ResizeWindowAsync(string windowId, int width, int height)
        {
            if (_openWindows.TryGetValue(windowId, out var window))
            {
                window.Width = width;
                window.Height = height;
                await _eventBus.PublishAsync(new WindowResizedEvent { WindowId = windowId, Width = width, Height = height });
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<IEnumerable<WindowInfo>> GetOpenWindowsAsync()
        {
            return await Task.FromResult(_openWindows.Values);
        }
    }
}