/**
 * WebOS - Template Loader
 * Handles loading HTML templates from separate files
 */

class TemplateLoader {
    constructor() {
        this.templates = new Map();
        this.basePath = 'modules/';
    }
    
    /**
     * Load a template from file
     * @param {string} templatePath - Path to template file
     * @returns {Promise<string>} Template HTML content
     */
    async loadTemplate(templatePath) {
        const fullPath = this.basePath + templatePath;
        
        // Check if template is already cached
        if (this.templates.has(fullPath)) {
            return this.templates.get(fullPath);
        }
        
        try {
            const response = await fetch(fullPath);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.status} ${response.statusText}`);
            }
            
            const template = await response.text();
            
            // Cache the template
            this.templates.set(fullPath, template);
            
            return template;
        } catch (error) {
            console.error(`Error loading template ${fullPath}:`, error);
            return `<div class="error">Failed to load template: ${templatePath}</div>`;
        }
    }
    
    /**
     * Load multiple templates
     * @param {string[]} templatePaths - Array of template paths
     * @returns {Promise<Map<string, string>>} Map of template paths to content
     */
    async loadTemplates(templatePaths) {
        const templates = new Map();
        
        const promises = templatePaths.map(async (path) => {
            const content = await this.loadTemplate(path);
            templates.set(path, content);
        });
        
        await Promise.all(promises);
        return templates;
    }
    
    /**
     * Preload templates for better performance
     * @param {string[]} templatePaths - Array of template paths to preload
     */
    async preloadTemplates(templatePaths) {
        console.log('Preloading templates:', templatePaths);
        await this.loadTemplates(templatePaths);
        console.log('Templates preloaded successfully');
    }
    
    /**
     * Clear template cache
     */
    clearCache() {
        this.templates.clear();
    }
    
    /**
     * Get cached template
     * @param {string} templatePath - Path to template
     * @returns {string|null} Cached template or null
     */
    getCachedTemplate(templatePath) {
        const fullPath = this.basePath + templatePath;
        return this.templates.get(fullPath) || null;
    }
    
    /**
     * Check if template is cached
     * @param {string} templatePath - Path to template
     * @returns {boolean} True if cached
     */
    isCached(templatePath) {
        const fullPath = this.basePath + templatePath;
        return this.templates.has(fullPath);
    }
}

// Export the template loader
window.TemplateLoader = TemplateLoader; 