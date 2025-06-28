# Design System Guide

## Tổng quan

Design System này cung cấp một bộ CSS variables và utility classes để tạo ra giao diện nhất quán và có thể tùy chỉnh trong ứng dụng Blazor.

## Cách sử dụng CSS Variables

### 1. Sử dụng trực tiếp trong style attribute

```razor
<div style="background-color: var(--color-surface-primary); color: var(--color-text-primary);">
    Content here
</div>
```

### 2. Sử dụng trong CSS classes

```razor
<div class="my-custom-component">
    <h1 class="component-title">Title</h1>
</div>

<style>
.my-custom-component {
    background: var(--color-surface-primary);
    padding: var(--spacing-4);
    border-radius: var(--border-radius-lg);
}

.component-title {
    color: var(--color-text-primary);
    font-size: var(--typography-font-size-2xl);
    font-weight: var(--typography-font-weight-bold);
    margin-bottom: var(--spacing-4);
}
</style>
```

### 3. Sử dụng trong @code block

```razor
@code {
    private string GetThemeStyle()
    {
        return "background-color: var(--color-surface-primary); " +
               "color: var(--color-text-primary); " +
               "padding: var(--spacing-4); " +
               "border-radius: var(--border-radius-md);";
    }
}

<div style="@GetThemeStyle()">
    Dynamic themed content
</div>
```

## Utility Classes

### Background Colors
- `.bg-primary` - Primary surface color
- `.bg-secondary` - Secondary surface color
- `.bg-tertiary` - Tertiary surface color
- `.bg-hover` - Hover state color
- `.bg-active` - Active state color
- `.bg-background` - Background color

### Text Colors
- `.text-primary` - Primary text color
- `.text-secondary` - Secondary text color
- `.text-tertiary` - Tertiary text color
- `.text-muted` - Muted text color
- `.text-inverse` - Inverse text color

### Spacing
- `.p-{size}` - Padding (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32)
- `.px-{size}` - Horizontal padding
- `.py-{size}` - Vertical padding
- `.m-{size}` - Margin
- `.mx-{size}` - Horizontal margin
- `.my-{size}` - Vertical margin

### Typography
- `.text-{size}` - Font size (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl)
- `.font-{weight}` - Font weight (light, normal, medium, semibold, bold, extrabold)
- `.font-{family}` - Font family (primary, secondary, mono)

### Borders
- `.border-{color}` - Border color (primary, secondary, focus, error, warning, success)
- `.border-{width}` - Border width (0, 1, 2, 4)
- `.rounded-{size}` - Border radius (none, sm, md, lg, xl, 2xl, full)

### Shadows
- `.shadow-{size}` - Box shadow (none, sm, md, lg, xl, 2xl)

### Layout
- `.z-{type}` - Z-index (dropdown, sticky, fixed, modal, popover, tooltip, window)

## Component Classes

### Buttons
```razor
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-success">Success Button</button>
<button class="btn btn-warning">Warning Button</button>
<button class="btn btn-error">Error Button</button>
```

### Cards
```razor
<div class="card">
    <div class="card-header">
        <h3>Card Header</h3>
    </div>
    <div class="card-body">
        <p>Card content</p>
    </div>
    <div class="card-footer">
        <button class="btn btn-primary">Action</button>
    </div>
</div>
```

### Form Elements
```razor
<input type="text" class="input" placeholder="Enter text..." />
```

## Responsive Design

### Breakpoints
- `--layout-breakpoint-sm`: 640px
- `--layout-breakpoint-md`: 768px
- `--layout-breakpoint-lg`: 1024px

### Responsive Utilities
```razor
<div class="hidden md:block">Visible on medium screens and up</div>
<div class="block md:hidden">Visible on small screens only</div>
```

## Animations

### Transition Classes
- `.transition-all` - All properties
- `.transition-colors` - Color properties only
- `.transition-opacity` - Opacity only
- `.transition-shadow` - Shadow only
- `.transition-transform` - Transform only

### Animation Classes
- `.animate-fade-in` - Fade in animation
- `.animate-slide-up` - Slide up animation
- `.animate-scale-in` - Scale in animation

## Theme Variables

### Color Palette
```css
/* Primary Colors */
--color-primary: #007bff;
--color-primary-light: #4da6ff;
--color-primary-dark: #0056b3;

/* Surface Colors */
--color-surface-primary: #ffffff;
--color-surface-secondary: #f8f9fa;
--color-surface-tertiary: #e9ecef;
--color-surface-hover: #e9ecef;
--color-surface-active: #dee2e6;

/* Text Colors */
--color-text-primary: #212529;
--color-text-secondary: #6c757d;
--color-text-tertiary: #adb5bd;
--color-text-muted: #6c757d;
--color-text-inverse: #ffffff;

/* Border Colors */
--color-border-primary: #dee2e6;
--color-border-secondary: #e9ecef;
--color-border-focus: #007bff;
```

### Typography
```css
/* Font Families */
--typography-font-family-primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
--typography-font-family-secondary: Georgia, 'Times New Roman', serif;
--typography-font-family-mono: 'Courier New', Courier, monospace;

/* Font Sizes */
--typography-font-size-xs: 0.75rem;
--typography-font-size-sm: 0.875rem;
--typography-font-size-base: 1rem;
--typography-font-size-lg: 1.125rem;
--typography-font-size-xl: 1.25rem;
--typography-font-size-2xl: 1.5rem;
--typography-font-size-3xl: 1.875rem;
--typography-font-size-4xl: 2.25rem;
--typography-font-size-5xl: 3rem;
```

### Spacing
```css
--spacing-0: 0;
--spacing-1: 0.25rem;
--spacing-2: 0.5rem;
--spacing-3: 0.75rem;
--spacing-4: 1rem;
--spacing-5: 1.25rem;
--spacing-6: 1.5rem;
--spacing-8: 2rem;
--spacing-10: 2.5rem;
--spacing-12: 3rem;
--spacing-16: 4rem;
--spacing-20: 5rem;
--spacing-24: 6rem;
--spacing-32: 8rem;
```

## Best Practices

### 1. Sử dụng CSS Variables thay vì hardcode values
```css
/* ✅ Good */
.my-component {
    background: var(--color-surface-primary);
    padding: var(--spacing-4);
}

/* ❌ Bad */
.my-component {
    background: #ffffff;
    padding: 1rem;
}
```

### 2. Sử dụng utility classes cho common patterns
```razor
<!-- ✅ Good -->
<div class="card p-4">
    <h2 class="text-xl font-semibold text-primary mb-4">Title</h2>
    <p class="text-secondary">Content</p>
</div>

<!-- ❌ Bad -->
<div style="background: white; border: 1px solid #dee2e6; border-radius: 8px; padding: 1rem;">
    <h2 style="font-size: 1.25rem; font-weight: 600; color: #212529; margin-bottom: 1rem;">Title</h2>
    <p style="color: #6c757d;">Content</p>
</div>
```

### 3. Tạo component-specific styles khi cần
```razor
<style>
.my-special-component {
    /* Sử dụng design system variables */
    background: var(--color-surface-primary);
    border: var(--border-width-1) solid var(--color-border-primary);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-6);
    
    /* Component-specific styles */
    position: relative;
    overflow: hidden;
}

.my-special-component::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--color-primary);
}
</style>
```

### 4. Sử dụng responsive design
```razor
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="card">Item 1</div>
    <div class="card">Item 2</div>
    <div class="card">Item 3</div>
</div>
```

## Demo Component

Truy cập `/design-demo` để xem demo đầy đủ của design system với tất cả các components và utilities.

## Theme Switching

Design system hỗ trợ theme switching thông qua CSS variables. Các theme khác nhau có thể được định nghĩa trong file JSON và áp dụng động thông qua JavaScript interop.

```javascript
// Áp dụng theme
function applyTheme(themeData) {
    const root = document.documentElement;
    Object.entries(themeData).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });
}
``` 