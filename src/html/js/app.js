/**
 * My Desktop - Main Application
 * Initializes and manages the My Desktop environment
 */

class MyDesktopApp {
    constructor() {
        this.moduleLoader = null;
        this.isInitialized = false;
        this.loadingScreen = null;
        this.desktop = null;
        
        // Loading screen configuration
        this.loadingDelay = this.loadDelayFromStorage(); // Load from localStorage
        this.minLoadingTime = 1000; // Minimum loading time to show progress
    }

    /**
     * Load delay setting from localStorage
     * @returns {number} Delay in milliseconds (default: 2000)
     */
    loadDelayFromStorage() {
        try {
            const savedDelay = localStorage.getItem('mydesktop_loading_delay');
            if (savedDelay !== null) {
                const delay = parseInt(savedDelay);
                if (!isNaN(delay) && delay >= 0 && delay <= 5000) {
                    console.log(`Loaded loading delay from storage: ${delay}ms`);
                    return delay;
                }
            }
        } catch (error) {
            console.warn('Failed to load delay from localStorage:', error);
        }
        return 2000; // Default 2 seconds
    }

    /**
     * Save delay setting to localStorage
     * @param {number} delay - Delay in milliseconds
     */
    saveDelayToStorage(delay) {
        try {
            localStorage.setItem('mydesktop_loading_delay', delay.toString());
            console.log(`Saved loading delay to storage: ${delay}ms`);
        } catch (error) {
            console.warn('Failed to save delay to localStorage:', error);
        }
    }

    /**
     * Set loading screen delay
     * @param {number} delay - Delay in milliseconds (0-5000)
     */
    setLoadingDelay(delay) {
        // Clamp delay between 0 and 5000ms (0-5 seconds)
        this.loadingDelay = Math.max(0, Math.min(5000, delay));
        console.log(`Loading delay set to ${this.loadingDelay}ms (${this.loadingDelay / 1000}s)`);
        
        // Save to localStorage
        this.saveDelayToStorage(this.loadingDelay);
    }

    /**
     * Get current loading delay
     * @returns {number} Current delay in milliseconds
     */
    getLoadingDelay() {
        return this.loadingDelay;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing My Desktop...');
            
            // Get loading screen elements
            this.loadingScreen = document.getElementById('loadingScreen');
            this.desktop = document.getElementById('desktop');
            
            if (!this.loadingScreen) {
                console.error('Loading screen not found');
                return;
            }
            
            if (!this.desktop) {
                console.error('Desktop element not found');
                return;
            }
            
            // Show loading screen with custom delay
            await this.showLoadingScreen();
            
            // Initialize module loader
            this.moduleLoader = new ModuleLoader();
            this.moduleLoader.init();
            
            // Load all modules
            await this.moduleLoader.initializeModules();
            
            // Ensure minimum loading time
            const elapsedTime = Date.now() - this.loadStartTime;
            const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);
            
            if (remainingTime > 0) {
                console.log(`Waiting ${remainingTime}ms to complete minimum loading time...`);
                await this.delay(remainingTime);
            }
            
            // Show desktop
            this.showDesktop();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Ensure desktop is interactive
            this.ensureDesktopInteractivity();
            
            this.isInitialized = true;
            console.log('My Desktop initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize My Desktop:', error);
            this.showError('Failed to initialize application');
        }
    }

    /**
     * Show loading screen with custom delay
     */
    async showLoadingScreen() {
        this.loadStartTime = Date.now();
        
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'block';
            this.loadingScreen.style.opacity = '1';
            
            // Update loading message
            const progressText = document.getElementById('progressText');
            if (progressText) {
                progressText.textContent = `Loading... (${this.loadingDelay / 1000}s delay)`;
            }
            
            console.log(`Showing loading screen for ${this.loadingDelay}ms...`);
            
            // Apply custom delay
            if (this.loadingDelay > 0) {
                await this.delay(this.loadingDelay);
            }
        }
    }

    /**
     * Utility function to create a delay
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after the delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Show the desktop
     */
    showDesktop() {
        console.log('Showing desktop...');
        if (this.desktop) {
            this.desktop.style.display = 'block';
            console.log('Desktop display set to block');
            
            // Check if desktop is visible and interactive
            const rect = this.desktop.getBoundingClientRect();
            console.log('Desktop bounds:', rect);
            console.log('Desktop computed style:', {
                display: getComputedStyle(this.desktop).display,
                visibility: getComputedStyle(this.desktop).visibility,
                pointerEvents: getComputedStyle(this.desktop).pointerEvents,
                zIndex: getComputedStyle(this.desktop).zIndex
            });
        } else {
            console.error('Desktop element not found');
        }
    }

    /**
     * Hide the loading screen
     */
    hideLoadingScreen() {
        console.log('Hiding loading screen...');
        if (this.loadingScreen) {
            // Add hidden class for robust hiding
            this.loadingScreen.classList.add('hidden');
            
            // Also set styles directly for immediate effect
            this.loadingScreen.style.opacity = '0';
            this.loadingScreen.style.pointerEvents = 'none';
            this.loadingScreen.style.visibility = 'hidden';
            this.loadingScreen.style.zIndex = '-1';
            
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                console.log('Loading screen hidden completely');
                
                // Check if loading screen is still blocking
                const rect = this.loadingScreen.getBoundingClientRect();
                console.log('Loading screen bounds after hide:', rect);
                console.log('Loading screen computed style after hide:', {
                    display: getComputedStyle(this.loadingScreen).display,
                    visibility: getComputedStyle(this.loadingScreen).visibility,
                    pointerEvents: getComputedStyle(this.loadingScreen).pointerEvents,
                    zIndex: getComputedStyle(this.loadingScreen).zIndex
                });
            }, 100); // Reduced timeout for faster hiding
        } else {
            console.error('Loading screen element not found');
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error('Application Error:', message);
        
        if (this.loadingScreen) {
            const progressText = document.getElementById('progressText');
            if (progressText) {
                progressText.textContent = `Error: ${message}`;
                progressText.style.color = '#ff6b6b';
            }
        }
    }

    /**
     * Get application statistics
     */
    getStats() {
        return {
            version: '1.0.0',
            modules: this.moduleLoader ? this.moduleLoader.getAllModules().size : 0,
            loadingDelay: this.loadingDelay,
            timestamp: Date.now()
        };
    }

    /**
     * Ensure desktop is interactive
     */
    ensureDesktopInteractivity() {
        console.log('Ensuring desktop is interactive...');
        
        // Check if desktop is visible and interactive
        const desktop = document.getElementById('desktop');
        if (desktop) {
            // Ensure desktop is properly displayed
            desktop.style.display = 'block';
            desktop.style.visibility = 'visible';
            desktop.style.pointerEvents = 'auto';
            desktop.style.zIndex = '1';
            
            console.log('Desktop is visible and interactive');
            
            // Ensure desktop is interactive
            const rect = desktop.getBoundingClientRect();
            console.log('Desktop bounds:', rect);
            console.log('Desktop computed style:', {
                display: getComputedStyle(desktop).display,
                visibility: getComputedStyle(desktop).visibility,
                pointerEvents: getComputedStyle(desktop).pointerEvents,
                zIndex: getComputedStyle(desktop).zIndex
            });
        } else {
            console.error('Desktop element not found');
        }
        
        // Check for and remove any blocking elements
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            // Force hide loading screen completely
            loadingScreen.style.display = 'none';
            loadingScreen.style.visibility = 'hidden';
            loadingScreen.style.pointerEvents = 'none';
            loadingScreen.style.opacity = '0';
            loadingScreen.style.zIndex = '-1';
            loadingScreen.classList.add('hidden');
            
            console.log('Loading screen forcefully hidden');
        }
        
        // Check for any other high z-index elements that might be blocking
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const style = getComputedStyle(element);
            const zIndex = parseInt(style.zIndex);
            
            // If element has very high z-index and covers the screen, check if it should be blocking
            if (zIndex > 5000 && element !== loadingScreen) {
                const rect = element.getBoundingClientRect();
                if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.8) {
                    console.warn(`Found potentially blocking element: ${element.tagName}.${element.className}#${element.id} with z-index ${zIndex}`);
                    
                    // If it's not supposed to be blocking, remove it
                    if (element.classList.contains('loading-screen') || element.id === 'loadingScreen') {
                        element.style.display = 'none';
                        element.style.visibility = 'hidden';
                        element.style.pointerEvents = 'none';
                        console.log('Removed blocking loading screen element');
                    }
                }
            }
        });
        
        // Test desktop click functionality
        if (desktop) {
            // Add a test click handler
            const testClickHandler = (e) => {
                console.log('Desktop click test successful!', e);
                desktop.removeEventListener('click', testClickHandler);
            };
            
            desktop.addEventListener('click', testClickHandler);
            
            // Simulate a test click
            setTimeout(() => {
                const testEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: 100,
                    clientY: 100
                });
                desktop.dispatchEvent(testEvent);
            }, 100);
        }
        
        console.log('Desktop interactivity check complete');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting My Desktop...');
    
    // Create and initialize the application
    window.myDesktopApp = new MyDesktopApp();
    window.myDesktopApp.init();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Re-center any centered windows
    if (window.windowManager) {
        const windows = window.windowManager.getAllWindows();
        for (const [windowId, windowData] of windows) {
            if (windowData.data.centered) {
                window.windowManager.centerWindow(
                    windowData.element,
                    windowData.element.offsetWidth,
                    windowData.element.offsetHeight
                );
            }
        }
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Handle beforeunload
window.addEventListener('beforeunload', () => {
    console.log('Application shutting down...');
    
    // Cleanup modules
    if (window.myDesktopApp && window.myDesktopApp.moduleLoader) {
        const modules = window.myDesktopApp.moduleLoader.getAllModules();
        for (const [moduleName, module] of modules) {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        }
    }
});

// Export the main app class
window.MyDesktopApp = MyDesktopApp; 