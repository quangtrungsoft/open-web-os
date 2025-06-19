# WebOS - Web Operating System

A fully interactive web operating system desktop environment built with HTML, CSS, and JavaScript. Experience a modern desktop interface with working applications, taskbar, start menu, and desktop interactions.

## 🌟 Features

### Desktop Environment
- **Modern WebOS UI** - Clean and intuitive interface with Segoe UI font
- **Interactive Desktop Icons** - Click to launch applications
- **Right-click Context Menus** - Desktop and icon context menus
- **Beautiful Background** - Gradient background with blur effects

### Start Menu
- **Animated Start Menu** - Smooth open/close animations
- **App Grid Layout** - Organized application icons
- **Search Functionality** - Search through installed apps
- **Recent Apps** - Automatically tracks recently used applications
- **Power Options** - Sleep, shutdown, restart, and sign out

### Taskbar
- **Dynamic Taskbar Items** - Apps appear in taskbar when launched
- **Window Management** - Minimize/restore windows from taskbar
- **Active Window Indicators** - Visual feedback for active windows
- **System Tray** - Network, volume, battery, calendar, and notifications

### Window System
- **Draggable Windows** - Click and drag titlebars to move windows
- **Resizable Windows** - Drag corners to resize
- **Window Controls** - Minimize, maximize, and close buttons
- **Z-Index Management** - Proper window layering
- **Maximize/Restore** - Full-screen and windowed modes

### Applications
- **File Explorer** - Browse files and folders
- **Web Browser** - Web browser simulation
- **App Store** - App store interface
- **Settings** - System settings panel
- **Calculator** - Functional calculator app
- **Notepad** - Text editor with menus

### System Features
- **Local Storage** - Saves user preferences and recent apps
- **Responsive Design** - Works on different screen sizes
- **Keyboard Shortcuts** - Escape to close menus
- **Smooth Animations** - CSS transitions and transforms

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start exploring the WebOS interface!

### File Structure
```
webos/
├── index.html              # Main HTML file
├── styles/
│   ├── main.scss          # SCSS source file
│   └── main.css           # Compiled CSS
├── js/
│   ├── app.js             # Main application logic
│   ├── window-manager.js  # Window management system
│   ├── start-menu.js      # Start menu functionality
│   └── taskbar.js         # Taskbar and system tray
└── README.md              # This file
```

## 🎮 How to Use

### Basic Interactions
- **Click Start Button** - Opens the start menu
- **Click Desktop Icons** - Launches applications
- **Right-click Desktop** - Shows context menu
- **Drag Windows** - Click and drag titlebars to move
- **Resize Windows** - Drag bottom-right corner to resize

### Window Management
- **Minimize** - Click the `─` button or taskbar item
- **Maximize** - Click the `□` button or double-click titlebar
- **Close** - Click the `×` button
- **Bring to Front** - Click anywhere on a window

### Start Menu
- **Launch Apps** - Click any app icon
- **Search** - Type to filter applications
- **Power Options** - Click the power button
- **Close** - Press Escape or click outside

### System Tray
- **Network** - Click to see network options
- **Volume** - Click to adjust volume
- **Battery** - Click for power options
- **Calendar** - Click to see date/time
- **Notifications** - Click for notification center

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic markup and structure
- **CSS3** - Styling with CSS Grid, Flexbox, and custom properties
- **SCSS** - Advanced CSS preprocessing
- **Vanilla JavaScript** - No frameworks, pure ES6+ JavaScript
- **CSS Custom Properties** - Dynamic theming and variables
- **Local Storage API** - Persistent data storage

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Features
- **Efficient DOM Manipulation** - Minimal reflows and repaints
- **Event Delegation** - Optimized event handling
- **CSS Transforms** - Hardware-accelerated animations
- **Lazy Loading** - Components load on demand

## 🎨 Customization

### Themes
The application uses CSS custom properties for easy theming. Modify the `:root` variables in `styles/main.css`:

```css
:root {
  --os-accent: #0078d4;        /* Primary accent color */
  --os-bg: #0078d4;            /* Background color */
  --taskbar-bg: rgba(0, 0, 0, 0.8); /* Taskbar background */
  /* ... more variables */
}
```

### Adding New Apps
To add a new application:

1. Add app configuration in `js/app.js`:
```javascript
const appConfig = {
  name: 'myapp',
  title: 'My App',
  icon: '🎯',
  content: '<div>App content here</div>'
};
```

2. Add desktop icon in `index.html`:
```html
<div class="desktop-icon" data-app="myapp">
  <div class="icon-image">🎯</div>
  <div class="icon-label">My App</div>
</div>
```

3. Add to start menu in `index.html`:
```html
<div class="app-item" data-app="myapp">
  <div class="app-icon">🎯</div>
  <div class="app-name">My App</div>
</div>
```

## 🔧 Development

### Building SCSS
If you want to modify the SCSS files, you'll need a SCSS compiler:

```bash
# Using npm
npm install -g sass
sass styles/main.scss styles/main.css

# Using yarn
yarn global add sass
sass styles/main.scss styles/main.css
```

### Code Structure
- **Modular JavaScript** - Each feature has its own module
- **Event-Driven Architecture** - Components communicate via events
- **CSS BEM Methodology** - Consistent class naming
- **Responsive Design** - Mobile-friendly layouts

## 🐛 Known Issues

- Calculator functionality is simulated (no actual calculations)
- File Explorer shows mock data
- Web browser doesn't load real websites
- Some animations may be choppy on older devices

## 🚀 Future Enhancements

- [ ] Real file system integration
- [ ] Working web browser with iframe
- [ ] More applications (Paint, Word, etc.)
- [ ] User accounts and profiles
- [ ] Custom themes and wallpapers

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Modern web technologies for making this possible
- The open-source community for inspiration and tools
- All contributors and users of WebOS

## 📄 License

**Note**: This is a web-based operating system interface for educational and entertainment purposes. It is not affiliated with any commercial operating system vendors. 