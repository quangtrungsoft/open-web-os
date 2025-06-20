# WebOS Theme System

## Overview

The WebOS Theme System provides a centralized, modular approach to theme management with dynamic loading capabilities. It integrates seamlessly with the core `ThemeManager` class for consistency, synchronization, and unified deployment from a single centralized location.

## Architecture

### Core Components

1. **ThemeManager** (`modules/core/theme-manager/theme-manager.js`)
   - Centralized theme management and coordination
   - Dynamic theme loading and application
   - Event-driven theme switching
   - Local storage persistence

2. **Theme Classes** (`modules/ui/themes/[theme-name]/[theme-name].js`)
   - Individual theme implementations
   - Custom styling and interactions
   - Theme-specific animations and effects

3. **Theme CSS** (`modules/ui/themes/[theme-name]/[theme-name].css`)
   - Theme-specific stylesheets
   - CSS custom properties and variables
   - Responsive design considerations

4. **Context Menu Integration**
   - Theme selection interface
   - Real-time theme switching
   - Visual feedback and indicators

## Theme Structure

Each theme follows a consistent structure:

```
modules/ui/themes/
├── classic/
│   ├── classic.css
│   └── classic.js
├── night/
│   ├── night.css
│   └── night.js
├── professional/
│   ├── professional.css
│   └── professional.js
├── sunset/
│   ├── sunset.css
│   └── sunset.js
└── ocean/
    ├── ocean.css
    └── ocean.js
```

## Theme Class Interface

All theme classes must implement the following interface:

```javascript
class ThemeName {
    constructor() {
        this.name = 'Theme Display Name';
        this.id = 'theme-id';
    }

    // Initialize theme (optional)
    init() {
        // Theme initialization logic
    }

    // Apply theme styles and effects
    apply() {
        // Apply CSS custom properties
        // Set up theme-specific interactions
        // Initialize animations
    }

    // Remove theme (cleanup)
    remove() {
        // Clean up event listeners
        // Remove theme-specific elements
        // Reset to default state
    }
}
```

## Available Themes

### 1. Classic Theme
- **ID**: `classic`
- **Description**: Classic WebOS blue theme with traditional styling
- **Features**: Gradient backgrounds, classic color scheme

### 2. Night Theme
- **ID**: `night`
- **Description**: Modern dark theme for better eye comfort
- **Features**: Dark backgrounds, reduced eye strain

### 3. Professional Theme
- **ID**: `professional`
- **Description**: Clean and bright professional theme
- **Features**: Light backgrounds, professional appearance

### 4. Sunset Theme
- **ID**: `sunset`
- **Description**: Warm sunset colors
- **Features**: Orange and pink gradients, warm aesthetics

### 5. Ocean Theme
- **ID**: `ocean`
- **Description**: Deep ocean blues
- **Features**: Blue gradients, oceanic color palette

## Usage

### Switching Themes via Context Menu

1. Right-click on the desktop
2. Navigate to "Themes" submenu
3. Select desired theme
4. Theme applies immediately with smooth transitions

### Programmatic Theme Switching

```javascript
// Using the centralized ThemeManager
window.themeManager.applyTheme('night');

// Using event bus
window.eventBus.emit('changeTheme', { themeId: 'ocean' });
```

### Getting Theme Information

```javascript
// Get current theme
const currentTheme = window.themeManager.getCurrentTheme();

// Get all available themes
const allThemes = window.themeManager.getAllThemes();

// Get theme statistics
const stats = window.themeManager.getStats();
```

## Events

The theme system emits and listens to the following events:

### Emitted Events

- `themeChanged`: Fired when a theme is successfully applied
  ```javascript
  {
    themeId: 'night',
    theme: { /* theme configuration */ },
    instance: { /* theme instance */ }
  }
  ```

- `themesList`: Fired when theme list is requested
  ```javascript
  {
    themes: [/* array of theme configurations */],
    currentTheme: 'classic'
  }
  ```

- `currentThemeInfo`: Fired when current theme info is requested
  ```javascript
  {
    theme: { /* current theme configuration */ },
    instance: { /* current theme instance */ }
  }
  ```

### Listened Events

- `changeTheme`: Request to change theme
  ```javascript
  { themeId: 'professional' }
  ```

- `getThemes`: Request for theme list
- `getCurrentTheme`: Request for current theme information

## Creating New Themes

### Step 1: Create Theme Directory

```bash
mkdir modules/ui/themes/your-theme-name
```

### Step 2: Create CSS File

```css
/* modules/ui/themes/your-theme-name/your-theme-name.css */

:root {
    /* Define your theme's CSS custom properties */
    --os-bg: #your-color;
    --os-accent: #your-accent-color;
    /* ... other properties */
}

/* Theme-specific styles */
.your-theme-specific-class {
    /* Custom styling */
}
```

### Step 3: Create JavaScript File

```javascript
// modules/ui/themes/your-theme-name/your-theme-name.js

class YourThemeName {
    constructor() {
        this.name = 'Your Theme Name';
        this.id = 'your-theme-name';
    }

    apply() {
        // Apply your theme
        const root = document.documentElement;
        
        // Set CSS custom properties
        root.style.setProperty('--os-bg', '#your-color');
        // ... set other properties
        
        // Add theme-specific elements or interactions
        this.addThemeElements();
    }

    remove() {
        // Clean up theme-specific elements
        this.removeThemeElements();
    }

    addThemeElements() {
        // Add any theme-specific DOM elements
    }

    removeThemeElements() {
        // Remove theme-specific DOM elements
    }
}

// Register the theme class globally
window.YourThemeName = YourThemeName;
```

### Step 4: Register in ThemeManager

Add your theme to the `initializeDefaultThemes()` method in `ThemeManager`:

```javascript
this.addTheme('your-theme-name', {
    name: 'Your Theme Name',
    description: 'Description of your theme',
    class: 'YourThemeName',
    cssPath: 'modules/ui/themes/your-theme-name/your-theme-name.css',
    jsPath: 'modules/ui/themes/your-theme-name/your-theme-name.js',
    colors: {
        '--os-bg': '#your-color',
        // ... other color properties
    },
    desktop: {
        background: 'your-desktop-background'
    }
});
```

### Step 5: Add Script Tag

Add your theme script to `index.html`:

```html
<script src="modules/ui/themes/your-theme-name/your-theme-name.js"></script>
```

## Best Practices

### 1. CSS Custom Properties
- Use CSS custom properties for all theme colors
- Provide fallback values for better compatibility
- Use semantic property names

### 2. Performance
- Minimize DOM manipulation in theme classes
- Use CSS transitions for smooth theme switching
- Clean up resources in the `remove()` method

### 3. Accessibility
- Ensure sufficient color contrast ratios
- Provide alternative color schemes for accessibility
- Test themes with screen readers

### 4. Responsive Design
- Design themes to work across different screen sizes
- Use relative units (rem, em, %) instead of fixed pixels
- Test themes on various devices

### 5. Error Handling
- Implement proper error handling in theme classes
- Provide fallback themes when loading fails
- Log errors for debugging

## Troubleshooting

### Theme Not Loading
1. Check browser console for JavaScript errors
2. Verify theme class is properly registered globally
3. Ensure theme paths are correct in ThemeManager
4. Check if theme script is included in index.html

### Theme Not Applying
1. Verify CSS custom properties are being set
2. Check if theme class `apply()` method is called
3. Ensure no CSS conflicts with existing styles
4. Verify theme configuration in ThemeManager

### Performance Issues
1. Check for memory leaks in theme classes
2. Ensure proper cleanup in `remove()` method
3. Optimize CSS selectors and properties
4. Use CSS transforms instead of layout changes

## Integration with Core System

The theme system is fully integrated with the WebOS core:

- **EventBus**: For theme change notifications and coordination
- **ModuleLoader**: For dynamic theme loading
- **ContextMenu**: For theme selection interface
- **LocalStorage**: For theme persistence
- **WindowManager**: For theme-aware window styling

This centralized approach ensures consistency, synchronization, and unified deployment from a single location, making the theme system robust and maintainable. 