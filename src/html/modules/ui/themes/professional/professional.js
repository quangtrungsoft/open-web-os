/**
 * Professional Theme - JavaScript Initialization
 * Handles theme-specific functionality and initialization
 */

class ProfessionalTheme {
    constructor() {
        this.name = 'Professional Theme';
        this.id = 'professional';
        this.isInitialized = false;
    }

    apply() {
        if (this.isInitialized) return;

        document.body.classList.add('theme-professional');
        
        this.isInitialized = true;
        console.log(`${this.name} applied.`);
    }

    remove() {
        document.body.classList.remove('theme-professional');
        this.isInitialized = false;
        console.log(`${this.name} removed.`);
    }
}

window.ProfessionalTheme = ProfessionalTheme; 
window.ProfessionalTheme = ProfessionalTheme; 