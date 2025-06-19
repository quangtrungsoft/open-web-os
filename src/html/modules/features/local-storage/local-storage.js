/**
 * WebOS - Local Storage
 * Handles local storage functionality
 */

class LocalStorage {
    constructor() {
        this.eventBus = null;
        this.isInitialized = false;
    }

    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('LocalStorage: EventBus not available');
            return false;
        }
        
        this.isInitialized = true;
        console.log('Local Storage initialized');
        return true;
    }

    destroy() {
        this.isInitialized = false;
        console.log('Local Storage destroyed');
    }
}

window.LocalStorage = LocalStorage; 