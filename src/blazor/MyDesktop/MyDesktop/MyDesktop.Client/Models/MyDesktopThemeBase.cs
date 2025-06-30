using Microsoft.JSInterop;
using System.IO;

namespace MyDesktop.Client.Models
{
    public abstract class MyDesktopThemeBase
    {
        protected IJSRuntime JsRuntime { get; private set; } // Fixed naming rule violation (IDE1006)  

        public MyDesktopThemeBase(IJSRuntime jsRuntime) // Added constructor to initialize jsRuntime (CS8618 fix)  
        {
            JsRuntime = jsRuntime ?? throw new ArgumentNullException(nameof(jsRuntime));
        }

        public abstract string Code { get; }
        public abstract string Name { get; }
        public abstract string ThemeClass { get; }
        public virtual string Description => "";
        public virtual string CssPath => $"themes/{Code}/{Code}.css";
        public virtual string JsPath => $"themes/{Code}/{Code}.js";

        public virtual ThemeInfo Info => new ThemeInfo
        {
            Code = Code,
            Name = Name,
            CssPath = CssPath,
            JsPath = JsPath,
            Description = Description
        };

        /// <summary>
        /// applyTheme - Nạp theme hiện tại, bao gồm CSS và JS
        /// </summary>
        /// <returns></returns>
        public virtual async Task ApplyThemeAsync()
        {
            // Remove previous theme  
            await JsRuntime.InvokeVoidAsync("MyDesktopThemeManager.loadTheme", CssPath, JsPath);
            // Load new CSS, JS  
            await JsRuntime.InvokeVoidAsync($"{ThemeClass}.applyTheme");
        }

        public virtual bool ValidateTheme()
        {
            return true;
        }

        /// <summary>
        /// openSetting - Mở popup/setting riêng cho theme
        /// </summary>
        /// <returns></returns>
        public virtual async Task OpenThemeSettingAsync()
        {
            await JsRuntime.InvokeVoidAsync($"{ThemeClass}.openSetting");
        }
    }
    public class ThemeInfo
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string CssPath { get; set; }
        public string JsPath { get; set; }
        public string Description { get; set; }
    }

}
