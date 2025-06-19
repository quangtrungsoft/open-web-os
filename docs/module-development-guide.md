# WebOS Module Development Guide

## Overview

This guide explains how to create new modules for WebOS that properly integrate with the unified theme system and follow the established architectural patterns.

## Module Types

### 1. Core Modules
Essential system functionality (EventBus, WindowManager, ThemeManager, etc.)

### 2. UI Modules
User interface components (StartMenu, Taskbar, DesktopIcons, etc.)

### 3. App Modules
Applications that run in windows (Calculator, Settings, AboutMe, etc.)

### 4. Feature Modules
System features (DragAndDrop, Resizing, Search, etc.)

## Module Structure

### Basic Module Template

```javascript
/**
 * WebOS - [Module Name]
 * Brief description of what this module does
 */

class [ModuleName] {
    constructor() {
        this.eventBus = null;
        this.isInitialized = false;
        // Add other properties as needed
    }

    /**
     * Initialize the module
     * @param {Object} dependencies - Required dependencies
     */
    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('[ModuleName]: EventBus not available');
            return false;
        }
        
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('[ModuleName] initialized');
        return true;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Listen for relevant events
        this.eventBus.on('themeChanged', (data) => {
            this.handleThemeChange(data);
        });
    }

    /**
     * Handle theme changes
     * @param {Object} data - Theme change data
     */
    handleThemeChange(data) {
        // Update any custom UI elements that can't use CSS variables
        this.updateCustomElements(data.theme);
    }

    /**
     * Get module statistics
     * @returns {Object} Module statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            name: '[ModuleName]'
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.isInitialized = false;
        console.log('[ModuleName] destroyed');
    }
}

// Export the module class
window.[ModuleName] = [ModuleName];
```

## Theme Integration

### CSS Guidelines

**✅ Always use theme variables:**

```css
.my-module {
    background: var(--os-bg);
    color: var(--os-text);
    border: 1px solid var(--os-border);
    box-shadow: var(--os-shadow);
}

.my-module:hover {
    background: var(--os-bg-dark);
    border-color: var(--os-accent);
}

.my-module .title {
    color: var(--os-text);
    font-weight: 600;
}

.my-module .subtitle {
    color: var(--os-text-secondary);
}
```

**❌ Never hardcode colors:**

```css
.my-module {
    background: #0078d4;  /* Don't do this! */
    color: #323130;       /* Don't do this! */
}
```

### JavaScript Theme Handling

```javascript
class MyModule {
    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        this.themeManager = dependencies.themeManager || window.themeManager;
        
        // Listen for theme changes
        this.eventBus.on('themeChanged', (data) => {
            this.updateTheme(data.theme);
        });
        
        // Get current theme on initialization
        const currentTheme = this.themeManager.getCurrentTheme();
        this.updateTheme(currentTheme);
    }
    
    updateTheme(theme) {
        // Update custom canvas drawings
        this.updateCanvas(theme);
        
        // Update SVG icons
        this.updateIcons(theme);
        
        // Update any other custom elements
        this.updateCustomElements(theme);
    }
    
    updateCanvas(theme) {
        const canvas = this.canvasElement;
        const ctx = canvas.getContext('2d');
        
        // Use theme colors for drawing
        ctx.fillStyle = theme.colors['--os-accent'];
        ctx.strokeStyle = theme.colors['--os-border'];
        // ... drawing code
    }
}
```

## App Module Example

### HTML Template

```html
<!-- templates/apps/my-app.html -->
<div class="my-app-content">
    <div class="app-header">
        <h2>My App</h2>
        <p>App description</p>
    </div>
    
    <div class="app-body">
        <div class="content-section">
            <h3>Section Title</h3>
            <p>Content goes here</p>
        </div>
    </div>
    
    <div class="app-footer">
        <button class="primary-button">Action</button>
    </div>
</div>
```

### CSS Styles

```css
/* styles/apps/my-app.css */
.my-app-content {
    background: var(--os-bg);
    color: var(--os-text);
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.app-header {
    background: var(--os-accent);
    color: var(--os-text-light);
    padding: 15px;
    border-radius: var(--window-border-radius);
    margin-bottom: 20px;
}

.app-header h2 {
    margin: 0 0 5px 0;
    font-size: 18px;
    font-weight: 600;
}

.app-header p {
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
}

.app-body {
    flex: 1;
    overflow-y: auto;
}

.content-section {
    background: var(--os-bg-dark);
    border: 1px solid var(--os-border);
    border-radius: 6px;
    padding: 15px;
    margin-bottom: 15px;
}

.content-section h3 {
    margin: 0 0 10px 0;
    color: var(--os-text);
    font-size: 16px;
    font-weight: 600;
}

.primary-button {
    background: var(--os-accent);
    color: var(--os-text-light);
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s ease;
}

.primary-button:hover {
    background: var(--os-accent-dark);
}

.primary-button:active {
    background: var(--os-accent-dark);
    transform: translateY(1px);
}
```

### JavaScript Module

```javascript
/**
 * WebOS - My App Processor
 * Handles the My App application functionality
 */

class MyAppProcessor {
    constructor() {
        this.eventBus = null;
        this.templateLoader = null;
        this.windowManager = null;
        this.isInitialized = false;
    }

    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        this.templateLoader = dependencies.templateLoader || window.templateLoader;
        this.windowManager = dependencies.windowManager || window.windowManager;
        
        if (!this.eventBus || !this.templateLoader || !this.windowManager) {
            console.error('MyAppProcessor: Required dependencies not available');
            return false;
        }
        
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('My App Processor initialized');
        return true;
    }

    bindEvents() {
        // Listen for app launch requests
        this.eventBus.on('launchApp', (data) => {
            if (data.appName === 'myapp') {
                this.launchMyApp();
            }
        });
        
        // Listen for theme changes
        this.eventBus.on('themeChanged', (data) => {
            this.handleThemeChange(data);
        });
    }

    async launchMyApp() {
        try {
            const template = await this.templateLoader.loadTemplate('my-app');
            
            if (!template) {
                console.error('Failed to load my app template');
                return;
            }
            
            const windowConfig = {
                id: 'my-app-' + Date.now(),
                title: 'My App',
                icon: '🎯',
                content: template,
                width: 600,
                height: 500,
                resizable: true,
                centered: true
            };
            
            this.windowManager.createWindow(windowConfig);
            console.log('My App launched');
            
        } catch (error) {
            console.error('Failed to launch My App:', error);
        }
    }

    handleThemeChange(data) {
        // Update any custom elements that need JavaScript-based theme updates
        this.updateCustomElements(data.theme);
    }

    updateCustomElements(theme) {
        // Example: Update custom canvas or SVG elements
        const customElements = document.querySelectorAll('.my-app-custom-element');
        customElements.forEach(element => {
            element.style.backgroundColor = theme.colors['--os-accent'];
        });
    }

    getStats() {
        return {
            isInitialized: this.isInitialized,
            name: 'MyAppProcessor'
        };
    }

    destroy() {
        this.isInitialized = false;
        console.log('My App Processor destroyed');
    }
}

// Export the module class
window.MyAppProcessor = MyAppProcessor;
```

## Module Registration

### 1. Add to Module Configuration

Update `index.html` to include your module:

```html
<script>
    window.WEBOS_MODULES = {
        // ... existing modules
        
        apps: {
            aboutMe: true,
            calculator: true,
            myapp: true,  // Add your app here
            // ... other apps
        }
    };
</script>
```

### 2. Add Script Reference

```html
<!-- App Modules -->
<script src="modules/apps/myapp/my-app.processor.js"></script>
```

### 3. Add Desktop Icon

```html
<div class="desktop-icon" data-app="myapp">
    <div class="icon-image">🎯</div>
    <div class="icon-label">My App</div>
</div>
```

### 4. Add to Start Menu

```html
<div class="app-item" data-app="myapp">
    <div class="app-icon">🎯</div>
    <div class="app-name">My App</div>
</div>
```

## Best Practices

### 1. Theme Compliance
- Always use CSS variables for colors
- Test with all available themes
- Listen for theme change events
- Update custom elements appropriately

### 2. Performance
- Minimize DOM manipulation
- Use event delegation where appropriate
- Clean up event listeners in destroy()
- Avoid memory leaks

### 3. Error Handling
- Validate dependencies in init()
- Handle async operations gracefully
- Provide meaningful error messages
- Log errors for debugging

### 4. Accessibility
- Use semantic HTML
- Provide keyboard navigation
- Maintain proper contrast ratios
- Include ARIA labels where needed

### 5. Code Organization
- Follow the established naming conventions
- Use consistent code formatting
- Include proper documentation
- Separate concerns (UI, logic, data)

## Testing Your Module

### 1. Theme Testing
```javascript
// Test with different themes
const themes = ['classic', 'night', 'professional', 'sunset', 'ocean'];
themes.forEach(theme => {
    window.themeManager.applyTheme(theme);
    // Verify your module looks correct
});
```

### 2. Integration Testing
```javascript
// Test module initialization
const module = new MyModule();
const result = module.init({
    eventBus: window.eventBus,
    // ... other dependencies
});
console.assert(result === true, 'Module should initialize successfully');
```

### 3. Event Testing
```javascript
// Test theme change handling
window.eventBus.emit('themeChanged', {
    themeId: 'night',
    theme: window.themeManager.getTheme('night')
});
// Verify your module updates correctly
```

## Common Pitfalls

### 1. Hardcoded Colors
```css
/* ❌ Don't do this */
.my-element {
    background: #0078d4;
}

/* ✅ Do this instead */
.my-element {
    background: var(--os-accent);
}
```

### 2. Ignoring Theme Changes
```javascript
// ❌ Don't ignore theme changes
class BadModule {
    init() {
        // No theme change listener
    }
}

// ✅ Listen for theme changes
class GoodModule {
    init() {
        this.eventBus.on('themeChanged', (data) => {
            this.updateTheme(data.theme);
        });
    }
}
```

### 3. Not Cleaning Up
```javascript
// ❌ Don't forget cleanup
class BadModule {
    destroy() {
        // No cleanup code
    }
}

// ✅ Proper cleanup
class GoodModule {
    destroy() {
        // Remove event listeners
        this.eventBus.off('themeChanged', this.handleThemeChange);
        
        // Clear timers
        if (this.timer) {
            clearTimeout(this.timer);
        }
        
        // Remove DOM elements
        if (this.element) {
            this.element.remove();
        }
    }
}
```

## Conclusion

By following this guide, you can create modules that seamlessly integrate with the WebOS theme system and maintain consistency across the entire platform. Remember to always use theme variables, listen for theme changes, and test your modules thoroughly with different themes. 