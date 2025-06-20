class DarkNightTheme {
    constructor() {
        this.name = 'Dark Night Theme';
        this.id = 'darknight';
        this.isInitialized = false;
    }

    apply() {
        if (this.isInitialized) return;
        document.body.classList.add('theme-darknight');
        this.isInitialized = true;
        console.log(`${this.name} applied.`);
    }

    remove() {
        document.body.classList.remove('theme-darknight');
        this.isInitialized = false;
        console.log(`${this.name} removed.`);
    }
}

window.DarkNightTheme = DarkNightTheme; 