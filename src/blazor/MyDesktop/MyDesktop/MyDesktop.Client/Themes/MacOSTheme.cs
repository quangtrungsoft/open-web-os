using Microsoft.JSInterop;
using MyDesktop.Client.Models;

namespace MyDesktop.Client.Themes
{
    public class MacOSTheme : MyDesktopThemeBase
    {
        public MacOSTheme(IJSRuntime jsRuntime) : base(jsRuntime)
        {
        }

        public override string Code => "macos";
        public override string Name => "MacOS";
        public override string ThemeClass => "MacOSTheme";
        public override string Description => "Theme phong cách MacOS";
    }
}
