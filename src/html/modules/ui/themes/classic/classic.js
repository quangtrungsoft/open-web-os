/**
 * Classic Theme - JavaScript Initialization
 * Handles theme-specific functionality and initialization
 */

class ClassicTheme {
    constructor() {
        this.name = 'Classic Theme';
        this.id = 'classic';
        this.isInitialized = false;
    }

    apply() {
        if (this.isInitialized) return;

        document.body.classList.add('theme-classic');
        
        this.isInitialized = true;
        console.log(`${this.name} applied.`);
    }

    remove() {
        document.body.classList.remove('theme-classic');
        this.isInitialized = false;
        console.log(`${this.name} removed.`);
    }
}

window.ClassicTheme = ClassicTheme; 
window.ClassicTheme = ClassicTheme; 