/**
 * Ocean Theme - JavaScript Initialization
 * Handles theme-specific functionality and initialization
 */

class OceanTheme {
    constructor() {
        this.name = 'Ocean Theme';
        this.id = 'ocean';
        this.isInitialized = false;
    }

    apply() {
        if (this.isInitialized) return;

        document.body.classList.add('theme-ocean');
        
        this.isInitialized = true;
        console.log(`${this.name} applied.`);
    }

    remove() {
        document.body.classList.remove('theme-ocean');
        this.isInitialized = false;
        console.log(`${this.name} removed.`);
    }
}

window.OceanTheme = OceanTheme; 
window.OceanTheme = OceanTheme; 