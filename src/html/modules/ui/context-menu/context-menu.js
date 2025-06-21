/**
 * My Desktop - Context Menu
 * Handles context menu functionality and theme switching
 */

class ContextMenu {
    constructor() {
        this.contextMenuElement = null;
        this.eventBus = null;
        this.themeManager = null;
        this.isInitialized = false;
    }

    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        this.themeManager = dependencies.themeManager || window.themeManager;
        
        if (!this.eventBus) {
            console.error('ContextMenu: EventBus not available');
            return false;
        }
        
        this.createContextMenu();
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('Context Menu initialized');
        return true;
    }

    createContextMenu() {
        this.contextMenuElement = document.createElement('div');
        this.contextMenuElement.id = 'contextMenu';
        this.contextMenuElement.className = 'context-menu';
        this.contextMenuElement.style.display = 'none';
        
        document.body.appendChild(this.contextMenuElement);
    }

    bindEvents() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e);
        });

        document.addEventListener('click', () => {
            this.hideContextMenu();
        });
    }

    showContextMenu(e) {
        const themes = this.getAvailableThemes();
        const currentTheme = this.getCurrentTheme();
        
        this.contextMenuElement.innerHTML = `
            <div class="context-item">View</div>
            <div class="context-item">Sort by</div>
            <div class="context-item">Refresh</div>
            <div class="context-separator"></div>
            <div class="context-item context-submenu" data-submenu="themes">
                Themes
                <span class="submenu-arrow">▶</span>
            </div>
            <div class="context-item">Display settings</div>
            <div class="context-item">About this project</div>
        `;

        // Add themes submenu
        const themesSubmenu = document.createElement('div');
        themesSubmenu.className = 'context-submenu-content';
        themesSubmenu.id = 'themes-submenu';
        themesSubmenu.style.display = 'none';
        
        themes.forEach(theme => {
            const themeItem = document.createElement('div');
            themeItem.className = 'context-item context-submenu-item';
            themeItem.dataset.themeId = theme.id;
            themeItem.innerHTML = `
                <span class="theme-name">${theme.name}</span>
                ${currentTheme && currentTheme.id === theme.id ? '<span class="theme-check">✓</span>' : ''}
            `;
            themesSubmenu.appendChild(themeItem);
        });

        this.contextMenuElement.appendChild(themesSubmenu);
        
        // Add event listeners for submenu
        this.setupSubmenuEvents();
        
        this.contextMenuElement.style.display = 'block';
        this.contextMenuElement.style.left = e.pageX + 'px';
        this.contextMenuElement.style.top = e.pageY + 'px';
    }

    setupSubmenuEvents() {
        // Handle submenu hover
        const themesSubmenuTrigger = this.contextMenuElement.querySelector('[data-submenu="themes"]');
        const themesSubmenu = this.contextMenuElement.querySelector('#themes-submenu');
        
        if (themesSubmenuTrigger && themesSubmenu) {
            themesSubmenuTrigger.addEventListener('mouseenter', () => {
                themesSubmenu.style.display = 'block';
            });
            
            themesSubmenuTrigger.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    if (!themesSubmenu.matches(':hover')) {
                        themesSubmenu.style.display = 'none';
                    }
                }, 100);
            });
            
            themesSubmenu.addEventListener('mouseleave', () => {
                themesSubmenu.style.display = 'none';
            });
        }

        // Handle theme selection
        const themeItems = this.contextMenuElement.querySelectorAll('.context-submenu-item');
        themeItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const themeId = item.dataset.themeId;
                this.selectTheme(themeId);
                this.hideContextMenu();
            });
        });
    }

    getAvailableThemes() {
        if (this.themeManager && typeof this.themeManager.getAllThemes === 'function') {
            return this.themeManager.getAllThemes();
        }
        return [];
    }

    getCurrentTheme() {
        if (this.themeManager && typeof this.themeManager.getCurrentTheme === 'function') {
            return this.themeManager.getCurrentTheme();
        }
        return null;
    }

    selectTheme(themeId) {
        if (this.themeManager && typeof this.themeManager.applyTheme === 'function') {
            this.themeManager.applyTheme(themeId);
        } else if (this.eventBus) {
            this.eventBus.emit('changeTheme', { themeId });
        }
    }

    hideContextMenu() {
        this.contextMenuElement.style.display = 'none';
    }

    destroy() {
        if (this.contextMenuElement) {
            this.contextMenuElement.remove();
        }
        this.isInitialized = false;
        console.log('Context Menu destroyed');
    }
}

window.ContextMenu = ContextMenu; 