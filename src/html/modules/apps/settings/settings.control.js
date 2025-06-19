/**
 * WebOS - Settings Control
 * Handles the Settings app UI interactions and theme selection
 */

class SettingsControl {
    constructor(processor) {
        this.processor = processor;
        this.windowElement = null;
        this.windowId = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the settings control
     * @param {string} windowId - Window identifier
     * @param {HTMLElement} windowElement - Window DOM element
     */
    init(windowId, windowElement) {
        this.windowId = windowId;
        this.windowElement = windowElement;
        
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('Settings Control initialized');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Theme selection
        const themeOptions = this.windowElement.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const themeId = option.dataset.theme;
                this.selectTheme(themeId);
            });
        });

        // Add hover effects
        themeOptions.forEach(option => {
            option.addEventListener('mouseenter', () => {
                option.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            option.addEventListener('mouseleave', () => {
                option.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    /**
     * Select a theme
     * @param {string} themeId - Theme identifier
     */
    selectTheme(themeId) {
        // Update visual selection
        this.updateThemeSelection(themeId);
        
        // Apply theme
        if (this.processor) {
            this.processor.handleThemeChange(themeId);
        }
    }

    /**
     * Update theme selection UI
     * @param {string} themeId - Selected theme identifier
     */
    updateThemeSelection(themeId) {
        // Remove active class from all options
        const themeOptions = this.windowElement.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to selected option
        const selectedOption = this.windowElement.querySelector(`[data-theme="${themeId}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
    }

    /**
     * Update the UI with settings data
     * @param {Object} data - Settings data
     */
    updateUI(data) {
        if (data.currentTheme) {
            this.updateThemeSelection(data.currentTheme.id);
        }
        
        // You can add more UI updates here as needed
        console.log('Settings UI updated with data:', data);
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     */
    showNotification(message) {
        // Remove existing notification
        const existingNotification = document.querySelector('.settings-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'notification settings-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error('Settings Error:', message);
        
        // Remove existing error
        const existingError = this.windowElement.querySelector('.settings-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'error settings-error';
        errorElement.textContent = message;
        
        // Insert at the top of settings section
        const settingsSection = this.windowElement.querySelector('.settings-section');
        if (settingsSection) {
            settingsSection.insertBefore(errorElement, settingsSection.firstChild);
        }
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }

    /**
     * Get control statistics
     * @returns {Object} Control statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            windowId: this.windowId
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        // Remove event listeners
        const themeOptions = this.windowElement?.querySelectorAll('.theme-option');
        if (themeOptions) {
            themeOptions.forEach(option => {
                option.replaceWith(option.cloneNode(true));
            });
        }
        
        // Remove notification if exists
        const notification = document.querySelector('.settings-notification');
        if (notification) {
            notification.remove();
        }
        
        this.isInitialized = false;
        console.log('Settings Control destroyed');
    }
}

// Export the settings control class
window.SettingsControl = SettingsControl; 