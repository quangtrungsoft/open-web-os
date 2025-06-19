/**
 * WebOS - Context Menu
 * Handles context menu functionality
 */

class ContextMenu {
    constructor() {
        this.contextMenuElement = null;
        this.eventBus = null;
        this.isInitialized = false;
    }

    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
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
        this.contextMenuElement.innerHTML = `
            <div class="context-item">View</div>
            <div class="context-item">Sort by</div>
            <div class="context-item">Refresh</div>
            <div class="context-separator"></div>
            <div class="context-item">Display settings</div>
            <div class="context-item">Personalize</div>
        `;
        
        this.contextMenuElement.style.display = 'block';
        this.contextMenuElement.style.left = e.pageX + 'px';
        this.contextMenuElement.style.top = e.pageY + 'px';
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