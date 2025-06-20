/**
 * WebOS - Theme Manager
 * Handles theme switching and management with dynamic loading support
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'classic';
        this.themes = new Map();
        this.themeInstances = new Map(); // Store theme class instances
        this.eventBus = null;
        this.isInitialized = false;
        this.currentStylesheet = null;
        
        // Initialize default themes
        this.initializeDefaultThemes();
    }

    /**
     * Initialize the theme manager
     * @param {Object} dependencies - Required dependencies
     */
    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('ThemeManager: EventBus not available');
            return false;
        }
        
        this.loadSavedTheme();
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('Theme Manager initialized');
        return true;
    }

    /**
     * Initialize default themes
     */
    initializeDefaultThemes() {
        // Classic WebOS Theme
        this.addTheme('classic', {
            name: 'Classic',
            description: 'Classic WebOS blue theme',
            class: 'ClassicTheme',
            cssPath: 'modules/ui/themes/classic/classic.css',
            jsPath: 'modules/ui/themes/classic/classic.js'
        });

        // Night Theme
        this.addTheme('night', {
            name: 'Night',
            description: 'Modern dark theme for better eye comfort',
            class: 'NightTheme',
            cssPath: 'modules/ui/themes/night/night.css',
            jsPath: 'modules/ui/themes/night/night.js'
        });

        // Professional Theme
        this.addTheme('professional', {
            name: 'Professional',
            description: 'Clean and bright professional theme',
            class: 'ProfessionalTheme',
            cssPath: 'modules/ui/themes/professional/professional.css',
            jsPath: 'modules/ui/themes/professional/professional.js'
        });

        // Sunset Theme
        this.addTheme('sunset', {
            name: 'Sunset',
            description: 'Warm sunset colors',
            class: 'SunsetTheme',
            cssPath: 'modules/ui/themes/sunset/sunset.css',
            jsPath: 'modules/ui/themes/sunset/sunset.js'
        });

        // Ocean Theme
        this.addTheme('ocean', {
            name: 'Ocean',
            description: 'Deep ocean blues',
            class: 'OceanTheme',
            cssPath: 'modules/ui/themes/ocean/ocean.css',
            jsPath: 'modules/ui/themes/ocean/ocean.js'
        });
    }

    /**
     * Add a new theme
     * @param {string} themeId - Theme identifier
     * @param {Object} themeConfig - Theme configuration
     */
    addTheme(themeId, themeConfig) {
        this.themes.set(themeId, {
            id: themeId,
            ...themeConfig
        });
        console.log(`Theme added: ${themeConfig.name}`);
    }

    /**
     * Get a theme by ID
     * @param {string} themeId - Theme identifier
     * @returns {Object|null} Theme configuration or null
     */
    getTheme(themeId) {
        return this.themes.get(themeId) || null;
    }

    /**
     * Get all available themes
     * @returns {Array} Array of theme configurations
     */
    getAllThemes() {
        return Array.from(this.themes.values());
    }

    /**
     * Get current theme
     * @returns {Object} Current theme configuration
     */
    getCurrentTheme() {
        return this.getTheme(this.currentTheme);
    }

    /**
     * Get current theme instance
     * @returns {Object|null} Current theme instance or null
     */
    getCurrentThemeInstance() {
        return this.themeInstances.get(this.currentTheme) || null;
    }

    /**
     * Load and apply a theme with dynamic loading support
     * @param {string} themeId - Theme identifier
     */
    async applyTheme(themeId) {
        const theme = this.getTheme(themeId);
        if (!theme) {
            console.error(`Theme not found: ${themeId}`);
            return false;
        }

        try {
            console.log(`Applying theme: ${theme.name}`);

            // Remove current theme's assets
            await this.removeCurrentThemeAssets();

            // Load new theme's stylesheet
            if (theme.cssPath) {
                this.loadStylesheet(theme.cssPath);
            }

            // Try to load and apply theme class if available
            if (theme.class && theme.jsPath) {
                await this.loadAndApplyThemeClass(theme);
            }

            // Update current theme
            this.currentTheme = themeId;
            
            // Save to localStorage
            this.saveTheme();
            
            // Emit theme changed event
            if (this.eventBus) {
                this.eventBus.emit('themeChanged', {
                    themeId,
                    theme: theme,
                    instance: this.themeInstances.get(themeId)
                });
            }

            console.log(`Theme applied successfully: ${theme.name}`);
            return true;

        } catch (error) {
            console.error(`Failed to apply theme ${themeId}:`, error);
            return false;
        }
    }

    /**
     * Load theme stylesheet
     * @param {string} cssPath - Path to theme stylesheet
     */
    loadStylesheet(cssPath) {
        if (this.currentStylesheet) {
            this.currentStylesheet.remove();
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssPath;
        
        this.currentStylesheet = link;
        document.head.appendChild(link);
    }

    /**
     * Load and apply theme class
     * @param {Object} theme - Theme configuration
     */
    async loadAndApplyThemeClass(theme) {
        try {
            // Check if theme class is already available
            const ThemeClass = window[theme.class];
            
            if (!ThemeClass) {
                // Try to load theme script dynamically
                await this.loadThemeScript(theme.jsPath);
                
                // Check again after loading
                const LoadedThemeClass = window[theme.class];
                if (!LoadedThemeClass) {
                    throw new Error(`Theme class not found: ${theme.class}`);
                }
            }

            // Create theme instance
            const themeInstance = new window[theme.class]();
            this.themeInstances.set(theme.id, themeInstance);

            // Apply theme
            if (typeof themeInstance.apply === 'function') {
                themeInstance.apply();
            } else if (typeof themeInstance.init === 'function') {
                themeInstance.init();
            }

            console.log(`Theme class loaded and applied: ${theme.class}`);

        } catch (error) {
            console.warn(`Failed to load theme class for ${theme.id}:`, error);
            // Continue with basic theme application
        }
    }

    /**
     * Load theme script dynamically
     * @param {string} scriptPath - Path to theme script
     */
    async loadThemeScript(scriptPath) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${scriptPath}`));
            document.head.appendChild(script);
        });
    }

    /**
     * Remove current theme's assets (instance and stylesheet)
     */
    async removeCurrentThemeAssets() {
        // Remove theme instance
        const currentInstance = this.themeInstances.get(this.currentTheme);
        if (currentInstance && typeof currentInstance.remove === 'function') {
            try {
                currentInstance.remove();
                console.log(`Removed theme instance: ${this.currentTheme}`);
            } catch (error) {
                console.warn(`Failed to remove theme instance: ${this.currentTheme}`, error);
            }
        }
        this.themeInstances.delete(this.currentTheme);

        // Remove stylesheet
        if (this.currentStylesheet) {
            this.currentStylesheet.remove();
            this.currentStylesheet = null;
        }
    }

    /**
     * Load saved theme from localStorage
     */
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('webos-theme');
            if (savedTheme && this.themes.has(savedTheme)) {
                this.applyTheme(savedTheme);
            } else {
                // Apply default theme
                this.applyTheme('classic');
            }
        } catch (error) {
            console.error('Failed to load saved theme:', error);
            this.applyTheme('classic');
        }
    }

    /**
     * Save current theme to localStorage
     */
    saveTheme() {
        try {
            localStorage.setItem('webos-theme', this.currentTheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Listen for theme change requests
        this.eventBus.on('changeTheme', (data) => {
            this.applyTheme(data.themeId);
        });

        // Listen for theme list requests
        this.eventBus.on('getThemes', () => {
            this.eventBus.emit('themesList', {
                themes: this.getAllThemes(),
                currentTheme: this.currentTheme
            });
        });

        // Listen for theme info requests
        this.eventBus.on('getCurrentTheme', () => {
            this.eventBus.emit('currentThemeInfo', {
                theme: this.getCurrentTheme(),
                instance: this.getCurrentThemeInstance()
            });
        });
    }

    /**
     * Get theme manager statistics
     * @returns {Object} Theme manager statistics
     */
    getStats() {
        return {
            totalThemes: this.themes.size,
            currentTheme: this.currentTheme,
            availableThemes: Array.from(this.themes.keys()),
            themeInstances: Array.from(this.themeInstances.keys())
        };
    }

    /**
     * Cleanup resources
     */
    async destroy() {
        // Remove all theme instances
        for (const [themeId, instance] of this.themeInstances) {
            if (typeof instance.remove === 'function') {
                try {
                    instance.remove();
                } catch (error) {
                    console.warn(`Failed to remove theme instance: ${themeId}`, error);
                }
            }
        }

        this.themes.clear();
        this.themeInstances.clear();
        this.isInitialized = false;

        if (this.currentStylesheet) {
            this.currentStylesheet.remove();
        }

        console.log('Theme Manager destroyed');
    }
}

// Export the theme manager class
window.ThemeManager = ThemeManager; 