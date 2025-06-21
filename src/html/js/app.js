/**
 * My Desktop - Main Application
 * Initializes and manages the My Desktop environment
 */

class MyDesktopApp {
    constructor() {
        this.isInitialized = false;
        this.modules = new Map();
        this.eventBus = null;
        this.moduleLoader = null;
        this.themeManager = null;
        this.windowManager = null;
        this.taskbar = null;
        this.startMenu = null;
        this.desktopIcons = null;
        this.animations = null;
        this.dragAndDrop = null;
        this.localStorage = null;
        this.search = null;
        this.resizing = null;
        this.contextMenu = null;
        this.notifications = null;
        
        // Loading delay functionality
        this.loadingDelay = 2000; // Default 2 seconds
        const savedDelay = localStorage.getItem('mydesktop_loading_delay');
        if (savedDelay) {
            this.loadingDelay = parseInt(savedDelay);
        }
        
        // Bind methods
        this.init = this.init.bind(this);
        this.setLoadingDelay = this.setLoadingDelay.bind(this);
        this.restart = this.restart.bind(this);
    }

    /**
     * Set loading delay
     * @param {number} delay - Delay in milliseconds
     */
    setLoadingDelay(delay) {
        this.loadingDelay = delay;
        localStorage.setItem('mydesktop_loading_delay', delay.toString());
        
        // Update UI
        const currentDelayElement = document.getElementById('currentDelay');
        if (currentDelayElement) {
            currentDelayElement.textContent = `${delay / 1000}s`;
        }
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing My Desktop...');
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Wait for loading delay
            await this.wait(this.loadingDelay);
            
            // Initialize core modules
            await this.initializeCoreModules();
            
            // Initialize UI modules
            await this.initializeUIModules();
            
            // Initialize features
            await this.initializeFeatures();
            
            // Initialize apps
            await this.initializeApps();
            
            // Hide loading screen and show desktop
            this.hideLoadingScreen();
            
            console.log('My Desktop initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize My Desktop:', error);
            this.showError('Failed to initialize My Desktop');
        }
    }

    /**
     * Restart the application
     */
    restart() {
        console.log(`Restarting My Desktop with ${this.loadingDelay}ms loading delay...`);
        
        // Confirm restart
        if (confirm(`Restart My Desktop with ${this.loadingDelay / 1000}s loading delay?`)) {
            location.reload();
        }
    }

    /**
     * Wait for specified milliseconds
     * @param {number} ms - Milliseconds to wait
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const desktop = document.getElementById('desktop');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
        
        if (desktop) {
            desktop.style.display = 'none';
        }
        
        // Start progress animation
        this.startProgressAnimation();
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const desktop = document.getElementById('desktop');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        if (desktop) {
            desktop.style.display = 'block';
            
            // Show welcome message
            this.showWelcomeMessage();
        }
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            // Fade out after 4 seconds
            setTimeout(() => {
                welcomeMessage.classList.add('fade-out');
                // Remove from DOM after animation
                setTimeout(() => {
                    welcomeMessage.remove();
                }, 500);
            }, 4000);
        }
        
        // Initialize dashboard
        this.initDashboard();
    }

    /**
     * Initialize dashboard widget
     */
    initDashboard() {
        this.updateDashboard();
        
        // Update time every second
        setInterval(() => {
            this.updateDashboard();
        }, 1000);
    }

    /**
     * Update dashboard with current time and date
     */
    updateDashboard() {
        const now = new Date();
        
        // Update time
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
        
        // Update date
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    /**
     * Start progress animation
     */
    startProgressAnimation() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (!progressFill || !progressText) return;
        
        const steps = [
            { progress: 20, text: 'Loading modules...' },
            { progress: 40, text: 'Initializing desktop...' },
            { progress: 60, text: 'Setting up themes...' },
            { progress: 80, text: 'Preparing applications...' },
            { progress: 100, text: 'Ready!' }
        ];
        
        let currentStep = 0;
        
        const animate = () => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                progressFill.style.width = `${step.progress}%`;
                progressText.textContent = step.text;
                currentStep++;
                
                setTimeout(animate, this.loadingDelay / steps.length);
            }
        };
        
        animate();
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        const loadingText = document.getElementById('loadingText');
        if (loadingText) {
            loadingText.textContent = 'Error';
            loadingText.style.color = '#ff6b6b';
        }
        
        const progressText = document.getElementById('progressText');
        if (progressText) {
            progressText.textContent = message;
            progressText.style.color = '#ff6b6b';
        }
    }

    /**
     * Get loading delay
     * @returns {number} Loading delay in milliseconds
     */
    getLoadingDelay() {
        return this.loadingDelay;
    }

    /**
     * Get all modules
     * @returns {Map} Map of all modules
     */
    getAllModules() {
        return this.modules;
    }

    /**
     * Cleanup resources
     */
    destroy() {
        // Cleanup all modules
        for (const [name, module] of this.modules) {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        }
        
        this.modules.clear();
        this.isInitialized = false;
        
        console.log('My Desktop destroyed');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting My Desktop...');
    
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