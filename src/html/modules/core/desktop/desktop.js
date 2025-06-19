/**
 * WebOS - Desktop Module
 * Handles desktop functionality
 */

class Desktop {
    constructor() {
        this.element = null;
        this.init();
    }
    
    init() {
        this.element = document.getElementById('desktop');
        if (this.element) {
            console.log('Desktop initialized');
            this.bindEvents();
        } else {
            console.error('Desktop element not found');
        }
    }
    
    bindEvents() {
        // Desktop click events
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                // Desktop background clicked - unfocus all windows
                if (window.windowManager) {
                    window.windowManager.unfocusAllWindows();
                }
                
                // Emit desktop clicked event
                if (window.eventBus) {
                    window.eventBus.emit('desktop:clicked', e);
                }
            }
        });
        
        // Desktop right-click events
        this.element.addEventListener('contextmenu', (e) => {
            if (e.target === this.element) {
                e.preventDefault();
                if (window.eventBus) {
                    window.eventBus.emit('desktop:rightClicked', e);
                }
            }
        });
    }
}

// Export the desktop class
window.Desktop = Desktop; 