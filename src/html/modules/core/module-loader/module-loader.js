/**
 * WebOS - Module Loader
 * Handles loading and initialization of modules
 */

class ModuleLoader {
    constructor() {
        this.loadedModules = new Map();
        this.moduleQueue = [];
        this.isLoading = false;
        this.loadingProgress = 0;
        this.totalModules = 0;
        this.loadedCount = 0;
    }

    /**
     * Initialize the module loader
     */
    init() {
        console.log('Module Loader initialized');
        this.updateProgress(0, 'Initializing...');
    }

    /**
     * Load core modules
     */
    async loadCoreModules() {
        this.updateStatus('Loading core modules...');
        
        const config = window.WEBOS_MODULES.core;
        
        if (config.eventBus) {
            await this.loadModule('EventBus', () => {
                window.eventBus = new EventBus();
                return window.eventBus;
            });
        }
        
        if (config.templateLoader) {
            await this.loadModule('TemplateLoader', () => {
                window.templateLoader = new TemplateLoader();
                return window.templateLoader;
            });
        }
        
        if (config.windowManager) {
            await this.loadModule('WindowManager', () => {
                window.windowManager = new WindowManager();
                return window.windowManager;
            });
        }
        
        if (config.taskbar) {
            await this.loadModule('Taskbar', () => {
                window.taskbar = new Taskbar();
                return window.taskbar;
            });
        }
        
        if (config.desktop) {
            await this.loadModule('Desktop', () => {
                window.desktop = new Desktop();
                return window.desktop;
            });
        }
        
        if (config.themeManager) {
            await this.loadModule('ThemeManager', () => {
                window.themeManager = new ThemeManager();
                return window.themeManager;
            });
        }
    }

    /**
     * Load UI modules
     */
    async loadUIModules() {
        this.updateStatus('Loading UI modules...');
        
        const config = window.WEBOS_MODULES.ui;
        
        if (config.startMenu) {
            await this.loadModule('StartMenu', () => {
                window.startMenu = new StartMenu();
                return window.startMenu;
            });
        }
        
        if (config.desktopIcons) {
            await this.loadModule('DesktopIcons', () => {
                window.desktopIcons = new DesktopIcons();
                return window.desktopIcons;
            });
        }
        
        if (config.contextMenu) {
            await this.loadModule('ContextMenu', () => {
                window.contextMenu = new ContextMenu();
                return window.contextMenu;
            });
        }
        
        if (config.notifications) {
            await this.loadModule('Notifications', () => {
                window.notifications = new Notifications();
                return window.notifications;
            });
        }
    }

    /**
     * Load app modules
     */
    async loadAppModules() {
        this.updateStatus('Loading app modules...');
        
        const config = window.WEBOS_MODULES.apps;
        
        if (config.aboutMe) {
            await this.loadModule('AboutMeProcessor', () => {
                const dependencies = {
                    eventBus: window.eventBus,
                    templateLoader: window.templateLoader,
                    windowManager: window.windowManager
                };
                window.aboutMeProcessor = new AboutMeProcessor();
                window.aboutMeProcessor.init(dependencies);
                return window.aboutMeProcessor;
            });
        }
        
        if (config.calculator) {
            await this.loadModule('CalculatorProcessor', () => {
                window.calculatorProcessor = new CalculatorProcessor();
                return window.calculatorProcessor;
            });
        }
        
        if (config.notepad) {
            await this.loadModule('NotepadProcessor', () => {
                window.notepadProcessor = new NotepadProcessor();
                return window.notepadProcessor;
            });
        }
        
        if (config.explorer) {
            await this.loadModule('ExplorerProcessor', () => {
                window.explorerProcessor = new ExplorerProcessor();
                return window.explorerProcessor;
            });
        }
        
        if (config.settings) {
            await this.loadModule('SettingsProcessor', () => {
                const dependencies = {
                    eventBus: window.eventBus,
                    templateLoader: window.templateLoader,
                    windowManager: window.windowManager,
                    themeManager: window.themeManager
                };
                window.settingsProcessor = new SettingsProcessor();
                window.settingsProcessor.init(dependencies);
                return window.settingsProcessor;
            });
        }
    }

    /**
     * Load feature modules
     */
    async loadFeatureModules() {
        this.updateStatus('Loading feature modules...');
        
        const config = window.WEBOS_MODULES.features;
        
        if (config.dragAndDrop) {
            await this.loadModule('DragAndDrop', () => {
                window.dragAndDrop = new DragAndDrop();
                return window.dragAndDrop;
            });
        }
        
        if (config.resizing) {
            await this.loadModule('Resizing', () => {
                window.resizing = new Resizing();
                return window.resizing;
            });
        }
        
        if (config.search) {
            await this.loadModule('Search', () => {
                window.search = new Search();
                return window.search;
            });
        }
        
        if (config.animations) {
            await this.loadModule('Animations', () => {
                window.animations = new Animations();
                return window.animations;
            });
        }
        
        if (config.localStorage) {
            await this.loadModule('LocalStorage', () => {
                window.localStorage = new LocalStorage();
                return window.localStorage;
            });
        }
    }

    /**
     * Load third-party modules
     */
    async loadThirdPartyModules() {
        this.updateStatus('Loading third-party modules...');
        
        const config = window.WEBOS_MODULES.thirdparty;
        
        if (config.threejs) {
            await this.loadModule('ThreeJS', () => {
                // Three.js integration would go here
                return null;
            });
        }
        
        if (config.facebook) {
            await this.loadModule('Facebook', () => {
                // Facebook integration would go here
                return null;
            });
        }
    }

    /**
     * Load a single module
     * @param {string} moduleName - Name of the module
     * @param {Function} initializer - Module initialization function
     */
    async loadModule(moduleName, initializer) {
        try {
            this.updateStatus(`Loading ${moduleName}...`);
            
            const module = initializer();
            
            // Initialize module if it has an init method
            if (module && typeof module.init === 'function') {
                const dependencies = {
                    eventBus: window.eventBus,
                    templateLoader: window.templateLoader,
                    windowManager: window.windowManager
                };
                
                const success = module.init(dependencies);
                if (!success) {
                    console.warn(`Module ${moduleName} failed to initialize`);
                }
            }
            
            this.loadedModules.set(moduleName, module);
            this.loadedCount++;
            
            const progress = (this.loadedCount / this.totalModules) * 100;
            this.updateProgress(progress, `${moduleName} loaded`);
            
            console.log(`Module ${moduleName} loaded successfully`);
            
        } catch (error) {
            console.error(`Failed to load module ${moduleName}:`, error);
            this.updateStatus(`Failed to load ${moduleName}`);
        }
    }

    /**
     * Initialize all modules
     */
    async initializeModules() {
        this.isLoading = true;
        
        // Count total modules to load
        this.totalModules = this.countModules();
        this.loadedCount = 0;
        
        try {
            // Load modules in order
            await this.loadCoreModules();
            await this.loadUIModules();
            await this.loadAppModules();
            await this.loadFeatureModules();
            await this.loadThirdPartyModules();
            
            this.updateProgress(100, 'All modules loaded');
            this.updateStatus('Initialization complete');
            
            // Emit completion event
            if (window.eventBus) {
                window.eventBus.emit('modulesLoaded', {
                    totalModules: this.totalModules,
                    loadedModules: Array.from(this.loadedModules.keys())
                });
            }
            
        } catch (error) {
            console.error('Module loading failed:', error);
            this.updateStatus('Module loading failed');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Count total modules to load
     * @returns {number} Total module count
     */
    countModules() {
        let count = 0;
        const config = window.WEBOS_MODULES;
        
        // Count core modules
        Object.values(config.core).forEach(enabled => {
            if (enabled) count++;
        });
        
        // Count UI modules
        Object.values(config.ui).forEach(enabled => {
            if (enabled) count++;
        });
        
        // Count app modules
        Object.values(config.apps).forEach(enabled => {
            if (enabled) count++;
        });
        
        // Count feature modules
        Object.values(config.features).forEach(enabled => {
            if (enabled) count++;
        });
        
        // Count third-party modules
        Object.values(config.thirdparty).forEach(enabled => {
            if (enabled) count++;
        });
        
        return count;
    }

    /**
     * Update loading progress
     * @param {number} progress - Progress percentage (0-100)
     * @param {string} message - Status message
     */
    updateProgress(progress, message) {
        this.loadingProgress = progress;
        
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = message;
        }
    }

    /**
     * Update status message
     * @param {string} message - Status message
     */
    updateStatus(message) {
        console.log(`Module Loader: ${message}`);
    }

    /**
     * Get loaded module
     * @param {string} moduleName - Name of the module
     * @returns {*} Module instance or null
     */
    getModule(moduleName) {
        return this.loadedModules.get(moduleName) || null;
    }

    /**
     * Get all loaded modules
     * @returns {Map} Map of loaded modules
     */
    getAllModules() {
        return new Map(this.loadedModules);
    }

    /**
     * Check if module is loaded
     * @param {string} moduleName - Name of the module
     * @returns {boolean} True if module is loaded
     */
    isModuleLoaded(moduleName) {
        return this.loadedModules.has(moduleName);
    }

    /**
     * Get loading statistics
     * @returns {Object} Loading statistics
     */
    getStats() {
        return {
            totalModules: this.totalModules,
            loadedCount: this.loadedCount,
            isLoading: this.isLoading,
            progress: this.loadingProgress,
            loadedModules: Array.from(this.loadedModules.keys())
        };
    }
}

// Export the module loader
window.ModuleLoader = ModuleLoader; 