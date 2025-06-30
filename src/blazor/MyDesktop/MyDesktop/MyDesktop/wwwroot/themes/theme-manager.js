class MyDesktopThemeManager {
    static currentThemeId = null;

    static loadTheme(cssPath, jsPath) {
        this.removeCurrentTheme();
        if (cssPath) {
            const link = document.createElement("link");
            link.href = cssPath;
            link.rel = "stylesheet";
            link.id = "dynamic-theme-css";
            link.setAttribute('data-theme', themeCode);
            document.head.appendChild(link);
            this.currentThemeId = "dynamic-theme-css";
        }
        if (jsPath) {
            const script = document.createElement("script");
            script.src = jsPath;
            script.async = true;
            script.id = "dynamic-theme-js";
            document.head.appendChild(script);
        }
    }

    static removeCurrentTheme() {
        document.querySelectorAll("link[data-theme]").forEach(e => e.remove());
        document.querySelectorAll("script[data-theme]").forEach(e => e.remove());
    }
}

window.MyDesktopThemeManager = MyDesktopThemeManager;