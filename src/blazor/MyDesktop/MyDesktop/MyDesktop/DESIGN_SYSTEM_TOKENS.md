# Design System Tokens

## Tổng quan

Tài liệu này mô tả tất cả các CSS custom properties (tokens) được sử dụng trong design system của ứng dụng Blazor Desktop.

## Core Design Tokens

### Colors

#### Primary Colors
```css
--color-primary: #007bff
--color-primary-light: #4da6ff
--color-primary-dark: #0056b3
```

#### Surface Colors
```css
--color-surface-primary: #ffffff
--color-surface-secondary: #f8f9fa
--color-surface-tertiary: #e9ecef
--color-surface-hover: #e9ecef
--color-surface-active: #dee2e6
```

#### Text Colors
```css
--color-text-primary: #212529
--color-text-secondary: #6c757d
--color-text-tertiary: #adb5bd
--color-text-muted: #6c757d
--color-text-inverse: #ffffff
```

#### Border Colors
```css
--color-border-primary: #dee2e6
--color-border-secondary: #e9ecef
--color-border-focus: #007bff
```

#### Semantic Colors
```css
--color-success: #28a745
--color-warning: #ffc107
--color-error: #dc3545
--color-info: #17a2b8
```

### Typography

#### Font Families
```css
--typography-font-family-primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
--typography-font-family-secondary: Georgia, 'Times New Roman', serif
--typography-font-family-mono: 'Courier New', Courier, monospace
```

#### Font Sizes
```css
--typography-font-size-xs: 0.75rem
--typography-font-size-sm: 0.875rem
--typography-font-size-base: 1rem
--typography-font-size-lg: 1.125rem
--typography-font-size-xl: 1.25rem
--typography-font-size-2xl: 1.5rem
--typography-font-size-3xl: 1.875rem
--typography-font-size-4xl: 2.25rem
--typography-font-size-5xl: 3rem
```

#### Font Weights
```css
--typography-font-weight-light: 300
--typography-font-weight-normal: 400
--typography-font-weight-medium: 500
--typography-font-weight-semibold: 600
--typography-font-weight-bold: 700
--typography-font-weight-extrabold: 800
```

#### Line Heights
```css
--typography-line-height-none: 1
--typography-line-height-tight: 1.25
--typography-line-height-snug: 1.375
--typography-line-height-normal: 1.5
--typography-line-height-relaxed: 1.625
--typography-line-height-loose: 2
```

### Spacing

```css
--spacing-0: 0
--spacing-1: 0.25rem
--spacing-2: 0.5rem
--spacing-3: 0.75rem
--spacing-4: 1rem
--spacing-5: 1.25rem
--spacing-6: 1.5rem
--spacing-8: 2rem
--spacing-10: 2.5rem
--spacing-12: 3rem
--spacing-16: 4rem
--spacing-20: 5rem
--spacing-24: 6rem
--spacing-32: 8rem
```

### Borders

#### Border Widths
```css
--border-width-0: 0
--border-width-1: 1px
--border-width-2: 2px
--border-width-4: 4px
```

#### Border Radius
```css
--border-radius-none: 0
--border-radius-sm: 0.125rem
--border-radius-md: 0.375rem
--border-radius-lg: 0.5rem
--border-radius-xl: 0.75rem
--border-radius-2xl: 1rem
--border-radius-full: 9999px
```

### Shadows

```css
--shadow-none: none
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Layout

#### Z-Index
```css
--layout-z-index-dropdown: 1000
--layout-z-index-sticky: 1020
--layout-z-index-fixed: 1030
--layout-z-index-modal: 1040
--layout-z-index-popover: 1050
--layout-z-index-tooltip: 1060
--layout-z-index-window: 1070
```

#### Breakpoints
```css
--layout-breakpoint-sm: 640px
--layout-breakpoint-md: 768px
--layout-breakpoint-lg: 1024px
--layout-breakpoint-xl: 1280px
```

### Animations

#### Transitions
```css
--animation-transition-all: all 0.15s ease-in-out
--animation-transition-colors: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out
--animation-transition-opacity: opacity 0.15s ease-in-out
--animation-transition-shadow: box-shadow 0.15s ease-in-out
--animation-transition-transform: transform 0.15s ease-in-out
```

#### Durations
```css
--animation-duration-fast: 0.15s
--animation-duration-normal: 0.3s
--animation-duration-slow: 0.5s
```

## Component-Specific Tokens

### Menu Bar
```css
--menu-bar-height: 2rem
--menu-bar-height-mobile: 1.75rem
--menu-bar-background: var(--color-surface-primary)
--menu-bar-text-color: var(--color-text-primary)
--menu-bar-font-size: var(--typography-font-size-sm)
--menu-bar-font-weight: var(--typography-font-weight-medium)
--menu-bar-backdrop-filter: blur(10px)
--menu-bar-border-bottom: 1px solid var(--color-border-primary)

--menu-item-padding: var(--spacing-2) var(--spacing-3)
--menu-item-border-radius: var(--border-radius-sm)
--menu-item-hover-background: var(--color-surface-hover)
--menu-item-hover-text-color: var(--color-text-primary)
--menu-item-active-background: var(--color-surface-active)

--menu-apple-font-size: var(--typography-font-size-lg)
--menu-divider-height: 1rem
--menu-divider-color: var(--color-border-secondary)

--menu-status-text-color: var(--color-text-secondary)
--menu-status-font-size: var(--typography-font-size-xs)

--menu-control-btn-color: var(--color-text-secondary)
--menu-control-btn-font-size: var(--typography-font-size-sm)
--menu-control-btn-padding: var(--spacing-1)
--menu-control-btn-border-radius: var(--border-radius-sm)
--menu-control-btn-size: 1.5rem
--menu-control-btn-hover-background: var(--color-surface-hover)
--menu-control-btn-hover-color: var(--color-text-primary)
--menu-control-btn-active-background: var(--color-surface-active)

--menu-dropdown-background: var(--color-surface-primary)
--menu-dropdown-border: 1px solid var(--color-border-primary)
--menu-dropdown-border-radius: var(--border-radius-lg)
--menu-dropdown-shadow: var(--shadow-lg)
--menu-dropdown-min-width: 200px
--menu-dropdown-backdrop-filter: blur(10px)

--menu-dropdown-item-padding: var(--spacing-3) var(--spacing-4)
--menu-dropdown-item-text-color: var(--color-text-primary)
--menu-dropdown-item-font-size: var(--typography-font-size-sm)
--menu-dropdown-item-hover-background: var(--color-surface-hover)
--menu-dropdown-item-active-background: var(--color-surface-active)

--menu-dropdown-icon-size: 1rem
--menu-dropdown-icon-font-size: var(--typography-font-size-sm)
--menu-dropdown-text-font-weight: var(--typography-font-weight-medium)
--menu-dropdown-divider-color: var(--color-border-secondary)
```

### Desktop
```css
--desktop-background: var(--color-background)
--desktop-text-color: var(--color-text-primary)
--desktop-padding-top: var(--menu-bar-height, 2rem)
--desktop-background-pattern: none
--desktop-background-size: cover
--desktop-background-position: center
--desktop-background-repeat: no-repeat
--desktop-background-opacity: 0.1

--desktop-icons-padding: var(--spacing-8)
--desktop-icons-max-width: 800px
--desktop-icon-min-width: 120px
--desktop-icon-gap: var(--spacing-6)
--desktop-icon-padding: var(--spacing-2)
--desktop-icon-border-radius: var(--border-radius-lg)
--desktop-icon-hover-background: var(--color-surface-hover)
--desktop-icon-active-background: var(--color-surface-active)
--desktop-icon-content-gap: var(--spacing-2)
--desktop-icon-max-width: 100px

--desktop-icon-size: 64px
--desktop-icon-background: var(--color-surface-primary)
--desktop-icon-border: 1px solid var(--color-border-primary)
--desktop-icon-image-border-radius: var(--border-radius-lg)
--desktop-icon-shadow: var(--shadow-sm)
--desktop-icon-backdrop-filter: blur(10px)
--desktop-icon-hover-border-color: var(--color-border-focus)
--desktop-icon-hover-shadow: var(--shadow-md)

--desktop-icon-symbol-size: 2rem
--desktop-icon-label-font-size: var(--typography-font-size-sm)
--desktop-icon-label-font-weight: var(--typography-font-weight-medium)
--desktop-icon-label-color: var(--color-text-primary)
--desktop-icon-label-line-height: 1.2
```

### Dock
```css
--dock-bottom-position: var(--spacing-6)
--dock-background: var(--color-surface-primary)
--dock-border: 1px solid var(--color-border-primary)
--dock-border-radius: var(--border-radius-xl)
--dock-shadow: var(--shadow-lg)
--dock-padding: var(--spacing-2) var(--spacing-4)
--dock-backdrop-filter: blur(20px)
--dock-hover-shadow: var(--shadow-xl)
--dock-icon-gap: var(--spacing-3)

--dock-icon-size: 48px
--dock-icon-border-radius: var(--border-radius-lg)
--dock-icon-background: var(--color-surface-secondary)
--dock-icon-border: 1px solid transparent
--dock-icon-hover-background: var(--color-surface-hover)
--dock-icon-hover-border-color: var(--color-border-focus)
--dock-icon-hover-shadow: var(--shadow-md)
--dock-icon-active-background: var(--color-surface-active)
--dock-icon-content-gap: var(--spacing-1)

--dock-icon-image-size: 24px
--dock-icon-symbol-size: 1.5rem
--dock-icon-filter: none
--dock-icon-hover-filter: brightness(1.1)
--dock-icon-dark-filter: invert(1) brightness(0.9)
--dock-icon-dark-hover-filter: invert(1) brightness(1.1)

--dock-icon-label-font-size: var(--typography-font-size-xs)
--dock-icon-label-color: var(--color-text-secondary)
--dock-icon-label-font-weight: var(--typography-font-weight-medium)

--dock-icon-active-background: var(--color-primary)
--dock-icon-active-border-color: var(--color-primary)
--dock-icon-active-filter: brightness(0) invert(1)

--dock-indicator-size: 4px
--dock-indicator-color: var(--color-primary)
--dock-indicator-shadow: var(--shadow-sm)
```

### Window Frame
```css
--window-frame-background: var(--color-surface-primary)
--window-frame-text-color: var(--color-text-primary)
--window-frame-border: 1px solid var(--color-border-primary)
--window-frame-border-radius: var(--border-radius-lg)
--window-frame-shadow: var(--shadow-lg)
--window-frame-min-width: 300px
--window-frame-min-height: 200px
--window-frame-max-width: 90vw
--window-frame-max-height: 90vh
--window-frame-backdrop-filter: blur(10px)
--window-frame-active-border-color: var(--color-border-focus)
--window-frame-active-shadow: var(--shadow-xl)

--window-titlebar-height: 2.5rem
--window-titlebar-background: var(--color-surface-secondary)
--window-titlebar-padding: 0 var(--spacing-4)
--window-titlebar-border-bottom: 1px solid var(--color-border-primary)
--window-titlebar-font-size: var(--typography-font-size-sm)
--window-titlebar-font-weight: var(--typography-font-weight-medium)

--window-control-btn-color: var(--color-text-secondary)
--window-control-btn-font-size: var(--typography-font-size-sm)
--window-control-btn-border-radius: var(--border-radius-sm)
--window-control-btn-size: 1.5rem
--window-control-btn-hover-background: var(--color-surface-hover)
--window-control-btn-hover-color: var(--color-text-primary)
--window-control-btn-active-background: var(--color-surface-active)

--window-close-btn-hover-background: var(--color-error)
--window-close-btn-hover-color: var(--color-text-inverse)
--window-minimize-btn-hover-background: var(--color-warning)
--window-minimize-btn-hover-color: var(--color-text-inverse)
--window-maximize-btn-hover-background: var(--color-success)
--window-maximize-btn-hover-color: var(--color-text-inverse)

--window-title-icon-size: var(--typography-font-size-sm)
--window-title-color: var(--color-text-primary)

--window-action-btn-color: var(--color-text-secondary)
--window-action-btn-font-size: var(--typography-font-size-sm)
--window-action-btn-border-radius: var(--border-radius-sm)
--window-action-btn-size: 1.5rem
--window-action-btn-hover-background: var(--color-surface-hover)
--window-action-btn-hover-color: var(--color-text-primary)

--window-content-padding: var(--spacing-4)
--window-content-background: var(--color-surface-primary)

--window-scrollbar-width: 8px
--window-scrollbar-height: 8px
--window-scrollbar-track-background: var(--color-surface-secondary)
--window-scrollbar-border-radius: 4px
--window-scrollbar-thumb-background: var(--color-border-secondary)
--window-scrollbar-thumb-border-radius: 4px
--window-scrollbar-thumb-min-height: 40px
--window-scrollbar-thumb-min-width: 40px
--window-scrollbar-thumb-hover: var(--color-border-primary)
--window-scrollbar-thumb-active: var(--color-text-tertiary)

--window-resize-handle-hover-background: rgba(0, 0, 0, 0.1)
```

### Layout
```css
--layout-background: var(--color-background)
--layout-text-color: var(--color-text-primary)

--theme-selector-top: calc(var(--menu-bar-height, 2rem) + var(--spacing-3))
--theme-selector-right: var(--spacing-6)
--theme-selector-background: var(--color-surface-primary)
--theme-selector-border: 1px solid var(--color-border-primary)
--theme-selector-border-radius: var(--border-radius-lg)
--theme-selector-shadow: var(--shadow-md)
--theme-selector-backdrop-filter: blur(10px)
--theme-selector-padding: var(--spacing-2)
```

## Usage Guidelines

### 1. Token Naming Convention
- Use kebab-case for all token names
- Prefix with component name for component-specific tokens
- Use semantic names that describe the purpose, not the value

### 2. Fallback Values
- Always provide fallback values using CSS custom property fallbacks
- Use design system tokens as fallbacks for component-specific tokens

### 3. Responsive Design
- Use breakpoint tokens for media queries
- Adjust component tokens for different screen sizes

### 4. Theme Switching
- All tokens should be themeable
- Use semantic color tokens instead of hardcoded values
- Test tokens with different themes

### 5. Accessibility
- Ensure sufficient color contrast ratios
- Use focus ring tokens for keyboard navigation
- Maintain consistent spacing and sizing

## Best Practices

1. **Consistency**: Use the same token across similar UI elements
2. **Semantic**: Choose tokens based on meaning, not appearance
3. **Maintainability**: Update tokens in one place to affect the entire system
4. **Performance**: Use CSS custom properties for dynamic theming
5. **Documentation**: Keep this token reference updated as the system evolves 