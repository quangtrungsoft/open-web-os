// Dock Settings Processor for system window
class DockSettingsProcessor {
    constructor() {
        this.appId = 'docksettings';
        this.appName = 'Dock Settings';
        this.appIcon = '⚓';
        this.windowId = null;
        this.control = null;
        this.templateLoader = window.templateLoader;
        this.eventBus = window.eventBus;
        this.isInitialized = false;
    }

    open() {
        // Check if a dock settings window is already open using window manager
        if (window.windowManager) {
            const allWindows = window.windowManager.getAllWindows();
            for (const [windowId, windowData] of allWindows) {
                if (windowData.data.title === this.appName) {
                    // If window is minimized, restore it first
                    if (windowData.isMinimized) {
                        window.windowManager.restoreWindow(windowId);
                    }
                    // Focus the existing window instead of creating a new one
                    window.windowManager.focusWindow(windowId);
                    return;
                }
            }
        }

        if (!this.templateLoader || !this.eventBus) return;
        
        const windowId = `window-${this.appId}-${Date.now()}`;
        this.windowId = windowId;
        
        this.templateLoader.loadTemplate('core/taskbar/dock-settings.html').then(windowContent => {
            this.eventBus.emit('createWindow', {
                id: windowId,
                title: this.appName,
                icon: this.appIcon,
                content: windowContent,
                width: 480,
                height: 420,
                minWidth: 400,
                minHeight: 320,
                resizable: true,
                draggable: true,
                centered: true,
                onWindowCreated: (windowElement) => this.onWindowCreated(windowElement)
            });
        });
    }

    onWindowCreated(windowElement) {
        this.control = new DockSettingsControl(this);
        this.control.init(this.windowId, windowElement);
        // Listen for window close
        this.eventBus.on('windowClosed', (data) => {
            if (data.id === this.windowId) {
                this.onWindowClosed();
            }
        });
    }

    onWindowClosed() {
        if (this.control) {
            this.control.destroy();
            this.control = null;
        }
        this.windowId = null;
    }
}

class DockSettingsControl {
    constructor(processor) {
        this.processor = processor;
        this.windowElement = null;
        this.windowId = null;
        this.isInitialized = false;
        this.allApps = [];
        this.pinnedApps = [];
    }

    init(windowId, windowElement) {
        this.windowId = windowId;
        this.windowElement = windowElement;
        this.loadDockSettings();
        this.bindEvents();
        this.isInitialized = true;
    }

    loadDockSettings() {
        // Load dock position
        const currentPosition = localStorage.getItem('webos_dock_position') || 'bottom';
        const radios = this.windowElement.querySelectorAll('input[name="dockPosition"]');
        radios.forEach(r => r.checked = (r.value === currentPosition));
        // Load pinned apps
        this.pinnedApps = JSON.parse(localStorage.getItem('webos_dock_pinned_apps') || '[]');
        // Load all apps from module loader
        this.allApps = [];
        if (window.moduleLoader && typeof window.moduleLoader.getAllModules === 'function') {
            const modules = window.moduleLoader.getAllModules();
            modules.forEach((mod, name) => {
                if (mod && mod.appId && mod.appName && mod.appIcon) {
                    this.allApps.push({
                        id: mod.appId,
                        name: mod.appName,
                        icon: mod.appIcon
                    });
                }
            });
        }
        this.renderAppsList();
    }

    renderAppsList() {
        const list = this.windowElement.querySelector('.dock-apps-list');
        if (!list) return;
        list.innerHTML = '';
        if (this.allApps.length === 0) {
            const empty = document.createElement('div');
            empty.style.color = '#aaa';
            empty.style.fontSize = '0.95em';
            empty.textContent = 'No apps available to pin.';
            list.appendChild(empty);
            return;
        }
        this.allApps.forEach(app => {
            const row = document.createElement('div');
            row.className = 'dock-app-row';
            row.innerHTML = `
                <label>
                    <input type="checkbox" class="dock-app-pin" data-app-id="${app.id}" ${this.pinnedApps.includes(app.id) ? 'checked' : ''}>
                    <span class="dock-app-icon">${app.icon}</span>
                    <span class="dock-app-name">${app.name}</span>
                </label>
            `;
            list.appendChild(row);
        });
    }

    bindEvents() {
        // Dock position change
        const radios = this.windowElement.querySelectorAll('input[name="dockPosition"]');
        radios.forEach(r => {
            r.addEventListener('change', () => this.saveDockSettings());
        });
        // Pin/unpin app
        this.windowElement.addEventListener('change', (e) => {
            if (e.target.classList.contains('dock-app-pin')) {
                this.saveDockSettings();
            }
        });
    }

    saveDockSettings() {
        // Save dock position
        const selected = this.windowElement.querySelector('input[name="dockPosition"]:checked');
        if (selected) {
            localStorage.setItem('webos_dock_position', selected.value);
            if (window.taskbar && typeof window.taskbar.setDockPosition === 'function') {
                window.taskbar.setDockPosition(selected.value);
            }
        }
        // Save pinned apps
        const checked = Array.from(this.windowElement.querySelectorAll('.dock-app-pin:checked')).map(cb => cb.dataset.appId);
        localStorage.setItem('webos_dock_pinned_apps', JSON.stringify(checked));
        // Emit event to update dock
        if (window.taskbar && typeof window.taskbar.refreshDockItems === 'function') {
            window.taskbar.refreshDockItems();
        }
    }

    destroy() {
        // No-op for now (could remove listeners if needed)
        this.isInitialized = false;
    }
}

// Register processor globally
window.DockSettingsProcessor = DockSettingsProcessor; 