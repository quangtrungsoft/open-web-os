# WebOS Theme System

## Overview

WebOS uses a comprehensive, unified theme system that ensures all apps, features, and modules automatically sync with the current theme. This system is designed to be:

- **Centralized**: Single source of truth for all theme variables
- **Dynamic**: Real-time theme switching without page reload
- **Extensible**: Easy to add new themes and customize existing ones
- **Consistent**: All UI elements follow the same design language

## Core Principles

### 1. CSS Custom Properties (Variables)
All colors, backgrounds, borders, and other visual properties are defined using CSS custom properties on the `:root` element. This ensures:

- **Global consistency**: All elements use the same color palette
- **Easy theming**: Change one variable, update everywhere
- **Performance**: No JavaScript required for basic theming

### 2. Theme Manager
The `ThemeManager` class is responsible for:
- Managing theme definitions
- Applying themes dynamically
- Emitting theme change events
- Persisting theme preferences

### 3. Event-Driven Updates
When themes change, the system emits events that modules can listen to for custom updates (e.g., canvas drawings, SVGs).

## Theme Structure

### Available Themes

1. **Classic** - Default blue theme with modern aesthetics
2. **Night** - Dark theme for better eye comfort
3. **Professional** - Clean light theme for productivity
4. **Sunset** - Warm orange/pink gradient theme
5. **Ocean** - Deep blue ocean-inspired theme

### Theme Configuration

Each theme defines:
```javascript
{
  name: 'Theme Name',
  description: 'Theme description',
  colors: {
    '--os-bg': '#0078d4',           // Primary background
    '--os-bg-dark': '#106ebe',      // Dark background
    '--os-accent': '#0078d4',       // Primary accent
    '--os-accent-light': '#40a9ff', // Light accent
    '--os-accent-dark': '#005a9e',  // Dark accent
    '--os-text': '#323130',         // Primary text
    '--os-text-secondary': '#605e5c', // Secondary text
    '--os-text-light': '#ffffff',   // Light text
    '--os-border': '#e1dfdd',       // Primary border
    '--os-border-light': '#f3f2f1', // Light border
    '--os-shadow': 'rgba(0, 0, 0, 0.1)', // Primary shadow
    '--os-shadow-dark': 'rgba(0, 0, 0, 0.2)', // Dark shadow
    // ... more variables
  },
  desktop: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
}
```

## CSS Variable Naming Convention

All theme variables follow the `--os-*` naming pattern:

- `--os-bg*` - Background colors
- `--os-accent*` - Accent colors
- `--os-text*` - Text colors
- `--os-border*` - Border colors
- `--os-shadow*` - Shadow colors

## Usage Guidelines

### For CSS/SCSS

**✅ Correct - Use theme variables:**
```css
.my-component {
  background: var(--os-bg);
  color: var(--os-text);
  border: 1px solid var(--os-border);
  box-shadow: var(--os-shadow);
}
```

**❌ Incorrect - Hardcoded colors:**
```css
.my-component {
  background: #0078d4;  /* Don't do this! */
  color: #323130;       /* Don't do this! */
}
```

### For JavaScript

**Listening for theme changes:**
```javascript
// Listen for theme changes
window.eventBus.on('themeChanged', ({ themeId, theme }) => {
  // Update custom UI elements that can't use CSS variables
  updateCustomCanvas(theme);
  updateSVGIcons(theme);
});
```

**Getting current theme:**
```javascript
const currentTheme = window.themeManager.getCurrentTheme();
const allThemes = window.themeManager.getAllThemes();
```

### For New Modules

When creating a new module, follow these steps:

1. **Use only theme variables** in your CSS
2. **Listen for theme changes** if you have custom rendering
3. **Test with different themes** to ensure consistency

Example module structure:
```javascript
class MyModule {
  init() {
    // Listen for theme changes
    this.eventBus.on('themeChanged', (data) => {
      this.updateTheme(data.theme);
    });
  }
  
  updateTheme(theme) {
    // Update any custom UI elements
    this.updateCustomElements(theme);
  }
}
```

## Adding New Themes

### 1. Define the Theme
```javascript
const newTheme = {
  name: 'My Custom Theme',
  description: 'A beautiful custom theme',
  colors: {
    '--os-bg': '#your-color',
    '--os-accent': '#your-accent',
    // ... define all required variables
  },
  desktop: {
    background: 'your-desktop-background'
  }
};
```

### 2. Register the Theme
```javascript
window.themeManager.addTheme('my-theme', newTheme);
```

### 3. Apply the Theme
```javascript
window.themeManager.applyTheme('my-theme');
```

## Theme Persistence

Themes are automatically saved to localStorage and restored on page reload:

- **Storage key**: `webos-theme`
- **Default theme**: `classic`
- **Fallback**: If saved theme is invalid, defaults to `classic`

## Best Practices

### 1. Always Use Theme Variables
- Never hardcode colors in CSS
- Use semantic variable names
- Test with all available themes

### 2. Handle Theme Changes
- Listen for `themeChanged` events
- Update custom UI elements
- Maintain accessibility standards

### 3. Design for Consistency
- Follow the established color hierarchy
- Use appropriate contrast ratios
- Consider both light and dark themes

### 4. Performance Considerations
- CSS variables are performant
- Avoid JavaScript-based theme switching
- Use CSS transitions for smooth theme changes

## Troubleshooting

### Common Issues

1. **Theme not applying**: Check if all required variables are defined
2. **Inconsistent colors**: Ensure you're using theme variables, not hardcoded values
3. **Performance issues**: Avoid JavaScript-based theme switching for basic colors

### Debugging

```javascript
// Check current theme
console.log(window.themeManager.getCurrentTheme());

// List all available themes
console.log(window.themeManager.getAllThemes());

// Check if theme variables are applied
console.log(getComputedStyle(document.documentElement).getPropertyValue('--os-bg'));
```

## Future Enhancements

- [ ] Theme import/export functionality
- [ ] Custom theme builder UI
- [ ] Theme marketplace
- [ ] Advanced color schemes (monochrome, high contrast)
- [ ] Automatic theme detection based on system preferences
- [ ] Theme preview system

## Conclusion

The WebOS theme system provides a robust, scalable foundation for consistent theming across all applications and features. By following these guidelines, developers can ensure their modules integrate seamlessly with the overall design system while maintaining the flexibility to create unique and beautiful user experiences. 