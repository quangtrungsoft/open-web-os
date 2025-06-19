/**
 * WebOS - Window Manager
 * Handles window creation, management, and lifecycle
 */

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.windowsContainer = null;
        this.eventBus = null;
        this.isInitialized = false;
        this.zIndexCounter = 1000;
    }

    /**
     * Initialize the window manager
     * @param {Object} dependencies - Required dependencies
     */
    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('WindowManager: EventBus not available');
            return false;
        }
        
        this.windowsContainer = document.getElementById('windowsContainer');
        if (!this.windowsContainer) {
            console.error('WindowManager: Windows container not found');
            return false;
        }
        
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('Window Manager initialized');
        return true;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Listen for window creation events
        this.eventBus.on('createWindow', (data) => {
            this.createWindow(data);
        });

        // Listen for window close events
        this.eventBus.on('closeWindow', (data) => {
            this.closeWindow(data.id);
        });

        // Listen for window focus events
        this.eventBus.on('focusWindow', (data) => {
            this.focusWindow(data.id);
        });

        // Listen for window minimize events
        this.eventBus.on('minimizeWindow', (data) => {
            this.minimizeWindow(data.id);
        });

        // Listen for window restore events
        this.eventBus.on('restoreWindow', (data) => {
            this.restoreWindow(data.id);
        });

        // Listen for window maximize events
        this.eventBus.on('maximizeWindow', (data) => {
            this.maximizeWindow(data.id);
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardShortcuts(e) {
        // Alt+Tab to cycle through windows
        if (e.altKey && e.key === 'Tab') {
            e.preventDefault();
            this.cycleThroughWindows();
        }
        
        // Escape to unfocus all windows
        if (e.key === 'Escape') {
            this.unfocusAllWindows();
        }
    }

    /**
     * Cycle through open windows
     */
    cycleThroughWindows() {
        const visibleWindows = Array.from(this.windows.entries())
            .filter(([id, windowData]) => !windowData.isMinimized)
            .map(([id]) => id);

        if (visibleWindows.length === 0) return;

        let nextWindowIndex = 0;
        
        if (this.activeWindow) {
            const currentIndex = visibleWindows.indexOf(this.activeWindow);
            nextWindowIndex = (currentIndex + 1) % visibleWindows.length;
        }

        const nextWindowId = visibleWindows[nextWindowIndex];
        this.focusWindow(nextWindowId);
    }

    /**
     * Create a new window
     * @param {Object} windowData - Window configuration data
     */
    createWindow(windowData) {
        const {
            id,
            title,
            icon,
            content,
            width = 600,
            height = 400,
            minWidth = 300,
            minHeight = 200,
            resizable = true,
            draggable = true,
            centered = true,
            onWindowCreated
        } = windowData;

        // Create window element
        const windowElement = document.createElement('div');
        windowElement.className = 'window';
        windowElement.id = id;
        windowElement.dataset.windowId = id;
        
        // Set window styles
        windowElement.style.width = `${width}px`;
        windowElement.style.height = `${height}px`;
        windowElement.style.minWidth = `${minWidth}px`;
        windowElement.style.minHeight = `${minHeight}px`;
        windowElement.style.zIndex = this.getNextZIndex();
        
        // Center window if requested
        if (centered) {
            this.centerWindow(windowElement, width, height);
        }

        // Create window HTML structure
        windowElement.innerHTML = `
            <div class="window-titlebar" style="cursor: ${draggable ? 'move' : 'default'}">
                <div class="window-title">${title}</div>
                <div class="window-controls">
                    <div class="window-control minimize" title="Minimize">─</div>
                    <div class="window-control maximize" title="Maximize">□</div>
                    <div class="window-control close" title="Close">×</div>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
            ${resizable ? '<div class="window-resize-handle"></div>' : ''}
        `;

        // Add window to container
        this.windowsContainer.appendChild(windowElement);

        // Store window data
        this.windows.set(id, {
            element: windowElement,
            data: windowData,
            isMinimized: false,
            isMaximized: false,
            originalPosition: null,
            originalSize: null
        });

        // Setup window controls
        this.setupWindowControls(id);

        // Setup dragging if enabled
        if (draggable) {
            this.setupWindowDragging(id);
        }

        // Setup resizing if enabled
        if (resizable) {
            this.setupWindowResizing(id);
        }

        // Focus the new window
        this.focusWindow(id);

        // Emit window created event with full window data
        this.eventBus.emit('windowCreated', { 
            id,
            title: windowData.title,
            icon: windowData.icon
        });

        // Call window created callback if provided
        if (onWindowCreated && typeof onWindowCreated === 'function') {
            onWindowCreated(windowElement);
        }

        console.log(`Window created: ${id}`);
    }

    /**
     * Center a window on screen
     * @param {HTMLElement} windowElement - Window element
     * @param {number} width - Window width
     * @param {number} height - Window height
     */
    centerWindow(windowElement, width, height) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Get taskbar height (default 40px if not available)
        const taskbarHeight = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--taskbar-height')) || 40;
        
        const left = Math.max(0, (screenWidth - width) / 2);
        const top = Math.max(0, (screenHeight - height - taskbarHeight) / 2);
        
        windowElement.style.left = `${left}px`;
        windowElement.style.top = `${top}px`;
    }

    /**
     * Setup window controls (minimize, maximize, close)
     * @param {string} windowId - Window ID
     */
    setupWindowControls(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        const { element } = windowData;

        // Add click handler to focus window when clicked
        element.addEventListener('click', (e) => {
            // Don't focus if clicking on controls
            if (e.target.closest('.window-control')) return;
            
            // Focus the window
            this.focusWindow(windowId);
        });

        // Minimize button
        const minimizeBtn = element.querySelector('.minimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent window focus
                this.minimizeWindow(windowId);
            });
        }

        // Maximize button
        const maximizeBtn = element.querySelector('.maximize');
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent window focus
                this.maximizeWindow(windowId);
            });
        }

        // Close button
        const closeBtn = element.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent window focus
                this.closeWindow(windowId);
            });
        }
    }

    /**
     * Setup window dragging
     * @param {string} windowId - Window ID
     */
    setupWindowDragging(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        const { element, data } = windowData;
        const titlebar = element.querySelector('.window-titlebar');

        if (!titlebar || !data.draggable) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-control')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(element.style.left) || 0;
            startTop = parseInt(element.style.top) || 0;

            element.style.cursor = 'move';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            element.style.left = `${startLeft + deltaX}px`;
            element.style.top = `${startTop + deltaY}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = '';
            }
        });
    }

    /**
     * Setup window resizing
     * @param {string} windowId - Window ID
     */
    setupWindowResizing(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        const { element, data } = windowData;
        const resizeHandle = element.querySelector('.window-resize-handle');

        if (!resizeHandle) return;

        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = element.offsetWidth;
            startHeight = element.offsetHeight;

            element.style.cursor = 'nw-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            const newWidth = Math.max(data.minWidth || 300, startWidth + deltaX);
            const newHeight = Math.max(data.minHeight || 200, startHeight + deltaY);

            element.style.width = `${newWidth}px`;
            element.style.height = `${newHeight}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                element.style.cursor = '';
            }
        });
    }

    /**
     * Focus a window
     * @param {string} windowId - Window ID
     */
    focusWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        // Remove focus from previous active window
        if (this.activeWindow && this.activeWindow !== windowId) {
            const prevWindowData = this.windows.get(this.activeWindow);
            if (prevWindowData) {
                prevWindowData.element.classList.remove('active');
            }
        }

        // Focus new window
        windowData.element.classList.add('active');
        windowData.element.style.zIndex = this.getNextZIndex();
        this.activeWindow = windowId;

        // Emit window focused event
        this.eventBus.emit('windowFocused', { id: windowId });
    }

    /**
     * Unfocus all windows
     */
    unfocusAllWindows() {
        // Remove focus from current active window
        if (this.activeWindow) {
            const activeWindowData = this.windows.get(this.activeWindow);
            if (activeWindowData) {
                activeWindowData.element.classList.remove('active');
            }
            this.activeWindow = null;
        }

        // Remove active class from all windows
        this.windows.forEach((windowData) => {
            windowData.element.classList.remove('active');
        });
    }

    /**
     * Minimize a window
     * @param {string} windowId - Window ID
     */
    minimizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        windowData.element.style.display = 'none';
        windowData.isMinimized = true;

        // Emit window minimized event
        this.eventBus.emit('windowMinimized', { id: windowId });
    }

    /**
     * Restore a window
     * @param {string} windowId - Window ID
     */
    restoreWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        windowData.element.style.display = 'block';
        windowData.isMinimized = false;

        // Focus the restored window
        this.focusWindow(windowId);

        // Emit window restored event
        this.eventBus.emit('windowRestored', { id: windowId });
    }

    /**
     * Maximize a window
     * @param {string} windowId - Window ID
     */
    maximizeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        if (windowData.isMaximized) {
            // Restore window
            windowData.element.style.width = windowData.originalSize.width;
            windowData.element.style.height = windowData.originalSize.height;
            windowData.element.style.left = windowData.originalPosition.left;
            windowData.element.style.top = windowData.originalPosition.top;
            windowData.isMaximized = false;
        } else {
            // Save original size and position
            windowData.originalSize = {
                width: windowData.element.style.width,
                height: windowData.element.style.height
            };
            windowData.originalPosition = {
                left: windowData.element.style.left,
                top: windowData.element.style.top
            };

            // Get taskbar height (default 40px if not available)
            const taskbarHeight = getComputedStyle(document.documentElement)
                .getPropertyValue('--taskbar-height') || '40px';

            // Maximize window (accounting for taskbar)
            windowData.element.style.width = '100%';
            windowData.element.style.height = `calc(100% - ${taskbarHeight})`;
            windowData.element.style.left = '0';
            windowData.element.style.top = '0';
            windowData.isMaximized = true;
        }

        // Focus the window
        this.focusWindow(windowId);
    }

    /**
     * Close a window
     * @param {string} windowId - Window ID
     */
    closeWindow(windowId) {
        const windowData = this.windows.get(windowId);
        if (!windowData) return;

        // Remove window element
        windowData.element.remove();

        // Remove from windows map
        this.windows.delete(windowId);

        // Clear active window if it was this window
        if (this.activeWindow === windowId) {
            this.activeWindow = null;
        }

        // Emit window closed event
        this.eventBus.emit('windowClosed', { id: windowId });

        console.log(`Window closed: ${windowId}`);
    }

    /**
     * Get next z-index value
     * @returns {number} Next z-index value
     */
    getNextZIndex() {
        return ++this.zIndexCounter;
    }

    /**
     * Get window data
     * @param {string} windowId - Window ID
     * @returns {Object|null} Window data or null
     */
    getWindow(windowId) {
        return this.windows.get(windowId) || null;
    }

    /**
     * Get all windows
     * @returns {Map} Map of all windows
     */
    getAllWindows() {
        return new Map(this.windows);
    }

    /**
     * Get active window
     * @returns {string|null} Active window ID or null
     */
    getActiveWindow() {
        return this.activeWindow;
    }

    /**
     * Get window manager statistics
     * @returns {Object} Window manager statistics
     */
    getStats() {
        return {
            totalWindows: this.windows.size,
            activeWindow: this.activeWindow,
            minimizedWindows: Array.from(this.windows.values()).filter(w => w.isMinimized).length,
            maximizedWindows: Array.from(this.windows.values()).filter(w => w.isMaximized).length
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        // Close all windows
        for (const [windowId] of this.windows) {
            this.closeWindow(windowId);
        }

        this.windows.clear();
        this.activeWindow = null;
        this.isInitialized = false;

        console.log('Window Manager destroyed');
    }
}

// Export the window manager class
window.WindowManager = WindowManager; 