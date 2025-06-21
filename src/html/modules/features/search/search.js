/**
 * My Desktop - Search
 * Handles search functionality across applications
 */

class Search {
    constructor() {
        this.eventBus = null;
        this.isInitialized = false;
    }

    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('Search: EventBus not available');
            return false;
        }
        
        this.isInitialized = true;
        console.log('Search initialized');
        return true;
    }

    destroy() {
        this.isInitialized = false;
        console.log('Search destroyed');
    }
}

window.Search = Search; 