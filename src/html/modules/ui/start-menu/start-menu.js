/**
 * My Desktop - Start Menu
 * Handles start menu functionality and app launching
 */

class StartMenu {
    constructor() {
        this.startMenuElement = null;
        this.isOpen = false;
        this.eventBus = null;
        this.isInitialized = false;
        this.registeredApps = new Set(); // Track registered apps to prevent duplicates
        this.allApps = [];
    }

    /**
     * Initialize the start menu
     * @param {Object} dependencies - Required dependencies
     */
    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('StartMenu: EventBus not available');
            return false;
        }
        
        this.createStartMenu();
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('Start Menu initialized');
        return true;
    }

    /**
     * Create the start menu DOM structure
     */
    createStartMenu() {
        this.startMenuElement = document.createElement('div');
        this.startMenuElement.id = 'startMenu';
        this.startMenuElement.className = 'start-menu';
        this.startMenuElement.style.display = 'none';
        
        this.startMenuElement.innerHTML = `
            <div class="start-menu-header">
                <div class="user-profile">
                    <div class="user-avatar">👤</div>
                    <div class="user-name">User</div>
                </div>
                <div class="start-menu-search">
                    <input type="text" id="startMenuSearch" placeholder="Search apps..." autocomplete="off" />
                </div>
            </div>
            
            <div class="start-menu-content">
                <div class="app-list" id="startMenuApps">
                    <!-- App list will be populated dynamically -->
                </div>
            </div>

            <div class="start-menu-footer">
                <div class="power-button" id="powerButton">
                    <div class="power-icon">⏻</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.startMenuElement);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Listen for start menu toggle events
        this.eventBus.on('toggleStartMenu', () => {
            this.toggle();
        });

        // Close start menu when clicking outside (with delay to prevent immediate closing)
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.startMenuElement.contains(e.target)) {
                setTimeout(() => {
                    if (this.isOpen && !this.startMenuElement.contains(e.target)) {
                        this.close();
                    }
                }, 10);
            }
        });

        // Power button click
        const powerButton = this.startMenuElement.querySelector('#powerButton');
        if (powerButton) {
            powerButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handlePowerClick();
            });
        }

        // Listen for app registration events
        this.eventBus.on('registerApp', (data) => {
            this.allApps.push(data);
            this.renderAppList();
        });

        // Search bar logic
        const searchInput = this.startMenuElement.querySelector('#startMenuSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.renderAppList();
            });
        }
    }

    /**
     * Toggle start menu visibility
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Open the start menu
     */
    open() {
        if (this.isOpen) return;
        
        this.startMenuElement.style.display = 'block';
        this.isOpen = true;
        
        // Emit start menu opened event for animations
        if (this.eventBus) {
            this.eventBus.emit('startMenuOpened');
        }
        
        // Add animation
        this.startMenuElement.style.opacity = '0';
        this.startMenuElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.startMenuElement.style.transition = 'all 0.3s ease-out';
            this.startMenuElement.style.opacity = '1';
            this.startMenuElement.style.transform = 'translateY(0)';
        }, 10);
        
        console.log('Start menu opened');
    }

    /**
     * Close the start menu
     */
    close() {
        if (!this.isOpen) return;
        
        // Emit start menu closed event for animations
        if (this.eventBus) {
            this.eventBus.emit('startMenuClosed');
        }
        
        this.startMenuElement.style.transition = 'all 0.3s ease-out';
        this.startMenuElement.style.opacity = '0';
        this.startMenuElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.startMenuElement.style.display = 'none';
            this.isOpen = false;
        }, 300);
        
        console.log('Start menu closed');
    }

    /**
     * Render app list
     */
    renderAppList() {
        const appList = this.startMenuElement.querySelector('#startMenuApps');
        if (!appList) return;
        const searchInput = this.startMenuElement.querySelector('#startMenuSearch');
        const search = searchInput ? searchInput.value.trim().toLowerCase() : '';
        appList.innerHTML = '';
        this.registeredApps.clear();
        this.allApps.forEach(appData => {
            // Only add if display includes 'startmenu'
            if (!appData.display || (Array.isArray(appData.display) && !appData.display.includes('startmenu'))) {
                return;
            }
            // Filter by search
            if (search && !(appData.name && appData.name.toLowerCase().includes(search))) {
                return;
            }
            // Prevent duplicates
            if (this.registeredApps.has(appData.id)) return;
            const appElement = document.createElement('div');
            appElement.className = 'app-item';
            appElement.dataset.appId = appData.id;
            appElement.innerHTML = `
                <div class="app-icon">${appData.icon}</div>
                <div class="app-name">${appData.name}</div>
            `;
            appElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAppClick(appData);
            });
            appElement.addEventListener('mouseenter', () => {
                appElement.style.transform = 'scale(1.05)';
            });
            appElement.addEventListener('mouseleave', () => {
                appElement.style.transform = 'scale(1)';
            });
            appList.appendChild(appElement);
            this.registeredApps.add(appData.id);
        });
    }

    /**
     * Handle app click in start menu
     * @param {Object} appData - App data
     */
    handleAppClick(appData) {
        // Close start menu
        this.close();
        
        // Launch app
        if (appData.handler && typeof appData.handler === 'function') {
            appData.handler();
        }
        
        // Emit app launch event
        this.eventBus.emit('appLaunched', {
            appId: appData.id,
            appName: appData.name,
            timestamp: Date.now()
        });
    }

    /**
     * Handle power button click
     */
    handlePowerClick() {
        // Show power options
        this.showPowerOptions();
    }

    /**
     * Show power options
     */
    showPowerOptions() {
        const powerOptions = document.createElement('div');
        powerOptions.className = 'power-options';
        powerOptions.innerHTML = `
            <div class="power-option" data-action="sleep">Sleep</div>
            <div class="power-option" data-action="restart">Restart</div>
            <div class="power-option" data-action="shutdown">Shutdown</div>
        `;
        
        // Position near power button
        const powerButton = this.startMenuElement.querySelector('#powerButton');
        const rect = powerButton.getBoundingClientRect();
        
        powerOptions.style.position = 'fixed';
        powerOptions.style.top = `${rect.top - 120}px`;
        powerOptions.style.left = `${rect.left}px`;
        powerOptions.style.background = '#2d2d2d';
        powerOptions.style.color = 'white';
        powerOptions.style.padding = '8px 0';
        powerOptions.style.borderRadius = '4px';
        powerOptions.style.zIndex = '10000';
        powerOptions.style.fontSize = '14px';
        powerOptions.style.minWidth = '120px';
        
        // Add click handlers
        powerOptions.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                this.handlePowerAction(action);
                powerOptions.remove();
            }
        });
        
        document.body.appendChild(powerOptions);
        
        // Remove after 3 seconds or when clicking outside
        setTimeout(() => {
            if (powerOptions.parentNode) {
                powerOptions.remove();
            }
        }, 3000);
        
        document.addEventListener('click', function removePowerOptions(e) {
            if (!powerOptions.contains(e.target)) {
                powerOptions.remove();
                document.removeEventListener('click', removePowerOptions);
            }
        });
    }

    /**
     * Handle power action
     * @param {string} action - Power action
     */
    handlePowerAction(action) {
        console.log(`Power action: ${action}`);
        
        // Emit power action event
        this.eventBus.emit('powerAction', {
            action,
            timestamp: Date.now()
        });
        
        // Close start menu
        this.close();
    }

    /**
     * Get start menu statistics
     * @returns {Object} Start menu statistics
     */
    getStats() {
        const appList = this.startMenuElement.querySelector('#startMenuApps');
        const appCount = appList ? appList.children.length : 0;
        
        return {
            isOpen: this.isOpen,
            appCount,
            isInitialized: this.isInitialized
        };
    }

    /**
     * Remove an app from start menu
     * @param {string} appId - The app ID to remove
     */
    removeAppFromStartMenu(appId) {
        const appElement = this.startMenuElement.querySelector(`[data-app-id="${appId}"]`);
        if (appElement) {
            appElement.remove();
            this.registeredApps.delete(appId);
            console.log(`Start Menu: Removed app ${appId}`);
        }
    }

    /**
     * Clear all apps from start menu
     */
    clearAllApps() {
        const appList = this.startMenuElement.querySelector('#startMenuApps');
        if (appList) {
            appList.innerHTML = '';
            this.registeredApps.clear();
            console.log('Start Menu: Cleared all apps');
        }
    }

    /**
     * Get list of registered app IDs
     * @returns {Array} Array of registered app IDs
     */
    getRegisteredApps() {
        return Array.from(this.registeredApps);
    }

    /**
     * Cleanup resources
     */
    destroy() {
        if (this.startMenuElement) {
            this.startMenuElement.remove();
        }
        
        this.isInitialized = false;
        this.registeredApps.clear();
        console.log('Start Menu destroyed');
    }
}

// Export the start menu class
window.StartMenu = StartMenu; 