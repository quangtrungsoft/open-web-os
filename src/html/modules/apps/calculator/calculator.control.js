/**
 * Calculator App - Control Layer
 * Handles UI interactions, button events, and DOM manipulation
 */

class CalculatorControl {
    constructor(processor) {
        this.processor = processor;
        this.windowId = null;
        this.isInitialized = false;
        this.buttons = new Map();
    }

    /**
     * Initialize the control layer
     * @param {string} windowId - The window ID
     * @param {HTMLElement} windowElement - The window DOM element
     */
    init(windowId, windowElement) {
        this.windowId = windowId;
        this.windowElement = windowElement;
        
        if (this.isInitialized) return;
        
        this.bindEvents();
        this.setupAnimations();
        this.isInitialized = true;
        
        console.log('Calculator Control initialized');
    }

    /**
     * Bind event listeners to calculator buttons
     */
    bindEvents() {
        // Bind all calculator buttons
        const buttons = this.windowElement.querySelectorAll('.calc-btn');
        buttons.forEach(button => {
            this.buttons.set(button, button);
            
            // Add click handler
            button.addEventListener('click', (e) => this.handleButtonClick(e));
            
            // Add keyboard support
            button.addEventListener('keydown', (e) => this.handleKeyDown(e));
            
            // Add hover effects
            button.addEventListener('mouseenter', (e) => this.handleButtonHover(e, true));
            button.addEventListener('mouseleave', (e) => this.handleButtonHover(e, false));
        });

        // Add keyboard support for the window
        this.windowElement.addEventListener('keydown', (e) => this.handleWindowKeyDown(e));
        
        // Focus the window for keyboard input
        this.windowElement.focus();
    }

    /**
     * Setup CSS animations and transitions
     */
    setupAnimations() {
        // Add entrance animation for display
        const display = this.windowElement.querySelector('.calculator-display');
        if (display) {
            display.style.opacity = '0';
            display.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                display.style.transition = 'all 0.4s ease-out';
                display.style.opacity = '1';
                display.style.transform = 'translateY(0)';
            }, 100);
        }

        // Add staggered animation for buttons
        const buttons = this.windowElement.querySelectorAll('.calc-btn');
        buttons.forEach((button, index) => {
            button.style.opacity = '0';
            button.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                button.style.transition = 'all 0.3s ease-out';
                button.style.opacity = '1';
                button.style.transform = 'scale(1)';
            }, 200 + (index * 20));
        });
    }

    /**
     * Handle button click events
     * @param {Event} e - Click event
     */
    handleButtonClick(e) {
        const button = e.currentTarget;
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        // Add click animation
        this.addButtonClickAnimation(button);
        
        // Notify processor about button interaction
        if (action) {
            this.processor.handleButtonAction(action);
        } else if (value) {
            this.processor.handleNumberInput(value);
        }
    }

    /**
     * Handle button hover effects
     * @param {Event} e - Mouse event
     * @param {boolean} isHovering - Whether mouse is entering or leaving
     */
    handleButtonHover(e, isHovering) {
        const button = e.currentTarget;
        
        if (isHovering) {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        } else {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        }
    }

    /**
     * Add click animation to button
     * @param {HTMLElement} button - The button element
     */
    addButtonClickAnimation(button) {
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }

    /**
     * Handle window keyboard events
     * @param {Event} e - Keydown event
     */
    handleWindowKeyDown(e) {
        const key = e.key;
        
        // Map keyboard keys to calculator actions
        const keyMap = {
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
            '.': 'decimal',
            '+': 'add',
            '-': 'subtract',
            '*': 'multiply',
            '/': 'divide',
            'Enter': 'equals',
            'Escape': 'clear',
            'Backspace': 'backspace'
        };
        
        const action = keyMap[key];
        if (action) {
            e.preventDefault();
            
            // Find and click the corresponding button
            const button = this.findButtonByAction(action);
            if (button) {
                this.addButtonClickAnimation(button);
                this.processor.handleButtonAction(action);
            }
        }
    }

    /**
     * Handle individual button keydown events
     * @param {Event} e - Keydown event
     */
    handleKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
        }
    }

    /**
     * Find button by action or value
     * @param {string} action - The action or value to find
     * @returns {HTMLElement|null} The button element or null
     */
    findButtonByAction(action) {
        for (const button of this.buttons.keys()) {
            if (button.dataset.action === action || button.dataset.value === action) {
                return button;
            }
        }
        return null;
    }

    /**
     * Update the calculator display
     * @param {string} currentValue - Current display value
     * @param {string} historyValue - History display value
     */
    updateDisplay(currentValue, historyValue = '') {
        const currentDisplay = this.windowElement.querySelector('#displayCurrent');
        const historyDisplay = this.windowElement.querySelector('#displayHistory');
        
        if (currentDisplay) {
            currentDisplay.textContent = currentValue;
            
            // Add update animation
            currentDisplay.style.transform = 'scale(1.05)';
            currentDisplay.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                currentDisplay.style.transform = 'scale(1)';
            }, 100);
        }
        
        if (historyDisplay) {
            historyDisplay.textContent = historyValue;
        }
    }

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showError(message) {
        const currentDisplay = this.windowElement.querySelector('#displayCurrent');
        if (currentDisplay) {
            currentDisplay.textContent = 'Error';
            currentDisplay.style.color = '#ff6b6b';
            
            setTimeout(() => {
                currentDisplay.style.color = '';
            }, 2000);
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        const content = this.windowElement.querySelector('.calculator-content');
        if (content) {
            content.innerHTML = '<div class="loading">Loading...</div>';
        }
    }

    /**
     * Highlight a button (for visual feedback)
     * @param {string} action - The action to highlight
     * @param {number} duration - Duration in milliseconds
     */
    highlightButton(action, duration = 200) {
        const button = this.findButtonByAction(action);
        if (button) {
            button.style.backgroundColor = '#4ecdc4';
            button.style.color = 'white';
            
            setTimeout(() => {
                button.style.backgroundColor = '';
                button.style.color = '';
            }, duration);
        }
    }

    /**
     * Enable/disable buttons
     * @param {boolean} enabled - Whether to enable or disable buttons
     */
    setButtonsEnabled(enabled) {
        const buttons = this.windowElement.querySelectorAll('.calc-btn');
        buttons.forEach(button => {
            button.disabled = !enabled;
            button.style.opacity = enabled ? '1' : '0.5';
        });
    }

    /**
     * Cleanup event listeners and resources
     */
    destroy() {
        // Remove event listeners from buttons
        for (const button of this.buttons.keys()) {
            button.removeEventListener('click', this.handleButtonClick);
            button.removeEventListener('keydown', this.handleKeyDown);
            button.removeEventListener('mouseenter', this.handleButtonHover);
            button.removeEventListener('mouseleave', this.handleButtonHover);
        }

        // Remove window event listeners
        this.windowElement.removeEventListener('keydown', this.handleWindowKeyDown);

        this.buttons.clear();
        this.isInitialized = false;
        console.log('Calculator Control destroyed');
    }
}

// Export the control class
window.CalculatorControl = CalculatorControl; 