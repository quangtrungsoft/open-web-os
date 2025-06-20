/**
 * Night Theme - JavaScript Initialization
 * Handles theme-specific functionality and initialization
 */

class NightTheme {
    constructor() {
        this.name = 'Night Theme';
        this.id = 'night';
        this.isInitialized = false;
    }

    apply() {
        if (this.isInitialized) return;

        document.body.classList.add('theme-night');
        
        this.isInitialized = true;
        console.log(`${this.name} applied.`);
    }

    remove() {
        document.body.classList.remove('theme-night');
        this.isInitialized = false;
        console.log(`${this.name} removed.`);
    }
}

window.NightTheme = NightTheme; 
window.NightTheme = NightTheme; 