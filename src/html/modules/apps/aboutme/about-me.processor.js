/**
 * WebOS - About Me Processor
 * Handles the About Me application functionality
 */

class AboutMeProcessor {
    constructor() {
        this.eventBus = null;
        this.templateLoader = null;
        this.windowManager = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the About Me processor
     * @param {Object} dependencies - Required dependencies
     */
    init(dependencies = {}) {
        // Prevent duplicate initialization
        if (this.isInitialized) {
            console.log('AboutMeProcessor: Already initialized, skipping');
            return true;
        }
        
        this.eventBus = dependencies.eventBus || window.eventBus;
        this.templateLoader = dependencies.templateLoader || window.templateLoader;
        this.windowManager = dependencies.windowManager || window.windowManager;
        
        if (!this.eventBus || !this.templateLoader || !this.windowManager) {
            console.error('AboutMeProcessor: Required dependencies not available');
            return false;
        }
        
        this.bindEvents();
        this.registerApp();
        this.isInitialized = true;
        
        console.log('About Me Processor initialized');
        return true;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Listen for about me app launch requests
        this.eventBus.on('launchApp', (data) => {
            if (data.appName === 'aboutme') {
                this.launchAboutMe();
            }
        });
    }

    /**
     * Register the app with the system
     */
    registerApp() {
        if (this.eventBus) {
            this.eventBus.emit('registerApp', {
                id: 'aboutme',
                name: 'About Me',
                icon: '👤',
                handler: () => this.launchAboutMe(),
                display: ["desktop", "startmenu"]
            });
        }
    }

    /**
     * Launch the About Me application
     */
    async launchAboutMe() {
        try {
            // Load the about me template
            const template = await this.templateLoader.loadTemplate('apps/aboutme/about-me.html');
            
            if (!template) {
                console.error('Failed to load about me template');
                return;
            }
            
            // Create window configuration
            const windowConfig = {
                id: 'about-me-' + Date.now(),
                title: 'About Me',
                icon: '👤',
                content: template,
                width: 600,
                height: 500,
                resizable: true,
                centered: true,
                draggable: true,
                data: {
                    projects: [
                        'WebOS',
                        'E-commerce Platforms',
                        'Mobile Applications',
                        'Web Services & APIs',
                        'Desktop Applications'
                    ]
                }
            };
            
            // Create and show the window
            this.windowManager.createWindow(windowConfig);
            
            console.log('About Me application launched');
            
        } catch (error) {
            console.error('Failed to launch About Me:', error);
        }
    }

    /**
     * Get About Me processor statistics
     * @returns {Object} Processor statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            name: 'AboutMeProcessor'
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.isInitialized = false;
        console.log('About Me Processor destroyed');
    }
}

// Export the About Me processor class
window.AboutMeProcessor = AboutMeProcessor; 