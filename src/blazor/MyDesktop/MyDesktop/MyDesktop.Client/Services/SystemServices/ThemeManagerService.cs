using Microsoft.JSInterop;
using MyDesktop.Client.Models;

namespace MyDesktop.Client.Services.SystemServices
{
    public class ThemeManagerService
    {
        private readonly IJSRuntime _jsRuntime;
        private readonly IEventBusService _eventBus;

        private readonly Dictionary<string, MyDesktopThemeBase> _themes = new();
        public IReadOnlyDictionary<string, MyDesktopThemeBase> Themes => _themes;

        public ThemeManagerService(IJSRuntime jsRuntime, IEventBusService eventBus)
        {
            _jsRuntime = jsRuntime;
            _eventBus = eventBus;
        }

        public async Task ApplyThemeAsync(string themeCode)
        {
            if (_themes.TryGetValue(themeCode, out var theme))
            {
                await theme.ApplyThemeAsync();
                await _eventBus.PublishAsync(new ThemeChangedEvent { ThemeName = themeCode });
            }

        }

        public void RegisterTheme<T>(T theme) where T : MyDesktopThemeBase
        {
            if (!_themes.ContainsKey(theme.Code))
                _themes.Add(theme.Code, theme);
        }

        public MyDesktopThemeBase? GetTheme(string code)
        {
            return _themes.TryGetValue(code, out var theme) ? theme : null;
        }

        public T? GetTheme<T>(string code) where T : MyDesktopThemeBase
        {
            var selected = _themes.TryGetValue(code, out var theme) ? theme : null;

            return selected is T typedTheme ? typedTheme : null;
        }
    }
}