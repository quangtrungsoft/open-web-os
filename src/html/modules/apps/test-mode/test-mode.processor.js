class TestModeProcessor {
    constructor() {
        this.appId = 'test-mode';
        this.appName = 'Test Mode';
        this.appIcon = '⚙️';
        this.windowId = null;
        this.control = null;
        this.templateLoader = null;
        this.eventBus = null;
        this.themeManager = null;
        this.isInitialized = false;
    }

    init(dependencies = {}) {
        this.templateLoader = dependencies.templateLoader || window.templateLoader;
        this.eventBus = dependencies.eventBus || window.eventBus;
        this.themeManager = dependencies.themeManager || window.themeManager;

        this.registerApp();
        this.isInitialized = true;
        console.log('Test Mode Processor initialized');
        return true;
    }

    registerApp() {
        if (this.eventBus) {
            this.eventBus.emit('registerApp', {
                id: this.appId,
                name: this.appName,
                icon: this.appIcon,
                handler: () => this.open(),
                display: ["startmenu", "desktop"]
            });
        }
    }

    async open() {
        try {
            console.log('Opening Test Mode app...');
            const windowId = `test-mode-${Date.now()}`;
            const windowContent = await this.templateLoader.loadTemplate('apps/test-mode/test-mode.html');

            if (!windowContent) {
                throw new Error('Failed to load settings template');
            }

            console.log('Template loaded successfully');

            console.log('Creating window...');
            // Create window using window manager
            this.eventBus.emit('createWindow', {
                id: windowId,
                title: this.appName,
                icon: this.appIcon,
                content: windowContent,
                width: 600,
                height: 500,
                minWidth: 500,
                minHeight: 400,
                resizable: true,
                draggable: true,
                centered: true,
                onWindowCreated: (windowElement) => this.onWindowCreated(windowElement)
            });

            // Track app usage
            this.trackAppUsage();
            
            console.log('Test Mode app opened successfully');

        } catch (error) {
            console.error('Failed to open Test Mode app:', error);
            this.handleError(error);
        }
    }

    /**
     * Called when window is created
     * @param {HTMLElement} windowElement - The window DOM element
     */
    onWindowCreated(windowElement) {
        // Initialize control layer
        this.control = new TestModeControl(this);
        this.control.init(this.windowId, windowElement);
        
        // Listen for window close events
        this.eventBus.on('windowClosed', (data) => {
            if (data.id === this.windowId) {
                this.onWindowClosed();
            }
        });
    }

    /**
     * Called when window is closed
     */
    onWindowClosed() {
        console.log('Test Mode window closed');
        
        // Cleanup control layer
        if (this.control) {
            this.control.destroy();
            this.control = null;
        }
        
        // Track app closure
        this.eventBus.emit('appUsage', {
            appId: this.appId,
            action: 'closed',
            timestamp: Date.now()
        });
        
        this.windowId = null;
    }

    /**
     * Track app usage
     */
    trackAppUsage() {
        console.log('Test Mode app opened');
        
        this.eventBus.emit('appUsage', {
            appId: this.appId,
            action: 'opened',
            timestamp: Date.now()
        });
    }

    /**
     * Handle errors
     * @param {Error} error - The error to handle
     */
    handleError(error) {
        console.error('Settings Processor Error:', error);
        
        if (this.control) {
            this.control.showError(error.message);
        }
        
        // Notify other modules about the error
        this.eventBus.emit('appError', {
            appId: this.appId,
            error: error.message,
            timestamp: Date.now()
        });
    }
}

// Export the processor class
window.TestModeProcessor = TestModeProcessor;