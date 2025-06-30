using MyDesktop.Client.Services.SystemServices;
using MyDesktop.Client.Services.Kernel;

namespace MyDesktop.Client.Models
{
    // Window Events
    public class WindowCreatedEvent
    {
        public WindowInfo Window { get; set; } = new();
    }

    public class WindowClosedEvent
    {
        public string WindowId { get; set; } = string.Empty;
    }

    public class WindowMinimizedEvent
    {
        public string WindowId { get; set; } = string.Empty;
    }

    public class WindowMaximizedEvent
    {
        public string WindowId { get; set; } = string.Empty;
    }

    public class WindowMovedEvent
    {
        public string WindowId { get; set; } = string.Empty;
        public int X { get; set; }
        public int Y { get; set; }
    }

    public class WindowResizedEvent
    {
        public string WindowId { get; set; } = string.Empty;
        public int Width { get; set; }
        public int Height { get; set; }
    }

    public class WindowRestoredEvent
    {
        public string WindowId { get; set; } = string.Empty;
    }

    // Input Events
    public class MouseEventOccurredEvent
    {
        public MouseEvent MouseEvent { get; set; }
    }

    public class KeyboardEventOccurredEvent
    {
        public KeyboardEvent KeyboardEvent { get; set; }
    }

    public class TouchEventOccurredEvent
    {
        public TouchEvent TouchEvent { get; set; }
    }

    // Theme Events
    public class ThemeChangedEvent
    {
        public string ThemeName { get; set; } = string.Empty;
    }

    // Plugin Events
    public class PluginInstalledEvent
    {
        public string PluginId { get; set; }
        public string PluginName { get; set; }
    }

    public class PluginUninstalledEvent
    {
        public string PluginId { get; set; }
    }

    // Desktop Events
    public class DesktopClickedEvent
    {
        public int X { get; set; }
        public int Y { get; set; }
    }

    public class ControlCenterToggledEvent
    {
        public bool IsOpen { get; set; }
    }

    public class NotificationCenterToggledEvent
    {
        public bool IsOpen { get; set; }
    }

    public class MouseEvent
    {
        public int X { get; set; }
        public int Y { get; set; }
        public string Button { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }

    public class KeyboardEvent
    {
        public string Key { get; set; } = string.Empty;
        public bool CtrlKey { get; set; }
        public bool AltKey { get; set; }
        public bool ShiftKey { get; set; }
        public string Type { get; set; } = string.Empty;
    }

    public class TouchEvent
    {
        public int X { get; set; }
        public int Y { get; set; }
        public string Type { get; set; } = string.Empty;
        public int TouchCount { get; set; }
    }

    public class PluginLoadedEvent
    {
        public string PluginId { get; set; } = string.Empty;
        public string PluginName { get; set; } = string.Empty;
    }

    public class PluginUnloadedEvent
    {
        public string PluginId { get; set; } = string.Empty;
    }
}