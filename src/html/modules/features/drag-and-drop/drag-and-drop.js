/**
 * WebOS - Drag and Drop
 * Handles drag and drop functionality
 */

class DragAndDrop {
    constructor() {
        this.eventBus = null;
        this.isInitialized = false;
    }

    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('DragAndDrop: EventBus not available');
            return false;
        }
        
        this.isInitialized = true;
        console.log('Drag and Drop initialized');
        return true;
    }

    destroy() {
        this.isInitialized = false;
        console.log('Drag and Drop destroyed');
    }
}

window.DragAndDrop = DragAndDrop; 