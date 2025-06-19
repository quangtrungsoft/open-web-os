/**
 * WebOS - Animations
 * Handles animation functionality
 */

class Animations {
    constructor() {
        this.eventBus = null;
        this.isInitialized = false;
        this.animationQueue = [];
        this.isAnimating = false;
    }

    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('Animations: EventBus not available');
            return false;
        }
        
        this.bindEvents();
        this.setupGlobalAnimations();
        this.isInitialized = true;
        
        console.log('Animations initialized');
        return true;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Listen for window events to add animations
        this.eventBus.on('windowCreated', (data) => {
            this.addWindowAnimations(data.id);
        });

        // Listen for start menu events
        this.eventBus.on('startMenuOpened', () => {
            this.animateStartMenuOpen();
        });

        this.eventBus.on('startMenuClosed', () => {
            this.animateStartMenuClose();
        });

        // Listen for desktop icon events
        this.eventBus.on('desktopIconAdded', (data) => {
            this.animateDesktopIconAdd(data.element);
        });
    }

    /**
     * Setup global animations
     */
    setupGlobalAnimations() {
        // Add hover animations to all interactive elements
        this.addHoverAnimations();
        
        // Add click animations to buttons
        this.addClickAnimations();
        
        // Add focus animations
        this.addFocusAnimations();
    }

    /**
     * Add hover animations to interactive elements
     */
    addHoverAnimations() {
        // Desktop icons
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.desktop-icon')) {
                const icon = e.target.closest('.desktop-icon');
                this.addHoverEffect(icon, 'scale', 1.05);
            }
        });

        // Window controls
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.window-control')) {
                const control = e.target.closest('.window-control');
                this.addHoverEffect(control, 'scale', 1.1);
                
                // Special animation for close button
                if (control.classList.contains('close')) {
                    this.addShakeAnimation(control);
                }
            }
        });

        // Start menu items
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.app-item')) {
                const item = e.target.closest('.app-item');
                this.addHoverEffect(item, 'scale', 1.05);
            }
        });

        // Taskbar items
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.taskbar-item')) {
                const item = e.target.closest('.taskbar-item');
                this.addHoverEffect(item, 'scale', 1.1);
            }
        });
    }

    /**
     * Add click animations to buttons
     */
    addClickAnimations() {
        document.addEventListener('mousedown', (e) => {
            // Desktop icons
            if (e.target.closest('.desktop-icon')) {
                const icon = e.target.closest('.desktop-icon');
                this.addClickEffect(icon, 'scale', 0.95);
            }

            // Window controls
            if (e.target.closest('.window-control')) {
                const control = e.target.closest('.window-control');
                this.addClickEffect(control, 'scale', 0.9);
            }

            // Buttons
            if (e.target.closest('button')) {
                const button = e.target.closest('button');
                this.addClickEffect(button, 'translateY', 1);
            }
        });
    }

    /**
     * Add focus animations
     */
    addFocusAnimations() {
        document.addEventListener('focusin', (e) => {
            if (e.target.closest('.window')) {
                const window = e.target.closest('.window');
                this.addFocusEffect(window);
            }
        });
    }

    /**
     * Add hover effect to element
     * @param {HTMLElement} element - Element to animate
     * @param {string} property - CSS property to animate
     * @param {number} value - Value to animate to
     */
    addHoverEffect(element, property, value) {
        if (!element) return;
        
        // Remove existing hover effect
        element.style.transform = '';
        
        // Add new hover effect
        if (property === 'scale') {
            element.style.transform = `scale(${value})`;
        } else if (property === 'translateY') {
            element.style.transform = `translateY(-${value}px)`;
        }
    }

    /**
     * Add click effect to element
     * @param {HTMLElement} element - Element to animate
     * @param {string} property - CSS property to animate
     * @param {number} value - Value to animate to
     */
    addClickEffect(element, property, value) {
        if (!element) return;
        
        const originalTransform = element.style.transform;
        
        // Add click effect
        if (property === 'scale') {
            element.style.transform = `scale(${value})`;
        } else if (property === 'translateY') {
            element.style.transform = `translateY(${value}px)`;
        }
        
        // Reset after animation
        setTimeout(() => {
            element.style.transform = originalTransform;
        }, 150);
    }

    /**
     * Add focus effect to window
     * @param {HTMLElement} window - Window element
     */
    addFocusEffect(window) {
        if (!window) return;
        
        // Add glow effect
        window.style.boxShadow = '0 0 20px rgba(0, 120, 212, 0.5)';
        
        // Remove glow after animation
        setTimeout(() => {
            window.style.boxShadow = '';
        }, 300);
    }

    /**
     * Add shake animation to element
     * @param {HTMLElement} element - Element to shake
     */
    addShakeAnimation(element) {
        if (!element) return;
        
        element.style.animation = 'closeButtonShake 0.3s ease-in-out';
        
        // Remove animation after completion
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
    }

    /**
     * Add window animations
     * @param {string} windowId - Window ID
     */
    addWindowAnimations(windowId) {
        const windowElement = document.getElementById(windowId);
        if (!windowElement) return;

        // Add fade-in animation
        windowElement.style.opacity = '0';
        windowElement.style.transform = 'scale(0.9)';
        
        // Animate in
        requestAnimationFrame(() => {
            windowElement.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            windowElement.style.opacity = '1';
            windowElement.style.transform = 'scale(1)';
        });
    }

    /**
     * Animate start menu opening
     */
    animateStartMenuOpen() {
        const startMenu = document.querySelector('.start-menu');
        if (!startMenu) return;

        startMenu.style.display = 'block';
        startMenu.style.opacity = '0';
        startMenu.style.transform = 'translateY(20px) scale(0.95)';
        
        requestAnimationFrame(() => {
            startMenu.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            startMenu.style.opacity = '1';
            startMenu.style.transform = 'translateY(0) scale(1)';
        });
    }

    /**
     * Animate start menu closing
     */
    animateStartMenuClose() {
        const startMenu = document.querySelector('.start-menu');
        if (!startMenu) return;

        startMenu.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
        startMenu.style.opacity = '0';
        startMenu.style.transform = 'translateY(20px) scale(0.95)';
        
        setTimeout(() => {
            startMenu.style.display = 'none';
        }, 200);
    }

    /**
     * Animate desktop icon addition
     * @param {HTMLElement} iconElement - Icon element
     */
    animateDesktopIconAdd(iconElement) {
        if (!iconElement) return;

        iconElement.style.opacity = '0';
        iconElement.style.transform = 'scale(0.5)';
        
        requestAnimationFrame(() => {
            iconElement.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            iconElement.style.opacity = '1';
            iconElement.style.transform = 'scale(1)';
        });
    }

    /**
     * Add fade-in animation to element
     * @param {HTMLElement} element - Element to animate
     * @param {number} duration - Animation duration in ms
     */
    fadeIn(element, duration = 300) {
        if (!element) return;

        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-out`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    /**
     * Add fade-out animation to element
     * @param {HTMLElement} element - Element to animate
     * @param {number} duration - Animation duration in ms
     */
    fadeOut(element, duration = 300) {
        if (!element) return;

        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, duration);
    }

    /**
     * Add slide-in animation to element
     * @param {HTMLElement} element - Element to animate
     * @param {string} direction - Slide direction ('left', 'right', 'up', 'down')
     * @param {number} duration - Animation duration in ms
     */
    slideIn(element, direction = 'left', duration = 300) {
        if (!element) return;

        const transforms = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };

        element.style.opacity = '0';
        element.style.transform = transforms[direction] || transforms.left;
        element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
        });
    }

    /**
     * Get animation statistics
     * @returns {Object} Animation statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            animationQueue: this.animationQueue.length,
            isAnimating: this.isAnimating
        };
    }

    destroy() {
        this.isInitialized = false;
        this.animationQueue = [];
        this.isAnimating = false;
        console.log('Animations destroyed');
    }
}

window.Animations = Animations; 