/**
 * My Desktop - Event Bus
 * Handles communication between modules
 */

class EventBus {
    constructor() {
        this.events = new Map();
        this.onceEvents = new Map();
        this.isInitialized = false;
    }

    /**
     * Initialize the event bus
     */
    init() {
        if (this.isInitialized) return;
        
        this.isInitialized = true;
        console.log('Event Bus initialized');
    }

    /**
     * Subscribe to an event
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function
     * @param {Object} options - Options object
     */
    on(eventName, callback, options = {}) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        
        const eventData = {
            callback,
            options,
            id: Date.now() + Math.random()
        };
        
        this.events.get(eventName).push(eventData);
        
        return eventData.id; // Return subscription ID for unsubscribing
    }

    /**
     * Subscribe to an event once (auto-unsubscribe after first trigger)
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function
     */
    once(eventName, callback) {
        const wrappedCallback = (data) => {
            callback(data);
            this.off(eventName, wrappedCallback);
        };
        
        return this.on(eventName, wrappedCallback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - Name of the event
     * @param {Function|string} callbackOrId - Callback function or subscription ID
     */
    off(eventName, callbackOrId) {
        if (!this.events.has(eventName)) return;
        
        const listeners = this.events.get(eventName);
        
        if (typeof callbackOrId === 'string') {
            // Remove by subscription ID
            const index = listeners.findIndex(listener => listener.id === callbackOrId);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        } else {
            // Remove by callback function
            const index = listeners.findIndex(listener => listener.callback === callbackOrId);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
        
        // Remove event if no listeners
        if (listeners.length === 0) {
            this.events.delete(eventName);
        }
    }

    /**
     * Emit an event
     * @param {string} eventName - Name of the event
     * @param {*} data - Data to pass to listeners
     */
    emit(eventName, data = null) {
        if (!this.events.has(eventName)) return;
        
        const listeners = this.events.get(eventName);
        
        // Create a copy to avoid issues if listeners are removed during execution
        const listenersCopy = [...listeners];
        
        listenersCopy.forEach(listener => {
            try {
                listener.callback(data);
            } catch (error) {
                console.error(`Error in event listener for ${eventName}:`, error);
            }
        });
    }

    /**
     * Get all event names
     * @returns {Array} Array of event names
     */
    getEventNames() {
        return Array.from(this.events.keys());
    }

    /**
     * Get listener count for an event
     * @param {string} eventName - Name of the event
     * @returns {number} Number of listeners
     */
    getListenerCount(eventName) {
        if (!this.events.has(eventName)) return 0;
        return this.events.get(eventName).length;
    }

    /**
     * Clear all listeners for an event
     * @param {string} eventName - Name of the event
     */
    clearEvent(eventName) {
        this.events.delete(eventName);
    }

    /**
     * Clear all events and listeners
     */
    clearAll() {
        this.events.clear();
        this.onceEvents.clear();
    }

    /**
     * Get statistics about the event bus
     * @returns {Object} Statistics object
     */
    getStats() {
        const stats = {
            totalEvents: this.events.size,
            totalListeners: 0,
            events: {}
        };
        
        for (const [eventName, listeners] of this.events) {
            stats.events[eventName] = listeners.length;
            stats.totalListeners += listeners.length;
        }
        
        return stats;
    }

    /**
     * Debug: Log all events and listeners
     */
    debug() {
        console.log('Event Bus Debug Info:');
        console.log('Total events:', this.events.size);
        
        for (const [eventName, listeners] of this.events) {
            console.log(`- ${eventName}: ${listeners.length} listeners`);
        }
    }
}

// Export the event bus
window.EventBus = EventBus; 