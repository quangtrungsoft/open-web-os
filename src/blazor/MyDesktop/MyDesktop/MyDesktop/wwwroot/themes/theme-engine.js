// Theme Engine for MyDesktop
window.MyDesktopTheme = {
    // Apply theme with smooth transition
    applyTheme: function (themeName) {
        const root = document.documentElement;
        const isDark = themeName === 'dark';
        
        // Add transition class for smooth animation
        root.classList.add('theme-transitioning');
        
        // Update CSS variables
        if (isDark) {
            root.style.setProperty('--background-primary', '#1C1C1E');
            root.style.setProperty('--background-secondary', '#2C2C2E');
            root.style.setProperty('--text-primary', '#FFFFFF');
            root.style.setProperty('--text-secondary', '#EBEBF5');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.style.setProperty('--background-primary', '#FFFFFF');
            root.style.setProperty('--background-secondary', '#F5F5F7');
            root.style.setProperty('--text-primary', '#1D1D1F');
            root.style.setProperty('--text-secondary', '#86868B');
            root.setAttribute('data-theme', 'light');
        }
        
        // Remove transition class after animation
        setTimeout(() => {
            root.classList.remove('theme-transitioning');
        }, 300);
    },

    // Toggle theme
    toggleTheme: function () {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        return newTheme;
    },

    // Get current theme
    getCurrentTheme: function () {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }
};

// Dock animation and interaction
window.MyDesktopDock = {
    // Magnify dock items on hover
    setupDockMagnification: function () {
        const dock = document.querySelector('.dock');
        if (!dock) return;

        const dockItems = dock.querySelectorAll('.dock-item');
        
        dockItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                dock.classList.add('magnified');
            });
            
            item.addEventListener('mouseleave', () => {
                dock.classList.remove('magnified');
            });
        });
    },

    // Bounce animation for running apps
    bounceApp: function (appId) {
        const dockItem = document.querySelector(`[data-app-id="${appId}"]`);
        if (dockItem) {
            dockItem.classList.add('bouncing');
            setTimeout(() => {
                dockItem.classList.remove('bouncing');
            }, 600);
        }
    }
};

// Window management
window.MyDesktopWindow = {
    // Make windows draggable
    makeDraggable: function (windowElement) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const titleBar = windowElement.querySelector('.window-titlebar');
        if (!titleBar) return;

        titleBar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === titleBar) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, windowElement);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    },

    // Window animations
    minimize: function (windowElement) {
        windowElement.style.transform = 'scale(0.1)';
        windowElement.style.opacity = '0';
        setTimeout(() => {
            windowElement.style.display = 'none';
        }, 300);
    },

    maximize: function (windowElement) {
        windowElement.style.width = '100vw';
        windowElement.style.height = '100vh';
        windowElement.style.top = '0';
        windowElement.style.left = '0';
    },

    restore: function (windowElement) {
        windowElement.style.width = '800px';
        windowElement.style.height = '600px';
        windowElement.style.top = '50px';
        windowElement.style.left = '50px';
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Setup dock magnification
    window.MyDesktopDock.setupDockMagnification();
    
    // Setup theme based on time of day
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
        window.MyDesktopTheme.applyTheme('dark');
    }
    
    console.log('MyDesktop JavaScript initialized');
}); 