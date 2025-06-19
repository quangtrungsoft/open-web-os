/**
 * Settings App - Processor Layer
 * Handles settings management and theme switching
 */

class SettingsProcessor {
    constructor() {
        this.appId = 'settings';
        this.appName = 'Settings';
        this.appIcon = '⚙️';
        this.windowId = null;
        this.control = null;
        this.templateLoader = null;
        this.eventBus = null;
        this.themeManager = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the processor
     * @param {Object} dependencies - Required dependencies
     */
    init(dependencies = {}) {
        // Prevent duplicate initialization
        if (this.isInitialized) {
            console.log('SettingsProcessor: Already initialized, skipping');
            return true;
        }
        
        this.templateLoader = dependencies.templateLoader || window.templateLoader;
        this.eventBus = dependencies.eventBus || window.eventBus;
        this.themeManager = dependencies.themeManager || window.themeManager;
        
        if (!this.templateLoader) {
            console.error('SettingsProcessor: TemplateLoader not available');
            return false;
        }
        
        if (!this.eventBus) {
            console.error('SettingsProcessor: EventBus not available');
            return false;
        }
        
        if (!this.themeManager) {
            console.error('SettingsProcessor: ThemeManager not available');
            return false;
        }
        
        this.registerApp();
        this.isInitialized = true;
        console.log('Settings Processor initialized');
        return true;
    }

    /**
     * Register the app with the system
     */
    registerApp() {
        if (this.eventBus) {
            this.eventBus.emit('registerApp', {
                id: this.appId,
                name: this.appName,
                icon: this.appIcon,
                handler: () => this.open(),
                display: ["startmenu"]
            });
        }
    }

    /**
     * Open the Settings app
     */
    async open() {
        try {
            console.log('Opening Settings app...');
            
            const windowId = `window-${this.appId}-${Date.now()}`;
            this.windowId = windowId;

            console.log('Loading template...');
            // Load template from file
            const windowContent = await this.templateLoader.loadTemplate('apps/settings/settings.html');
            
            if (!windowContent) {
                throw new Error('Failed to load settings template');
            }
            
            console.log('Template loaded successfully');
            
            // Add window-specific styles
            this.addStyles();

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
            
            console.log('Settings app opened successfully');
            
        } catch (error) {
            console.error('Failed to open Settings app:', error);
            this.handleError(error);
        }
    }

    /**
     * Called when window is created
     * @param {HTMLElement} windowElement - The window DOM element
     */
    onWindowCreated(windowElement) {
        // Initialize control layer
        this.control = new SettingsControl(this);
        this.control.init(this.windowId, windowElement);
        
        // Load settings data
        this.loadSettings();
        
        // Listen for window close events
        this.eventBus.on('windowClosed', (data) => {
            if (data.id === this.windowId) {
                this.onWindowClosed();
            }
        });
    }

    /**
     * Load settings data
     */
    async loadSettings() {
        try {
            if (this.themeManager) {
                const themes = this.themeManager.getAllThemes();
                const currentTheme = this.themeManager.getCurrentTheme();
                await this.populateSettings({ themes, currentTheme });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.control?.showError('Failed to load settings');
        }
    }

    /**
     * Populate the UI with settings data
     * @param {Object} data - The data to populate
     */
    async populateSettings(data) {
        if (this.control) {
            this.control.updateUI(data);
        }
    }

    /**
     * Handle theme change
     * @param {string} themeId - Theme identifier
     */
    handleThemeChange(themeId) {
        if (this.themeManager) {
            const success = this.themeManager.applyTheme(themeId);
            if (success) {
                // Update the UI to reflect the change
                this.loadSettings();
                
                // Show success feedback
                this.control?.showNotification(`Theme changed to: ${this.themeManager.getTheme(themeId).name}`);
            } else {
                this.control?.showError('Failed to change theme');
            }
        }
    }

    /**
     * Track app usage
     */
    trackAppUsage() {
        console.log('Settings app opened');
        
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

    /**
     * Called when window is closed
     */
    onWindowClosed() {
        console.log('Settings window closed');
        
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
     * Add app-specific styles
     */
    addStyles() {
        if (!document.getElementById('settings-styles')) {
            const style = document.createElement('style');
            style.id = 'settings-styles';
            style.textContent = `
                .settings-content {
                    padding: 0;
                    background: var(--os-bg);
                    color: var(--os-text);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .settings-header {
                    padding: 20px;
                    background: var(--os-accent);
                    color: var(--os-text-light);
                    text-align: center;
                }

                .settings-header h2 {
                    margin: 0 0 10px 0;
                    font-size: 24px;
                    font-weight: 600;
                }

                .settings-header p {
                    margin: 0;
                    opacity: 0.9;
                    font-size: 14px;
                }

                .settings-section {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                }

                .settings-section h3 {
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--os-text);
                    border-bottom: 2px solid var(--os-accent);
                    padding-bottom: 8px;
                }

                .theme-selector {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }

                .theme-option {
                    border: 2px solid var(--os-border);
                    border-radius: 8px;
                    padding: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: var(--os-bg);
                    text-align: center;
                }

                .theme-option:hover {
                    border-color: var(--os-accent);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px var(--os-shadow);
                }

                .theme-option.active {
                    border-color: var(--os-accent);
                    background: var(--os-accent-light);
                }

                .theme-option span {
                    font-weight: 600;
                    font-size: 14px;
                    color: var(--os-text);
                    display: block;
                    margin-top: 10px;
                }

                .theme-preview {
                    height: 60px;
                    border-radius: 6px;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 12px;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                }

                /* Theme preview backgrounds */
                .theme-preview.classic {
                    background: linear-gradient(135deg, #0078d4 0%, #106ebe 100%);
                }

                .theme-preview.night {
                    background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
                }

                .theme-preview.professional {
                    background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
                    color: #000000;
                    text-shadow: none;
                }

                .theme-preview.sunset {
                    background: linear-gradient(135deg, #e17055 0%, #d63031 100%);
                }

                .theme-preview.ocean {
                    background: linear-gradient(135deg, #0984e3 0%, #0652DD 100%);
                }

                .settings-footer {
                    padding: 20px;
                    background: var(--os-bg-dark);
                    border-top: 1px solid var(--os-border);
                    text-align: center;
                }

                .settings-footer p {
                    margin: 5px 0;
                    font-size: 12px;
                    color: var(--os-text-secondary);
                }

                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--os-accent);
                    color: var(--os-text-light);
                    padding: 12px 20px;
                    border-radius: 6px;
                    box-shadow: 0 4px 12px var(--os-shadow);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }

                .notification.show {
                    transform: translateX(0);
                }

                .error {
                    color: #e74c3c;
                    background: #fdf2f2;
                    border: 1px solid #f5c6cb;
                    padding: 10px;
                    border-radius: 4px;
                    margin: 10px 0;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Get settings statistics
     * @returns {Object} Settings statistics
     */
    getStats() {
        return {
            appId: this.appId,
            appName: this.appName,
            isInitialized: !!this.control
        };
    }
}

// Export the settings processor class
window.SettingsProcessor = SettingsProcessor; 