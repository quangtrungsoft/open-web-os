/**
 * WebOS - Desktop Icons
 * Handles desktop icon management with drag and drop functionality
 */

class DesktopIcons {
    constructor() {
        this.desktopElement = null;
        this.eventBus = null;
        this.isInitialized = false;
        this.registeredApps = new Set(); // Track registered apps to prevent duplicates
        this.iconPositions = new Map(); // Store icon positions
        this.draggedIcon = null;
        this.dragOffset = { x: 0, y: 0 };
        this.isDragging = false;
    }

    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('DesktopIcons: EventBus not available');
            return false;
        }
        
        this.desktopElement = document.getElementById('desktop');
        this.loadIconPositions();
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('Desktop Icons initialized');
        return true;
    }

    bindEvents() {
        this.eventBus.on('registerApp', (data) => {
            this.addDesktopIcon(data);
        });

        // Desktop click to deselect icons
        if (this.desktopElement) {
            this.desktopElement.addEventListener('click', (e) => {
                if (e.target === this.desktopElement) {
                    this.deselectAllIcons();
                }
            });
        }
    }

    addDesktopIcon(appData) {
        if (!this.desktopElement) return;
        
        // Only add if display includes 'desktop'
        if (!appData.display || (Array.isArray(appData.display) && !appData.display.includes('desktop'))) {
            return;
        }
        
        // Check if app is already registered to prevent duplicates
        if (this.registeredApps.has(appData.id)) {
            console.log(`Desktop Icons: App ${appData.id} already registered, skipping duplicate`);
            return;
        }
        
        const iconElement = document.createElement('div');
        iconElement.className = 'desktop-icon';
        iconElement.dataset.appId = appData.id;
        iconElement.innerHTML = `
            <div class="icon-image">${appData.icon}</div>
            <div class="icon-label">${appData.name}</div>
        `;
        
        // Set initial position (either saved or default grid position)
        this.setIconPosition(iconElement, appData.id);
        
        // Add event listeners
        iconElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleIconClick(appData);
        });
        
        // Add drag functionality
        this.addDragListeners(iconElement, appData.id);
        
        this.desktopElement.appendChild(iconElement);
        
        // Mark app as registered
        this.registeredApps.add(appData.id);
        
        // Emit desktop icon added event for animations
        if (this.eventBus) {
            this.eventBus.emit('desktopIconAdded', {
                appId: appData.id,
                element: iconElement
            });
        }
        
        console.log(`Desktop Icons: Added icon for ${appData.name} (${appData.id})`);
    }

    setIconPosition(iconElement, appId) {
        const savedPosition = this.iconPositions.get(appId);
        
        if (savedPosition) {
            // Use saved position
            iconElement.style.left = `${savedPosition.x}px`;
            iconElement.style.top = `${savedPosition.y}px`;
        } else {
            // Calculate default grid position
            const gridSize = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--desktop-icon-size')) || 80;
            const spacing = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--desktop-icon-spacing')) || 20;
            
            const icons = this.desktopElement.querySelectorAll('.desktop-icon');
            const index = icons.length;
            const cols = Math.floor((window.innerWidth - 40) / (gridSize + spacing));
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            const x = 20 + col * (gridSize + spacing);
            const y = 20 + row * (gridSize + spacing);
            
            iconElement.style.left = `${x}px`;
            iconElement.style.top = `${y}px`;
            
            // Save default position
            this.iconPositions.set(appId, { x, y });
        }
    }

    addDragListeners(iconElement, appId) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        let dragStarted = false;
        const DRAG_THRESHOLD = 5; // px

        iconElement.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            dragStarted = false;
            this.draggedIcon = iconElement;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(iconElement.style.left) || 0;
            startTop = parseInt(iconElement.style.top) || 0;
            this.dragOffset.x = startX - startLeft;
            this.dragOffset.y = startY - startTop;
            // Don't add dragging class or set isDragging yet
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !this.draggedIcon) return;
            const moveX = e.clientX - startX;
            const moveY = e.clientY - startY;
            if (!dragStarted && (Math.abs(moveX) > DRAG_THRESHOLD || Math.abs(moveY) > DRAG_THRESHOLD)) {
                dragStarted = true;
                this.isDragging = true;
                this.draggedIcon.classList.add('dragging');
            }
            if (dragStarted) {
                e.preventDefault();
                const newX = e.clientX - this.dragOffset.x;
                const newY = e.clientY - this.dragOffset.y;
                const maxX = window.innerWidth - this.draggedIcon.offsetWidth;
                const maxY = window.innerHeight - this.draggedIcon.offsetHeight;
                const constrainedX = Math.max(0, Math.min(newX, maxX));
                const constrainedY = Math.max(0, Math.min(newY, maxY));
                this.draggedIcon.style.left = `${constrainedX}px`;
                this.draggedIcon.style.top = `${constrainedY}px`;
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging || !this.draggedIcon) return;
            isDragging = false;
            if (dragStarted) {
                this.isDragging = false;
                this.draggedIcon.classList.remove('dragging');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                const newX = parseInt(this.draggedIcon.style.left) || 0;
                const newY = parseInt(this.draggedIcon.style.top) || 0;
                this.iconPositions.set(appId, { x: newX, y: newY });
                this.saveIconPositions();
            } else {
                // Not a drag, just a click
                this.isDragging = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
            this.draggedIcon = null;
        });
    }

    handleIconClick(appData) {
        // Only block click if a drag actually occurred
        if (this.isDragging) {
            this.isDragging = false;
            return;
        }
        if (appData.handler && typeof appData.handler === 'function') {
            appData.handler();
        }
    }

    deselectAllIcons() {
        const icons = this.desktopElement.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            icon.classList.remove('selected');
        });
    }

    saveIconPositions() {
        try {
            const positions = {};
            this.iconPositions.forEach((position, appId) => {
                positions[appId] = position;
            });
            localStorage.setItem('mydesktop_desktop_icon_positions', JSON.stringify(positions));
        } catch (error) {
            console.error('Failed to save icon positions:', error);
        }
    }

    loadIconPositions() {
        try {
            const saved = localStorage.getItem('mydesktop_desktop_icon_positions');
            if (saved) {
                const positions = JSON.parse(saved);
                Object.entries(positions).forEach(([appId, position]) => {
                    this.iconPositions.set(appId, position);
                });
            }
        } catch (error) {
            console.error('Failed to load icon positions:', error);
        }
    }

    /**
     * Remove a desktop icon
     * @param {string} appId - The app ID to remove
     */
    removeDesktopIcon(appId) {
        if (!this.desktopElement) return;
        
        const iconElement = this.desktopElement.querySelector(`[data-app-id="${appId}"]`);
        if (iconElement) {
            iconElement.remove();
            this.registeredApps.delete(appId);
            this.iconPositions.delete(appId);
            this.saveIconPositions();
            console.log(`Desktop Icons: Removed icon for ${appId}`);
        }
    }

    /**
     * Clear all desktop icons
     */
    clearAllIcons() {
        if (!this.desktopElement) return;
        
        const icons = this.desktopElement.querySelectorAll('.desktop-icon');
        icons.forEach(icon => icon.remove());
        this.registeredApps.clear();
        this.iconPositions.clear();
        this.saveIconPositions();
        console.log('Desktop Icons: Cleared all icons');
    }

    /**
     * Reset icon positions to default grid
     */
    resetIconPositions() {
        this.iconPositions.clear();
        this.saveIconPositions();
        
        const icons = this.desktopElement.querySelectorAll('.desktop-icon');
        icons.forEach((icon, index) => {
            const appId = icon.dataset.appId;
            this.setIconPosition(icon, appId);
        });
        
        console.log('Desktop Icons: Reset icon positions');
    }

    /**
     * Get list of registered app IDs
     * @returns {Array} Array of registered app IDs
     */
    getRegisteredApps() {
        return Array.from(this.registeredApps);
    }

    /**
     * Get icon positions
     * @returns {Map} Map of app IDs to positions
     */
    getIconPositions() {
        return new Map(this.iconPositions);
    }

    destroy() {
        this.isInitialized = false;
        this.registeredApps.clear();
        this.iconPositions.clear();
        console.log('Desktop Icons destroyed');
    }
}

window.DesktopIcons = DesktopIcons; 