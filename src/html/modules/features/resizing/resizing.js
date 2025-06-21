/**
 * My Desktop - Resizing
 * Handles window resizing and responsive behavior
 */

class Resizing {
    constructor() {
        this.eventBus = null;
        this.isInitialized = false;
    }

    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('Resizing: EventBus not available');
            return false;
        }
        
        this.isInitialized = true;
        console.log('Resizing initialized');
        return true;
    }

    destroy() {
        this.isInitialized = false;
        console.log('Resizing destroyed');
    }
}

window.Resizing = Resizing; 