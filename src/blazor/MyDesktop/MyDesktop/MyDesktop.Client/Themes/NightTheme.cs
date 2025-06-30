using Microsoft.JSInterop;
using MyDesktop.Client.Models;

namespace MyDesktop.Client.Themes
{
    public class NightTheme : MyDesktopThemeBase
    {
        public NightTheme(IJSRuntime jsRuntime) : base(jsRuntime)
        {
        }

        public override string Code => "night";
        public override string Name => "Night";
        public override string ThemeClass => "NightTheme";
        public override string Description => "Giao diện tối ";
    }
}
