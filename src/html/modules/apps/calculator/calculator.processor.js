/**
 * Calculator App - Processor Layer
 * Handles business logic, calculations, and communication with other modules
 */

class CalculatorProcessor {
    constructor() {
        this.appId = 'calculator';
        this.appName = 'Calculator';
        this.appIcon = '🧮';
        this.windowId = null;
        this.control = null;
        this.templateLoader = null;
        this.eventBus = null;
        this.isInitialized = false;
        
        // Calculator state
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
    }

    /**
     * Initialize the processor
     * @param {Object} dependencies - Required dependencies
     */
    init(dependencies = {}) {
        // Prevent duplicate initialization
        if (this.isInitialized) {
            console.log('CalculatorProcessor: Already initialized, skipping');
            return true;
        }
        
        this.templateLoader = dependencies.templateLoader || window.templateLoader;
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.templateLoader) {
            console.error('CalculatorProcessor: TemplateLoader not available');
            return false;
        }
        
        if (!this.eventBus) {
            console.error('CalculatorProcessor: EventBus not available');
            return false;
        }
        
        this.registerApp();
        this.isInitialized = true;
        console.log('Calculator Processor initialized');
        return true;
    }

    /**
     * Register the app with the system
     */
    registerApp() {
        if (this.eventBus) {
            this.eventBus.emit('registerApp', {
                id: this.appId,
                name: this.appName,
                icon: this.appIcon,
                handler: () => this.open(),
                display: ["startmenu"]
            });
        }
    }

    /**
     * Open the Calculator app
     */
    async open() {
        try {
            const windowId = `window-${this.appId}-${Date.now()}`;
            this.windowId = windowId;

            // Load template from file
            const windowContent = await this.templateLoader.loadTemplate('apps/calculator/calculator.html');
            
            // Add window-specific styles
            this.addStyles();

            // Create window using window manager
            this.eventBus.emit('createWindow', {
                id: windowId,
                title: this.appName,
                icon: this.appIcon,
                content: windowContent,
                width: 320,
                height: 450,
                minWidth: 300,
                minHeight: 400,
                resizable: true,
                draggable: true,
                centered: true,
                onWindowCreated: (windowElement) => this.onWindowCreated(windowElement)
            });

            // Track app usage
            this.trackAppUsage();
            
        } catch (error) {
            console.error('Failed to open Calculator app:', error);
            this.handleError(error);
        }
    }

    /**
     * Called when window is created
     * @param {HTMLElement} windowElement - The window DOM element
     */
    onWindowCreated(windowElement) {
        // Initialize control layer
        this.control = new CalculatorControl(this);
        this.control.init(this.windowId, windowElement);
        
        // Listen for window close events
        this.eventBus.on('windowClosed', (data) => {
            if (data.id === this.windowId) {
                this.onWindowClosed();
            }
        });
    }

    /**
     * Handle number input
     * @param {string} number - Number to input
     */
    handleNumberInput(number) {
        if (this.waitingForOperand) {
            this.currentValue = number;
            this.waitingForOperand = false;
        } else {
            this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
        }
        
        this.updateDisplay();
    }

    /**
     * Handle button action
     * @param {string} action - Action to perform
     */
    handleButtonAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'clearEntry':
                this.clearEntry();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'plusMinus':
                this.toggleSign();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.performOperation(action);
                break;
            case 'equals':
                this.performCalculation();
                break;
        }
    }

    /**
     * Clear all calculator state
     */
    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.updateDisplay();
    }

    /**
     * Clear current entry
     */
    clearEntry() {
        this.currentValue = '0';
        this.updateDisplay();
    }

    /**
     * Remove last digit
     */
    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }

    /**
     * Input decimal point
     */
    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentValue = '0.';
            this.waitingForOperand = false;
        } else if (this.currentValue.indexOf('.') === -1) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    }

    /**
     * Toggle sign of current value
     */
    toggleSign() {
        this.currentValue = this.currentValue.charAt(0) === '-' ? 
            this.currentValue.substr(1) : '-' + this.currentValue;
        this.updateDisplay();
    }

    /**
     * Perform operation
     * @param {string} nextOperation - Next operation to perform
     */
    performOperation(nextOperation) {
        const inputValue = parseFloat(this.currentValue);

        if (this.previousValue === null) {
            this.previousValue = inputValue;
        } else if (this.operation) {
            const currentValue = this.previousValue;
            const newValue = this.performCalculation(currentValue, inputValue, this.operation);

            this.currentValue = String(newValue);
            this.previousValue = newValue;
        }

        this.waitingForOperand = true;
        this.operation = nextOperation;
        this.updateDisplay();
    }

    /**
     * Perform calculation
     */
    performCalculation() {
        const inputValue = parseFloat(this.currentValue);

        if (this.previousValue === null || this.operation === null) {
            return;
        }

        const newValue = this.performCalculation(this.previousValue, inputValue, this.operation);
        this.currentValue = String(newValue);
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = true;
        this.updateDisplay();
    }

    /**
     * Perform calculation with given values
     * @param {number} firstValue - First value
     * @param {number} secondValue - Second value
     * @param {string} operation - Operation to perform
     * @returns {number} Result of calculation
     */
    performCalculation(firstValue, secondValue, operation) {
        switch (operation) {
            case 'add':
                return firstValue + secondValue;
            case 'subtract':
                return firstValue - secondValue;
            case 'multiply':
                return firstValue * secondValue;
            case 'divide':
                if (secondValue === 0) {
                    this.handleError(new Error('Division by zero'));
                    return 0;
                }
                return firstValue / secondValue;
            default:
                return secondValue;
        }
    }

    /**
     * Update calculator display
     */
    updateDisplay() {
        if (this.control) {
            const historyValue = this.previousValue !== null ? 
                `${this.previousValue} ${this.getOperationSymbol(this.operation)}` : '';
            this.control.updateDisplay(this.currentValue, historyValue);
        }
    }

    /**
     * Get operation symbol for display
     * @param {string} operation - Operation name
     * @returns {string} Operation symbol
     */
    getOperationSymbol(operation) {
        switch (operation) {
            case 'add': return '+';
            case 'subtract': return '−';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }

    /**
     * Track app usage
     */
    trackAppUsage() {
        console.log('Calculator app opened');
        
        this.eventBus.emit('appUsage', {
            appId: this.appId,
            action: 'opened',
            timestamp: Date.now()
        });
    }

    /**
     * Handle errors
     * @param {Error} error - The error to handle
     */
    handleError(error) {
        console.error('Calculator Processor Error:', error);
        
        if (this.control) {
            this.control.showError(error.message);
        }
        
        // Notify other modules about the error
        this.eventBus.emit('appError', {
            appId: this.appId,
            error: error.message,
            timestamp: Date.now()
        });
    }

    /**
     * Called when window is closed
     */
    onWindowClosed() {
        console.log('Calculator window closed');
        
        // Cleanup control layer
        if (this.control) {
            this.control.destroy();
            this.control = null;
        }
        
        // Track app closure
        this.eventBus.emit('appUsage', {
            appId: this.appId,
            action: 'closed',
            timestamp: Date.now()
        });
        
        this.windowId = null;
    }

    /**
     * Add app-specific styles
     */
    addStyles() {
        if (!document.getElementById('calculator-styles')) {
            const style = document.createElement('style');
            style.id = 'calculator-styles';
            style.textContent = `
                .calculator-content {
                    padding: 20px;
                    background: #f0f0f0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .calculator-display {
                    background: #2d2d2d;
                    color: white;
                    padding: 20px;
                    margin-bottom: 20px;
                    border-radius: 8px;
                    text-align: right;
                    min-height: 80px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }

                .display-history {
                    font-size: 14px;
                    opacity: 0.7;
                    margin-bottom: 5px;
                    min-height: 20px;
                }

                .display-current {
                    font-size: 32px;
                    font-weight: 600;
                }

                .calculator-buttons {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    flex: 1;
                }

                .calc-btn {
                    background: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .calc-btn:hover {
                    background: #f8f8f8;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .calc-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .calc-btn.function {
                    background: #f0f0f0;
                    color: #333;
                }

                .calc-btn.operator {
                    background: #ff9500;
                    color: white;
                    border-color: #ff9500;
                }

                .calc-btn.operator:hover {
                    background: #ff8000;
                }

                .calc-btn.equals {
                    background: #007aff;
                    color: white;
                    border-color: #007aff;
                }

                .calc-btn.equals:hover {
                    background: #0056cc;
                }

                .calc-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    font-size: 18px;
                    opacity: 0.8;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Get calculator statistics
     * @returns {Object} Calculator statistics
     */
    getStats() {
        return {
            appId: this.appId,
            currentValue: this.currentValue,
            previousValue: this.previousValue,
            operation: this.operation,
            isOpen: !!this.windowId
        };
    }
}

// Export the processor class
window.CalculatorProcessor = CalculatorProcessor; 