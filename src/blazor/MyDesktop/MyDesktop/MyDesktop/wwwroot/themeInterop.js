window.themeInterop = {
    setCssVariables: function (vars) {
        for (const key in vars) {
            if (vars.hasOwnProperty(key)) {
                document.documentElement.style.setProperty('--' + key, vars[key]);
            }
        }
    }
}; 