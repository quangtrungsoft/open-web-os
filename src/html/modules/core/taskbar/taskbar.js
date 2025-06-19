/**
 * WebOS - Taskbar Module
 * Handles taskbar functionality and window management
 */

class Taskbar {
    constructor() {
        this.taskbarElement = null;
        this.startButton = null;
        this.taskbarItems = new Map();
        this.systemTray = null;
        this.eventBus = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the taskbar
     * @param {Object} dependencies - Required dependencies
     */
    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('Taskbar: EventBus not available');
            return false;
        }
        
        this.createTaskbar();
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('Taskbar initialized');
        return true;
    }

    /**
     * Create the taskbar DOM structure
     */
    createTaskbar() {
        // Create dock container
        this.taskbarElement = document.createElement('div');
        this.taskbarElement.id = 'dock';
        this.taskbarElement.className = 'dock dock-bottom'; // default position

        // Create dock items container
        const dockItems = document.createElement('div');
        dockItems.className = 'dock-items';

        // Create dock settings button
        this.dockSettingsBtn = document.createElement('button');
        this.dockSettingsBtn.className = 'dock-settings-btn';
        this.dockSettingsBtn.title = 'Dock Position';
        this.dockSettingsBtn.innerHTML = '⚙️';

        // Assemble dock
        this.taskbarElement.appendChild(dockItems);
        this.taskbarElement.appendChild(this.dockSettingsBtn);

        // Add to page
        document.body.appendChild(this.taskbarElement);

        // Load dock position from storage
        this.setDockPosition(this.getDockPosition());
    }

    getDockPosition() {
        return localStorage.getItem('webos_dock_position') || 'bottom';
    }

    setDockPosition(position) {
        // Remove all position classes
        this.taskbarElement.classList.remove('dock-bottom', 'dock-top', 'dock-left', 'dock-right');
        switch (position) {
            case 'top':
                this.taskbarElement.classList.add('dock-top');
                break;
            case 'left':
                this.taskbarElement.classList.add('dock-left');
                break;
            case 'right':
                this.taskbarElement.classList.add('dock-right');
                break;
            default:
                this.taskbarElement.classList.add('dock-bottom');
        }
        localStorage.setItem('webos_dock_position', position);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Dock settings button click
        this.dockSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showDockPositionMenu();
        });

        // Listen for window events
        this.eventBus.on('windowCreated', (data) => {
            this.addDockItem(data);
        });
        this.eventBus.on('windowClosed', (data) => {
            this.removeDockItem(data.id);
        });
        this.eventBus.on('windowMinimized', (data) => {
            this.updateDockItem(data.id, { minimized: true });
        });
        this.eventBus.on('windowRestored', (data) => {
            this.updateDockItem(data.id, { minimized: false });
        });
        this.eventBus.on('windowFocused', (data) => {
            this.updateDockItem(data.id, { focused: true });
        });
        this.eventBus.on('windowBlurred', (data) => {
            this.updateDockItem(data.id, { focused: false });
        });
    }

    showDockPositionMenu() {
        // Simple popup menu for dock position
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.zIndex = '99999';
        menu.style.background = 'rgba(30,30,40,0.97)';
        menu.style.color = '#fff';
        menu.style.borderRadius = '10px';
        menu.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
        menu.style.padding = '10px 0';
        menu.style.fontSize = '15px';
        menu.style.minWidth = '120px';
        menu.style.right = '32px';
        menu.style.bottom = '80px';
        menu.innerHTML = `
            <div style="padding: 8px 18px; cursor:pointer;" data-pos="bottom">Bottom</div>
            <div style="padding: 8px 18px; cursor:pointer;" data-pos="top">Top</div>
            <div style="padding: 8px 18px; cursor:pointer;" data-pos="left">Left</div>
            <div style="padding: 8px 18px; cursor:pointer;" data-pos="right">Right</div>
        `;
        document.body.appendChild(menu);
        menu.addEventListener('click', (e) => {
            const pos = e.target.dataset.pos;
            if (pos) {
                this.setDockPosition(pos);
                menu.remove();
            }
        });
        setTimeout(() => {
            document.addEventListener('click', function removeMenu(ev) {
                if (!menu.contains(ev.target)) {
                    menu.remove();
                    document.removeEventListener('click', removeMenu);
                }
            });
        }, 10);
    }

    addDockItem(windowData) {
        const { id, title, icon } = windowData;
        const dockItems = this.taskbarElement.querySelector('.dock-items');
        const dockItem = document.createElement('div');
        dockItem.className = 'dock-item';
        dockItem.dataset.windowId = id;
        dockItem.innerHTML = `
            <div class="dock-icon">${icon}</div>
            <div class="dock-label">${title}</div>
        `;
        dockItem.addEventListener('click', () => {
            this.handleDockItemClick(id);
        });
        dockItems.appendChild(dockItem);
        this.taskbarItems.set(id, {
            element: dockItem,
            data: windowData,
            minimized: false,
            focused: false
        });
    }

    removeDockItem(windowId) {
        const item = this.taskbarItems.get(windowId);
        if (item) {
            item.element.remove();
            this.taskbarItems.delete(windowId);
        }
    }

    updateDockItem(windowId, updates) {
        const item = this.taskbarItems.get(windowId);
        if (item) {
            Object.assign(item, updates);
            if (updates.minimized !== undefined) {
                item.element.classList.toggle('minimized', updates.minimized);
            }
            if (updates.focused !== undefined) {
                item.element.classList.toggle('active', updates.focused);
            }
        }
    }

    handleDockItemClick(windowId) {
        const item = this.taskbarItems.get(windowId);
        if (item) {
            if (item.minimized) {
                this.eventBus.emit('restoreWindow', { id: windowId });
            } else {
                this.eventBus.emit('focusWindow', { id: windowId });
            }
        }
    }

    /**
     * Get taskbar statistics
     * @returns {Object} Taskbar statistics
     */
    getStats() {
        return {
            totalItems: this.taskbarItems.size,
            minimizedWindows: Array.from(this.taskbarItems.values()).filter(item => item.minimized).length,
            focusedWindows: Array.from(this.taskbarItems.values()).filter(item => item.focused).length
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        if (this.taskbarElement) {
            this.taskbarElement.remove();
        }
        
        this.taskbarItems.clear();
        this.isInitialized = false;
        
        console.log('Taskbar destroyed');
    }
}

// Export the taskbar class
window.Taskbar = Taskbar; 