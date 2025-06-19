# Modular Architecture Documentation

## Overview

The WebOS now uses a comprehensive modular architecture that separates concerns into distinct layers and modules. This provides better maintainability, scalability, and code organization.

## Architecture Layers

### 1. **UI Layer (HTML Templates)**
- **Location**: `modules/apps/{appname}/{appname}.html`
- **Purpose**: Pure presentation layer with HTML structure
- **Responsibility**: Define the visual layout and structure

### 2. **Control Layer (UI Logic)**
- **Location**: `modules/apps/{appname}/{appname}.control.js`
- **Purpose**: Handle user interactions and DOM manipulation
- **Responsibility**: Event handling, animations, UI state management

### 3. **Processor Layer (Business Logic)**
- **Location**: `modules/apps/{appname}/{appname}.processor.js`
- **Purpose**: Handle business logic and data processing
- **Responsibility**: Data management, API calls, inter-module communication

## Directory Structure

```
modules/
├── apps/                          # Application modules
│   ├── aboutme/                   # About Me app
│   │   ├── about-me.html         # UI template
│   │   ├── about-me.control.js   # UI logic
│   │   └── about-me.processor.js # Business logic
│   ├── calculator/                # Calculator app
│   │   ├── calculator.html       # UI template
│   │   ├── calculator.control.js # UI logic
│   │   └── calculator.processor.js # Business logic
│   └── notepad/                   # Notepad app
│       ├── notepad.html          # UI template
│       ├── notepad.control.js    # UI logic
│       └── notepad.processor.js  # Business logic
│
├── core/                          # Core system modules
│   ├── template-loader/           # Template loading system
│   │   └── template-loader.js
│   ├── event-bus/                 # Event communication system
│   │   └── event-bus.js
│   ├── window-manager/            # Window management system
│   │   └── window-manager.js
│   ├── taskbar/                   # Taskbar functionality
│   │   └── taskbar.js
│   └── module-loader/             # Module loading system
│       └── module-loader.js
│
├── ui/                            # UI system modules
│   ├── start-menu/                # Start menu functionality
│   │   └── start-menu.js
│   ├── desktop-icons/             # Desktop icon management
│   │   └── desktop-icons.js
│   ├── context-menu/              # Context menu system
│   │   └── context-menu.js
│   └── notifications/             # Notification system
│       └── notifications.js
│
├── features/                      # Feature modules
│   ├── drag-and-drop/             # Drag and drop functionality
│   │   └── drag-and-drop.js
│   ├── resizing/                  # Window resizing
│   │   └── resizing.js
│   ├── search/                    # Search functionality
│   │   └── search.js
│   ├── animations/                # Animation system
│   │   └── animations.js
│   └── local-storage/             # Data persistence
│       └── local-storage.js
│
└── thirdparty/                    # Third-party integrations
    ├── threejs/                   # Three.js integration
    │   └── threejs-module.js
    └── facebook/                  # Facebook integration
        └── facebook-module.js
```

## Module Communication

### Event Bus System

All modules communicate through a centralized event bus:

```javascript
// Emit events
window.eventBus.emit('appInteraction', {
    appId: 'about-me',
    type: 'contact',
    data: 'contact@example.com'
});

// Listen for events
window.eventBus.on('windowCreated', (data) => {
    console.log('Window created:', data);
});
```

### Dependency Injection

Modules receive dependencies through initialization:

```javascript
class MyAppProcessor {
    init(dependencies = {}) {
        this.templateLoader = dependencies.templateLoader || window.templateLoader;
        this.eventBus = dependencies.eventBus || window.eventBus;
        // Initialize module
    }
}
```

## Creating a New App

### 1. Create App Directory Structure

```
modules/apps/myapp/
├── myapp.html           # UI template
├── myapp.control.js     # UI logic
└── myapp.processor.js   # Business logic
```

### 2. Create HTML Template

```html
<!-- modules/apps/myapp/myapp.html -->
<div class="window-content myapp-content">
    <div class="app-header">
        <h1>My App</h1>
    </div>
    <div class="app-body">
        <p>This is my app content.</p>
    </div>
</div>
```

### 3. Create Control Layer

```javascript
// modules/apps/myapp/myapp.control.js
class MyAppControl {
    constructor(processor) {
        this.processor = processor;
        this.windowId = null;
        this.isInitialized = false;
    }

    init(windowId, windowElement) {
        this.windowId = windowId;
        this.windowElement = windowElement;
        
        this.bindEvents();
        this.setupAnimations();
        this.isInitialized = true;
    }

    bindEvents() {
        // Bind UI event listeners
        const button = this.windowElement.querySelector('.my-button');
        button.addEventListener('click', (e) => {
            this.processor.handleButtonClick();
        });
    }

    updateUI(data) {
        // Update UI with new data
    }

    destroy() {
        // Cleanup event listeners
        this.isInitialized = false;
    }
}

window.MyAppControl = MyAppControl;
```

### 4. Create Processor Layer

```javascript
// modules/apps/myapp/myapp.processor.js
class MyAppProcessor {
    constructor() {
        this.appId = 'myapp';
        this.appName = 'My App';
        this.appIcon = '📱';
        this.windowId = null;
        this.control = null;
        this.templateLoader = null;
        this.eventBus = null;
    }

    init(dependencies = {}) {
        this.templateLoader = dependencies.templateLoader || window.templateLoader;
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        this.registerApp();
        return true;
    }

    async open() {
        try {
            const windowContent = await this.templateLoader.loadTemplate('apps/myapp/myapp.html');
            
            this.eventBus.emit('createWindow', {
                id: `window-${this.appId}-${Date.now()}`,
                title: this.appName,
                icon: this.appIcon,
                content: windowContent,
                width: 600,
                height: 400,
                onWindowCreated: (windowElement) => this.onWindowCreated(windowElement)
            });
        } catch (error) {
            console.error('Failed to open My App:', error);
        }
    }

    onWindowCreated(windowElement) {
        this.control = new MyAppControl(this);
        this.control.init(this.windowId, windowElement);
    }

    handleButtonClick() {
        // Handle business logic
        console.log('Button clicked!');
    }
}

window.MyAppProcessor = MyAppProcessor;
```

### 5. Register the App

Add to `index.html`:

```html
<!-- App Modules -->
<script src="modules/apps/myapp/myapp.control.js"></script>
<script src="modules/apps/myapp/myapp.processor.js"></script>
```

And enable in module configuration:

```javascript
window.WINDOWS_MODULES = {
    apps: {
        myapp: true  // Enable your app
    }
};
```

## Core Modules

### Template Loader

Handles loading HTML templates from separate files:

```javascript
const template = await window.templateLoader.loadTemplate('apps/myapp/myapp.html');
```

### Event Bus

Centralized event communication system:

```javascript
// Emit events
window.eventBus.emit('eventName', data);

// Listen for events
window.eventBus.on('eventName', (data) => {
    // Handle event
});
```

### Window Manager

Manages window lifecycle and operations:

```javascript
window.eventBus.emit('createWindow', {
    id: 'window-id',
    title: 'Window Title',
    content: '<div>Content</div>',
    width: 600,
    height: 400
});
```

## Best Practices

### 1. Separation of Concerns

- **UI Layer**: Only HTML structure and presentation
- **Control Layer**: Only UI interactions and DOM manipulation
- **Processor Layer**: Only business logic and data processing

### 2. Event-Driven Communication

- Use the event bus for all inter-module communication
- Avoid direct module dependencies
- Emit events for state changes

### 3. Error Handling

```javascript
try {
    const template = await this.templateLoader.loadTemplate('apps/myapp/myapp.html');
    // Use template
} catch (error) {
    console.error('Template loading failed:', error);
    this.control?.showError('Failed to load app');
}
```

### 4. Resource Management

```javascript
destroy() {
    // Cleanup event listeners
    // Remove DOM elements
    // Clear timers and intervals
    this.isInitialized = false;
}
```

### 5. Performance

- Cache templates after first load
- Use event delegation for dynamic content
- Implement proper cleanup in destroy methods

## Benefits

1. **Maintainability**: Clear separation of concerns
2. **Scalability**: Easy to add new modules
3. **Testability**: Each layer can be tested independently
4. **Reusability**: Modules can be reused across apps
5. **Collaboration**: Different developers can work on different layers
6. **Performance**: Optimized loading and caching
7. **Flexibility**: Easy to enable/disable modules

## Migration Guide

To migrate existing apps to the new structure:

1. **Extract HTML** to separate template files
2. **Split JavaScript** into control and processor layers
3. **Update paths** in module configuration
4. **Test functionality** after migration
5. **Update documentation** for new structure

This modular architecture provides a solid foundation for building complex applications while maintaining code quality and developer productivity. 