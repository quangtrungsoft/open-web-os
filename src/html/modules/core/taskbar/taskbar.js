/**
 * My Desktop - Taskbar Module
 * Handles taskbar functionality and dock management
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
        this.refreshDockItems();
        
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
        this.dockSettingsBtn.title = 'Dock Settings';
        this.dockSettingsBtn.innerHTML = '⚙️';

        // Assemble dock
        this.taskbarElement.appendChild(dockItems);
        this.taskbarElement.appendChild(this.dockSettingsBtn);

        // Add to page
        document.body.appendChild(this.taskbarElement);

        // Inject dock settings modal HTML if not present
        if (!document.getElementById('dockSettingsModal')) {
            fetch('modules/core/taskbar/dock-settings.html')
                .then(r => r.text())
                .then(html => {
                    const div = document.createElement('div');
                    div.innerHTML = html;
                    document.body.appendChild(div.firstElementChild);
                });
        }
        // Load dock-settings.js if not present
        if (!window.openDockSettings) {
            const script = document.createElement('script');
            script.src = 'modules/core/taskbar/dock-settings.js';
            document.body.appendChild(script);
        }

        // Load dock position from storage
        this.setDockPosition(this.getDockPosition());
    }

    getDockPosition() {
        return localStorage.getItem('mydesktop_dock_position') || 'bottom';
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
        localStorage.setItem('mydesktop_dock_position', position);
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Dock settings button click
        this.dockSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.DockSettingsProcessor) {
                const dockSettings = new window.DockSettingsProcessor();
                dockSettings.open();
            } else {
                this.showDockPositionMenu();
            }
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

    refreshDockItems() {
        // Always show pinned apps, and running apps
        const dockItems = this.taskbarElement.querySelector('.dock-items');
        if (!dockItems) return;
        dockItems.innerHTML = '';
        // Load pinned apps from localStorage
        let pinned = [];
        try {
            pinned = JSON.parse(localStorage.getItem('mydesktop_dock_pinned_apps') || '[]');
        } catch {}
        // Get all available apps from moduleLoader
        let allApps = [];
        if (window.moduleLoader && typeof window.moduleLoader.getAllModules === 'function') {
            const modules = window.moduleLoader.getAllModules();
            modules.forEach((mod, name) => {
                if (mod && mod.appId && mod.appName && mod.appIcon) {
                    allApps.push({
                        id: mod.appId,
                        name: mod.appName,
                        icon: mod.appIcon
                    });
                }
            });
        }
        // Render pinned apps first
        pinned.forEach(appId => {
            const app = allApps.find(a => a.id === appId);
            if (app) {
                const dockItem = document.createElement('div');
                dockItem.className = 'dock-item dock-pinned';
                dockItem.dataset.appId = app.id;
                dockItem.innerHTML = `
                    <div class="dock-icon">${app.icon}</div>
                    <div class="dock-label">${app.name}</div>
                `;
                dockItem.addEventListener('click', () => {
                    // Open app if not running, else focus
                    if (window.moduleLoader && typeof window.moduleLoader.getModule === 'function') {
                        const mod = window.moduleLoader.getModule(app.id.charAt(0).toUpperCase() + app.id.slice(1) + 'Processor');
                        if (mod && typeof mod.open === 'function') {
                            mod.open();
                        }
                    }
                });
                dockItems.appendChild(dockItem);
            }
        });
        // Render running windows (avoid duplicates)
        this.taskbarItems.forEach((item, winId) => {
            const { data } = item;
            // If already rendered as pinned, skip
            if (pinned.includes(data.appId)) return;
            const dockItem = document.createElement('div');
            dockItem.className = 'dock-item';
            dockItem.dataset.windowId = winId;
            dockItem.innerHTML = `
                <div class="dock-icon">${data.icon}</div>
                <div class="dock-label">${data.title}</div>
            `;
            dockItem.addEventListener('click', () => {
                this.handleDockItemClick(winId);
            });
            dockItems.appendChild(dockItem);
        });
    }

    addDockItem(windowData) {
        const { id } = windowData;
        this.taskbarItems.set(id, {
            element: null,
            data: windowData,
            minimized: false,
            focused: false
        });
        this.refreshDockItems();
    }

    removeDockItem(windowId) {
        this.taskbarItems.delete(windowId);
        this.refreshDockItems();
    }

    updateDockItem(windowId, updates) {
        const item = this.taskbarItems.get(windowId);
        if (item) {
            Object.assign(item, updates);
            if (item.element) {
                if (updates.minimized !== undefined) {
                    item.element.classList.toggle('minimized', updates.minimized);
                }
                if (updates.focused !== undefined) {
                    item.element.classList.toggle('active', updates.focused);
                }
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