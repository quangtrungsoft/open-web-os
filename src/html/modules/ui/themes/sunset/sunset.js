/**
 * Sunset Theme - JavaScript Initialization
 * Handles theme-specific functionality and initialization
 */

class SunsetTheme {
    constructor() {
        this.name = 'Sunset Theme';
        this.id = 'sunset';
        this.isInitialized = false;
    }

    apply() {
        if (this.isInitialized) return;

        document.body.classList.add('theme-sunset');
        
        this.isInitialized = true;
        console.log(`${this.name} applied.`);
    }

    remove() {
        document.body.classList.remove('theme-sunset');
        this.isInitialized = false;
        console.log(`${this.name} removed.`);
    }
}

window.SunsetTheme = SunsetTheme; 
window.SunsetTheme = SunsetTheme; 