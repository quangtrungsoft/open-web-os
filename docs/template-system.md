# Template System Documentation

## Overview

The WebOS now uses a template system that separates UI (HTML) from logic (JavaScript). This provides better maintainability, reusability, and cleaner code organization.

## File Structure

```
templates/
├── apps/
│   ├── about-me.html
│   ├── notepad.html
│   ├── calculator.html
│   └── ...
├── ui/
│   ├── dialogs/
│   ├── menus/
│   └── ...
└── components/
    ├── buttons/
    ├── forms/
    └── ...
```

## Template Loader

The `TemplateLoader` class handles loading HTML templates from separate files.

### Basic Usage

```javascript
// Initialize template loader
const templateLoader = new TemplateLoader();

// Load a single template
const template = await templateLoader.loadTemplate('apps/about-me.html');

// Load multiple templates
const templates = await templateLoader.loadTemplates([
    'apps/notepad.html',
    'apps/calculator.html'
]);

// Preload templates for better performance
await templateLoader.preloadTemplates([
    'apps/about-me.html',
    'apps/notepad.html'
]);
```

### Template Caching

Templates are automatically cached after first load for better performance:

```javascript
// Check if template is cached
if (templateLoader.isCached('apps/about-me.html')) {
    console.log('Template is cached');
}

// Get cached template
const cached = templateLoader.getCachedTemplate('apps/about-me.html');

// Clear cache if needed
templateLoader.clearCache();
```

## Creating App Templates

### 1. Create HTML Template

Create a new HTML file in `templates/apps/`:

```html
<!-- templates/apps/my-app.html -->
<div class="window-content my-app-content">
    <div class="app-header">
        <h1>My App</h1>
    </div>
    <div class="app-body">
        <p>This is my app content.</p>
    </div>
</div>
```

### 2. Create JavaScript App Module

```javascript
// js/modules/apps/my-app.js
class MyApp {
    constructor() {
        this.appId = 'my-app';
        this.appName = 'My App';
        this.appIcon = '📱';
        this.templateLoader = window.templateLoader;
    }

    async open() {
        try {
            // Load template from file
            const windowContent = await this.templateLoader.loadTemplate('apps/my-app.html');
            
            // Create window
            window.eventBus.emit('createWindow', {
                title: this.appName,
                content: windowContent,
                width: 600,
                height: 400,
                centered: true
            });
        } catch (error) {
            console.error('Failed to open My App:', error);
        }
    }
}

window.MyApp = MyApp;
```

### 3. Register the App

Add the app to the module configuration in `index.html`:

```javascript
window.WINDOWS_MODULES = {
    apps: {
        myApp: true  // Enable your app
    }
};
```

And include the script:

```html
<script src="js/modules/apps/my-app.js"></script>
```

## Template Best Practices

### 1. Structure

- Use semantic HTML
- Include proper CSS classes
- Keep templates focused on presentation

### 2. Naming Conventions

- Template files: `kebab-case.html`
- CSS classes: `app-name-component`
- JavaScript classes: `PascalCase`

### 3. Error Handling

```javascript
try {
    const template = await this.templateLoader.loadTemplate('apps/my-app.html');
    // Use template
} catch (error) {
    console.error('Template loading failed:', error);
    // Fallback content
    const fallbackContent = '<div class="error">Failed to load app</div>';
}
```

### 4. Performance

- Preload frequently used templates
- Use template caching
- Keep templates lightweight

## Advanced Features

### Dynamic Content

Templates can include placeholders for dynamic content:

```html
<!-- Template with placeholders -->
<div class="user-profile">
    <h2>{{userName}}</h2>
    <p>{{userEmail}}</p>
</div>
```

```javascript
// Replace placeholders
const template = await this.templateLoader.loadTemplate('user-profile.html');
const content = template
    .replace('{{userName}}', 'John Doe')
    .replace('{{userEmail}}', 'john@example.com');
```

### Template Inheritance

Create base templates and extend them:

```html
<!-- templates/base/window.html -->
<div class="window-content {{appClass}}">
    <div class="app-header">
        <h1>{{appTitle}}</h1>
    </div>
    <div class="app-body">
        {{appContent}}
    </div>
</div>
```

## Benefits

1. **Separation of Concerns**: UI and logic are separate
2. **Reusability**: Templates can be reused across apps
3. **Maintainability**: Easier to update UI without touching code
4. **Performance**: Templates are cached after first load
5. **Scalability**: Easy to add new apps and templates
6. **Collaboration**: Designers can work on templates independently

## Migration Guide

To migrate existing apps with inline HTML:

1. Extract HTML to template file
2. Update app to use `templateLoader.loadTemplate()`
3. Make `open()` method async
4. Add error handling
5. Test the app

Example migration:

```javascript
// Before (inline HTML)
open() {
    const content = `<div>Hello World</div>`;
    // Create window
}

// After (template file)
async open() {
    try {
        const content = await this.templateLoader.loadTemplate('apps/hello.html');
        // Create window
    } catch (error) {
        console.error('Failed to load template:', error);
    }
}
``` 