/**
 * WebOS - Theme Manager
 * Handles theme switching and management
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'classic';
        this.themes = new Map();
        this.eventBus = null;
        this.isInitialized = false;
        
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
            colors: {
                '--os-bg': '#0078d4',
                '--os-bg-dark': '#106ebe',
                '--os-accent': '#0078d4',
                '--os-accent-light': '#40a9ff',
                '--os-accent-dark': '#005a9e',
                '--os-text': '#323130',
                '--os-text-secondary': '#605e5c',
                '--os-text-light': '#ffffff',
                '--os-border': '#e1dfdd',
                '--os-border-light': '#f3f2f1',
                '--os-shadow': 'rgba(0, 0, 0, 0.1)',
                '--os-shadow-dark': 'rgba(0, 0, 0, 0.2)',
                '--taskbar-bg': 'rgba(0, 0, 0, 0.8)',
                '--taskbar-bg-hover': 'rgba(255, 255, 255, 0.1)',
                '--taskbar-bg-active': 'rgba(255, 255, 255, 0.2)',
                '--start-menu-bg': 'rgba(0, 0, 0, 0.9)',
                '--start-menu-item-hover': 'rgba(255, 255, 255, 0.1)',
                '--window-shadow': '0 4px 20px rgba(0, 0, 0, 0.3)'
            },
            desktop: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }
        });

        // Night Theme
        this.addTheme('night', {
            name: 'Night',
            description: 'Modern dark theme for better eye comfort',
            colors: {
                '--os-bg': '#1a1a1a',
                '--os-bg-dark': '#0d0d0d',
                '--os-accent': '#0078d4',
                '--os-accent-light': '#40a9ff',
                '--os-accent-dark': '#005a9e',
                '--os-text': '#ffffff',
                '--os-text-secondary': '#cccccc',
                '--os-text-light': '#ffffff',
                '--os-border': '#404040',
                '--os-border-light': '#2d2d2d',
                '--os-shadow': 'rgba(0, 0, 0, 0.3)',
                '--os-shadow-dark': 'rgba(0, 0, 0, 0.5)',
                '--taskbar-bg': 'rgba(26, 26, 26, 0.9)',
                '--taskbar-bg-hover': 'rgba(255, 255, 255, 0.1)',
                '--taskbar-bg-active': 'rgba(255, 255, 255, 0.2)',
                '--start-menu-bg': 'rgba(26, 26, 26, 0.95)',
                '--start-menu-item-hover': 'rgba(255, 255, 255, 0.1)',
                '--window-shadow': '0 4px 20px rgba(0, 0, 0, 0.5)'
            },
            desktop: {
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
            }
        });

        // Professional Theme
        this.addTheme('professional', {
            name: 'Professional',
            description: 'Clean and bright professional theme',
            colors: {
                '--os-bg': '#ffffff',
                '--os-bg-dark': '#f5f5f5',
                '--os-accent': '#0078d4',
                '--os-accent-light': '#40a9ff',
                '--os-accent-dark': '#005a9e',
                '--os-text': '#000000',
                '--os-text-secondary': '#666666',
                '--os-text-light': '#ffffff',
                '--os-border': '#e0e0e0',
                '--os-border-light': '#f0f0f0',
                '--os-shadow': 'rgba(0, 0, 0, 0.1)',
                '--os-shadow-dark': 'rgba(0, 0, 0, 0.2)',
                '--taskbar-bg': 'rgba(255, 255, 255, 0.9)',
                '--taskbar-bg-hover': 'rgba(0, 0, 0, 0.1)',
                '--taskbar-bg-active': 'rgba(0, 0, 0, 0.2)',
                '--start-menu-bg': 'rgba(255, 255, 255, 0.95)',
                '--start-menu-item-hover': 'rgba(0, 0, 0, 0.1)',
                '--window-shadow': '0 4px 20px rgba(0, 0, 0, 0.2)'
            },
            desktop: {
                background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
            }
        });

        // Sunset Theme
        this.addTheme('sunset', {
            name: 'Sunset',
            description: 'Warm sunset colors',
            colors: {
                '--os-bg': '#e17055',
                '--os-bg-dark': '#d63031',
                '--os-accent': '#e17055',
                '--os-accent-light': '#fab1a0',
                '--os-accent-dark': '#d63031',
                '--os-text': '#2d3436',
                '--os-text-secondary': '#636e72',
                '--os-text-light': '#ffffff',
                '--os-border': '#fdcb6e',
                '--os-border-light': '#ffeaa7',
                '--os-shadow': 'rgba(0, 0, 0, 0.1)',
                '--os-shadow-dark': 'rgba(0, 0, 0, 0.2)',
                '--taskbar-bg': 'rgba(225, 112, 85, 0.9)',
                '--taskbar-bg-hover': 'rgba(255, 255, 255, 0.1)',
                '--taskbar-bg-active': 'rgba(255, 255, 255, 0.2)',
                '--start-menu-bg': 'rgba(225, 112, 85, 0.95)',
                '--start-menu-item-hover': 'rgba(255, 255, 255, 0.1)',
                '--window-shadow': '0 4px 20px rgba(0, 0, 0, 0.3)'
            },
            desktop: {
                background: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)'
            }
        });

        // Ocean Theme
        this.addTheme('ocean', {
            name: 'Ocean',
            description: 'Deep ocean blues',
            colors: {
                '--os-bg': '#0984e3',
                '--os-bg-dark': '#0652DD',
                '--os-accent': '#0984e3',
                '--os-accent-light': '#74b9ff',
                '--os-accent-dark': '#0652DD',
                '--os-text': '#ffffff',
                '--os-text-secondary': '#b2bec3',
                '--os-text-light': '#ffffff',
                '--os-border': '#74b9ff',
                '--os-border-light': '#a29bfe',
                '--os-shadow': 'rgba(0, 0, 0, 0.2)',
                '--os-shadow-dark': 'rgba(0, 0, 0, 0.4)',
                '--taskbar-bg': 'rgba(9, 132, 227, 0.9)',
                '--taskbar-bg-hover': 'rgba(255, 255, 255, 0.1)',
                '--taskbar-bg-active': 'rgba(255, 255, 255, 0.2)',
                '--start-menu-bg': 'rgba(9, 132, 227, 0.95)',
                '--start-menu-item-hover': 'rgba(255, 255, 255, 0.1)',
                '--window-shadow': '0 4px 20px rgba(0, 0, 0, 0.4)'
            },
            desktop: {
                background: 'linear-gradient(135deg, #00cec9 0%, #0984e3 100%)'
            }
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
     * Apply a theme
     * @param {string} themeId - Theme identifier
     */
    applyTheme(themeId) {
        const theme = this.getTheme(themeId);
        if (!theme) {
            console.error(`Theme not found: ${themeId}`);
            return false;
        }

        // Apply CSS custom properties
        const root = document.documentElement;
        
        // Apply color variables
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Apply desktop background
        if (theme.desktop && theme.desktop.background) {
            const desktop = document.querySelector('.desktop');
            if (desktop) {
                desktop.style.background = theme.desktop.background;
            }
        }

        // Update current theme
        this.currentTheme = themeId;
        
        // Save to localStorage
        this.saveTheme();
        
        // Emit theme changed event
        if (this.eventBus) {
            this.eventBus.emit('themeChanged', {
                themeId,
                theme: theme
            });
        }

        console.log(`Theme applied: ${theme.name}`);
        return true;
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
    }

    /**
     * Get theme manager statistics
     * @returns {Object} Theme manager statistics
     */
    getStats() {
        return {
            totalThemes: this.themes.size,
            currentTheme: this.currentTheme,
            availableThemes: Array.from(this.themes.keys())
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.themes.clear();
        this.isInitialized = false;
        console.log('Theme Manager destroyed');
    }
}

// Export the theme manager class
window.ThemeManager = ThemeManager; 