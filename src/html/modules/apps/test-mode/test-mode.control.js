class TestModeControl {
    constructor(processor) {
        this.processor = processor;
        this.windowElement = null;
        this.windowId = null;
        this.isInitialized = false;
        this.loadingDelay = 0;
        this.testOutput = null;
    }

    /**
     * Initialize the test mode control
     * @param {string} windowId - Window identifier
     * @param {HTMLElement} windowElement - Window DOM element
     */
    init(windowId, windowElement) {
        this.windowId = windowId;
        this.windowElement = windowElement;

        if (this.isInitialized) return;
        
        this.loadDelayFromStorage();
        this.bindEvents();
        this.setupLoadingDelayControls();
        this.isInitialized = true;
        
        this.log('Test Mode Control initialized');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // App testing buttons
        this.bindButton('testSettingsBtn', () => this.testSettings());
        this.bindButton('testAboutMeBtn', () => this.testAboutMe());
        
        // System testing buttons
        this.bindButton('testDuplicateBtn', () => this.testDuplicatePrevention());
        this.bindButton('testAnimationsBtn', () => this.testAnimations());
        this.bindButton('testLoadingBtn', () => this.testLoading());
        this.bindButton('testLoadingDelayBtn', () => this.testLoadingDelay());
        
        // UI testing buttons
        this.bindButton('testDesktopInteractivityBtn', () => this.testDesktopInteractivity());
        this.bindButton('testTaskbarBtn', () => this.testTaskbarFunctionality());
        this.bindButton('testStartMenuBtn', () => this.testStartMenuFunctionality());
        this.bindButton('testDragDropBtn', () => this.testDragDropFunctionality());
    }

    /**
     * Bind a button with error handling
     * @param {string} buttonId - Button element ID
     * @param {Function} handler - Event handler function
     */
    bindButton(buttonId, handler) {
        const button = this.windowElement.querySelector(`#${buttonId}`);
        if (button) {
            button.addEventListener('click', () => {
                try {
                    this.clearOutput();
                    this.log(`=== Starting ${buttonId.replace('Btn', '').replace(/([A-Z])/g, ' $1').trim()} Test ===`);
                    handler();
                } catch (error) {
                    this.log(`Error in ${buttonId}: ${error.message}`, 'error');
                }
            });
        }
    }

    /**
     * Setup loading delay control buttons
     */
    setupLoadingDelayControls() {
        // Delay buttons
        const delayButtons = [
            { id: 'delay0Btn', delay: 0 },
            { id: 'delay1Btn', delay: 1000 },
            { id: 'delay2Btn', delay: 2000 },
            { id: 'delay3Btn', delay: 3000 },
            { id: 'delay5Btn', delay: 5000 }
        ];

        delayButtons.forEach(({ id, delay }) => {
            const button = this.windowElement.querySelector(`#${id}`);
            if (button) {
                button.addEventListener('click', () => {
                    this.setLoadingDelay(delay);
                    this.updateDelayDisplay();
                    this.highlightActiveDelayButton(delay);
                });
            }
        });

        // Restart button
        const restartBtn = this.windowElement.querySelector('#restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restartWithNewDelay();
            });
        }

        // Initialize display
        this.updateDelayDisplay();
        this.highlightActiveDelayButton(this.loadingDelay);
    }

    /**
     * Load delay from localStorage
     */
    loadDelayFromStorage() {
        try {
            const savedDelay = localStorage.getItem('mydesktop_loading_delay');
            this.loadingDelay = savedDelay ? parseInt(savedDelay) : 0;
        } catch (error) {
            console.error('Failed to load delay from storage:', error);
            this.loadingDelay = 0;
        }
    }

    /**
     * Save delay to localStorage
     * @param {number} delay - Delay in milliseconds
     */
    saveDelayToStorage(delay) {
        try {
            localStorage.setItem('mydesktop_loading_delay', delay.toString());
        } catch (error) {
            console.error('Failed to save delay to storage:', error);
        }
    }

    /**
     * Set loading delay
     * @param {number} delay - Delay in milliseconds
     */
    setLoadingDelay(delay) {
        this.loadingDelay = delay;
        this.saveDelayToStorage(delay);
        this.log(`Loading delay set to ${delay}ms (${delay / 1000}s)`, 'info');
    }

    /**
     * Get loading delay
     * @returns {number} Current loading delay in milliseconds
     */
    getLoadingDelay() {
        return this.loadingDelay;
    }

    /**
     * Update the delay display
     */
    updateDelayDisplay() {
        const currentDelaySpan = this.windowElement.querySelector('#currentDelay');
        if (currentDelaySpan) {
            currentDelaySpan.textContent = `${this.loadingDelay / 1000}s`;
        }
    }

    /**
     * Highlight the active delay button
     * @param {number} activeDelay - The active delay in milliseconds
     */
    highlightActiveDelayButton(activeDelay) {
        const delayButtons = [
            { id: 'delay0Btn', delay: 0 },
            { id: 'delay1Btn', delay: 1000 },
            { id: 'delay2Btn', delay: 2000 },
            { id: 'delay3Btn', delay: 3000 },
            { id: 'delay5Btn', delay: 5000 }
        ];

        delayButtons.forEach(({ id, delay }) => {
            const button = this.windowElement.querySelector(`#${id}`);
            if (button) {
                if (delay === activeDelay) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        });
    }

    /**
     * Restart the application with new delay setting
     */
    restartWithNewDelay() {
        this.log(`Restarting My Desktop with ${this.loadingDelay}ms loading delay...`, 'warning');
        
        // Show confirmation
        if (confirm(`Restart My Desktop with ${this.loadingDelay / 1000}s loading delay?`)) {
            // Reload the page to restart with new delay
            window.location.reload();
        }
    }

    /**
     * Clear test output
     */
    clearOutput() {
        if (this.testOutput) {
            this.testOutput.innerHTML = '';
        }
    }

    /**
     * Log message to test output
     * @param {string} message - Message to log
     * @param {string} type - Message type (success, error, warning, info)
     */
    log(message, type = 'info') {
        if (!this.testOutput) {
            this.testOutput = this.windowElement.querySelector('#testOutput');
        }
        
        if (this.testOutput) {
            const timestamp = new Date().toLocaleTimeString();
            const className = type ? ` class="${type}"` : '';
            const logEntry = `<p${className}>[${timestamp}] ${message}</p>`;
            this.testOutput.innerHTML += logEntry;
            this.testOutput.scrollTop = this.testOutput.scrollHeight;
        }
        
        // Also log to console
        console.log(`[Test Mode] ${message}`);
    }

    /**
     * Test Settings app
     */
    testSettings() {
        this.log('Testing Settings app...');
        if (window.settingsProcessor) {
            this.log('Opening settings app...', 'info');
            window.settingsProcessor.open();
            this.log('Settings app opened successfully', 'success');
        } else {
            this.log('Settings processor not available', 'error');
        }
    }

    /**
     * Test About Me app
     */
    testAboutMe() {
        this.log('Testing About Me app...');
        if (window.aboutMeProcessor) {
            this.log('Opening About Me app...', 'info');
            window.aboutMeProcessor.launchAboutMe();
            this.log('About Me app opened successfully', 'success');
        } else {
            this.log('About Me processor not available', 'error');
        }
    }

    /**
     * Test duplicate icon prevention
     */
    testDuplicatePrevention() {
        this.log('Testing Duplicate Icon Prevention...');
        
        // Test 1: Try to register the same app multiple times
        if (window.eventBus) {
            this.log('Test 1: Attempting to register About Me app multiple times...', 'info');
            
            for (let i = 0; i < 3; i++) {
                window.eventBus.emit('registerApp', {
                    id: 'aboutme',
                    name: 'About Me',
                    icon: '👤',
                    handler: () => this.log('About Me clicked')
                });
            }
            
            this.log('Test 1 completed. Check console for duplicate prevention messages.', 'info');
        }
        
        // Test 2: Try to register Calculator app multiple times
        if (window.eventBus) {
            this.log('Test 2: Attempting to register Calculator app multiple times...', 'info');
            
            for (let i = 0; i < 3; i++) {
                window.eventBus.emit('registerApp', {
                    id: 'calculator',
                    name: 'Calculator',
                    icon: '🧮',
                    handler: () => this.log('Calculator clicked')
                });
            }
            
            this.log('Test 2 completed. Check console for duplicate prevention messages.', 'info');
        }
        
        // Test 3: Check registered apps
        if (window.desktopIcons) {
            const registeredApps = window.desktopIcons.getRegisteredApps();
            this.log(`Test 3: Currently registered apps: ${registeredApps.length}`, 'info');
        }
        
        if (window.startMenu) {
            const startMenuApps = window.startMenu.getRegisteredApps();
            this.log(`Test 3: Start menu registered apps: ${startMenuApps.length}`, 'info');
        }
        
        this.log('Duplicate Prevention Test Complete', 'success');
    }

    /**
     * Test animation functionality
     */
    testAnimations() {
        this.log('Testing Animation System...');
        
        // Test 1: Check if animations module is loaded
        if (window.animations) {
            this.log('Test 1: Animations module is loaded', 'success');
            const stats = window.animations.getStats();
            this.log(`Animation stats: ${JSON.stringify(stats)}`, 'info');
        } else {
            this.log('Test 1: Animations module not found', 'error');
        }
        
        // Test 2: Test fade-in animation
        if (window.animations) {
            this.log('Test 2: Testing fade-in animation...', 'info');
            const testElement = document.createElement('div');
            testElement.style.cssText = `
                position: fixed; top: 100px; left: 100px; 
                width: 100px; height: 100px; background: red; 
                z-index: 10000; color: white; display: flex; 
                align-items: center; justify-content: center;
            `;
            testElement.textContent = 'Test Animation';
            document.body.appendChild(testElement);
            
            // Test fade-in
            window.animations.fadeIn(testElement, 1000);
            
            // Remove after 2 seconds
            setTimeout(() => {
                window.animations.fadeOut(testElement, 500);
                setTimeout(() => {
                    if (testElement.parentNode) {
                        testElement.parentNode.removeChild(testElement);
                    }
                }, 500);
            }, 2000);
        }
        
        this.log('Animation Test Complete', 'success');
    }

    /**
     * Test loading delay functionality
     */
    testLoadingDelay() {
        this.log('Testing Loading Delay System...');
        
        // Test 1: Check current delay
        const currentDelay = this.getLoadingDelay();
        this.log(`Test 1: Current loading delay: ${currentDelay}ms (${currentDelay / 1000}s)`, 'info');
        
        // Test 2: Test different delay settings
        this.log('Test 2: Testing different delay settings...', 'info');
        const testDelays = [0, 1000, 2000, 3000, 5000];
        
        testDelays.forEach(delay => {
            this.setLoadingDelay(delay);
            this.log(`  Set delay to ${delay}ms (${delay / 1000}s)`, 'info');
        });
        
        // Reset to original delay
        this.setLoadingDelay(currentDelay);
        this.log(`Reset delay to original: ${currentDelay}ms`, 'info');
        
        // Test 3: Check localStorage
        this.log('Test 3: Checking localStorage...', 'info');
        try {
            const savedDelay = localStorage.getItem('mydesktop_loading_delay');
            this.log(`  Saved delay in localStorage: ${savedDelay}ms`, 'info');
        } catch (error) {
            this.log(`  Failed to read localStorage: ${error.message}`, 'error');
        }
        
        this.log('Loading Delay Test Complete', 'success');
    }

    /**
     * Test desktop interactivity and identify blocking elements
     */
    testDesktopInteractivity() {
        this.log('Testing Desktop Interactivity...');
        
        // Test 1: Check loading screen status
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            this.log('Test 1: Loading screen status', 'info');
            const rect = loadingScreen.getBoundingClientRect();
            const style = getComputedStyle(loadingScreen);
            this.log(`  Bounds: ${rect.width}x${rect.height} at (${rect.left},${rect.top})`, 'info');
            this.log(`  Display: ${style.display}`, 'info');
            this.log(`  Visibility: ${style.visibility}`, 'info');
            this.log(`  Pointer Events: ${style.pointerEvents}`, 'info');
            this.log(`  Z-Index: ${style.zIndex}`, 'info');
            this.log(`  Opacity: ${style.opacity}`, 'info');
        }
        
        // Test 2: Check desktop status
        const desktop = document.getElementById('desktop');
        if (desktop) {
            this.log('Test 2: Desktop status', 'info');
            const rect = desktop.getBoundingClientRect();
            const style = getComputedStyle(desktop);
            this.log(`  Bounds: ${rect.width}x${rect.height} at (${rect.left},${rect.top})`, 'info');
            this.log(`  Display: ${style.display}`, 'info');
            this.log(`  Visibility: ${style.visibility}`, 'info');
            this.log(`  Pointer Events: ${style.pointerEvents}`, 'info');
            this.log(`  Z-Index: ${style.zIndex}`, 'info');
        }
        
        // Test 3: Test desktop click events
        this.log('Test 3: Testing desktop click events...', 'info');
        if (desktop) {
            desktop.addEventListener('click', (e) => {
                this.log('  Desktop clicked!', 'success');
            }, { once: true });
            
            // Simulate a click
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: 100,
                clientY: 100
            });
            
            desktop.dispatchEvent(clickEvent);
            this.log('  Click event dispatched to desktop', 'info');
        }
        
        this.log('Desktop Interactivity Test Complete', 'success');
    }

    /**
     * Test taskbar icon and text functionality
     */
    testTaskbarFunctionality() {
        this.log('Testing Taskbar Functionality...');
        
        // Test 1: Check taskbar element
        const taskbar = document.getElementById('taskbar');
        if (taskbar) {
            this.log('Test 1: Taskbar element found', 'success');
            const rect = taskbar.getBoundingClientRect();
            this.log(`  Bounds: ${rect.width}x${rect.height} at (${rect.left},${rect.top})`, 'info');
            this.log(`  CSS display: ${getComputedStyle(taskbar).display}`, 'info');
        } else {
            this.log('Test 1: Taskbar element not found', 'error');
        }
        
        // Test 2: Check taskbar items container
        const taskbarItems = document.querySelector('.taskbar-items');
        if (taskbarItems) {
            this.log('Test 2: Taskbar items container found', 'success');
            const items = taskbarItems.querySelectorAll('.taskbar-item');
            this.log(`  Number of taskbar items: ${items.length}`, 'info');
            
            items.forEach((item, index) => {
                const icon = item.querySelector('.taskbar-icon');
                const title = item.querySelector('.taskbar-title');
                this.log(`  Item ${index + 1}:`, 'info');
                this.log(`    Icon: ${icon ? icon.textContent : 'undefined'}`, 'info');
                this.log(`    Title: ${title ? title.textContent : 'undefined'}`, 'info');
                this.log(`    Width: ${getComputedStyle(item).width}`, 'info');
                this.log(`    Height: ${getComputedStyle(item).height}`, 'info');
            });
        } else {
            this.log('Test 2: Taskbar items container not found', 'error');
        }
        
        this.log('Taskbar Functionality Test Complete', 'success');
    }

    /**
     * Test start menu icon and text functionality
     */
    testStartMenuFunctionality() {
        this.log('Testing Start Menu Functionality...');
        
        // Test 1: Check start menu element
        const startMenu = document.getElementById('startMenu');
        if (startMenu) {
            this.log('Test 1: Start menu element found', 'success');
            const rect = startMenu.getBoundingClientRect();
            this.log(`  Bounds: ${rect.width}x${rect.height} at (${rect.left},${rect.top})`, 'info');
            this.log(`  CSS display: ${getComputedStyle(startMenu).display}`, 'info');
        } else {
            this.log('Test 1: Start menu element not found', 'error');
        }
        
        // Test 2: Check app list container
        const appList = document.querySelector('#startMenuApps');
        if (appList) {
            this.log('Test 2: App list container found', 'success');
            const items = appList.querySelectorAll('.app-item');
            this.log(`  Number of app items: ${items.length}`, 'info');
            
            items.forEach((item, index) => {
                const icon = item.querySelector('.app-icon');
                const name = item.querySelector('.app-name');
                this.log(`  App ${index + 1}:`, 'info');
                this.log(`    Icon: ${icon ? icon.textContent : 'undefined'}`, 'info');
                this.log(`    Name: ${name ? name.textContent : 'undefined'}`, 'info');
                this.log(`    Width: ${getComputedStyle(item).width}`, 'info');
                this.log(`    Height: ${getComputedStyle(item).height}`, 'info');
            });
        } else {
            this.log('Test 2: App list container not found', 'error');
        }
        
        this.log('Start Menu Functionality Test Complete', 'success');
    }

    /**
     * Test drag and drop functionality
     */
    testDragDropFunctionality() {
        this.log('Testing Drag and Drop Functionality...');
        
        // Check if desktop icons module is available
        if (!window.desktopIcons) {
            this.log('Desktop Icons module not available', 'error');
            return;
        }
        
        this.log('Test 1: Checking desktop icons module...', 'info');
        const desktopIcons = window.desktopIcons;
        this.log(`  Module initialized: ${desktopIcons.isInitialized}`, 'info');
        this.log(`  Registered apps: ${desktopIcons.getRegisteredApps().length}`, 'info');
        
        // Test 2: Check icon positions
        this.log('Test 2: Checking icon positions...', 'info');
        const positions = desktopIcons.getIconPositions();
        this.log(`  Saved positions: ${positions.size}`, 'info');
        positions.forEach((position, appId) => {
            this.log(`    ${appId}: x=${position.x}, y=${position.y}`, 'info');
        });
        
        // Test 3: Test icon positioning
        this.log('Test 3: Testing icon positioning...', 'info');
        const desktop = document.getElementById('desktop');
        const icons = desktop ? desktop.querySelectorAll('.desktop-icon') : [];
        this.log(`  Current desktop icons: ${icons.length}`, 'info');
        
        icons.forEach((icon, index) => {
            const appId = icon.dataset.appId;
            const left = parseInt(icon.style.left) || 0;
            const top = parseInt(icon.style.top) || 0;
            this.log(`    Icon ${index + 1} (${appId}): left=${left}px, top=${top}px`, 'info');
            
            // Check if icon is properly positioned
            if (left >= 0 && top >= 0) {
                this.log(`      ✓ Properly positioned`, 'success');
            } else {
                this.log(`      ✗ Positioning issue`, 'error');
            }
        });
        
        this.log('Drag and Drop Functionality Test Complete', 'success');
    }

    /**
     * Test loading screen with progress bar
     */
    testLoading() {
        this.log('Testing Loading Screen with Progress Bar...');
        
        // Get loading screen elements
        const loadingScreen = document.getElementById('loadingScreen');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (!loadingScreen) {
            this.log('Loading screen element not found', 'error');
            return;
        }
        
        if (!progressFill) {
            this.log('Progress fill element not found', 'error');
            return;
        }
        
        if (!progressText) {
            this.log('Progress text element not found', 'error');
            return;
        }
        
        this.log('All elements found successfully', 'success');
        
        // Test 1: Show loading screen
        this.log('Test 1: Showing loading screen...', 'info');
        
        // Show loading screen
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
        loadingScreen.style.visibility = 'visible';
        loadingScreen.style.pointerEvents = 'auto';
        loadingScreen.style.zIndex = '9999';
        loadingScreen.classList.remove('hidden', 'fade-out');
        
        this.log('Loading screen is now visible', 'success');
        
        // Test 2: Reset progress bar
        this.log('Test 2: Resetting progress bar...', 'info');
        progressFill.style.width = '0%';
        progressFill.style.background = '#40a9ff';
        progressText.textContent = 'Initializing...';
        
        // Debug: Check initial state
        this.log(`Initial progress fill width: ${progressFill.style.width}`, 'info');
        this.log(`Initial progress fill background: ${progressFill.style.background}`, 'info');
        
        // Test 3: Simple progress test first
        this.log('Test 3: Testing basic progress functionality...', 'info');
        
        // Quick test to ensure progress bar works
        setTimeout(() => {
            progressFill.style.width = '10%';
            this.log('Set progress to 10% - testing basic functionality', 'info');
            
            setTimeout(() => {
                // Test 4: Full loading simulation
                this.log('Test 4: Starting full loading simulation...', 'info');
                this.startFullLoadingSimulation(progressFill, progressText);
            }, 500);
        }, 500);
    }
    
    /**
     * Start the full loading simulation
     */
    startFullLoadingSimulation(progressFill, progressText) {
        let progress = 10;
        const maxProgress = 101;
        const progressSteps = [
            { start: 10, end: 25, step: 1.0, interval: 50, message: 'Starting system' },
            { start: 25, end: 45, step: 1.2, interval: 45, message: 'Loading modules' },
            { start: 45, end: 65, step: 1.5, interval: 40, message: 'Preparing desktop' },
            { start: 65, end: 85, step: 1.8, interval: 35, message: 'Starting apps' },
            { start: 85, end: 95, step: 1.0, interval: 50, message: 'Finalizing' },
            { start: 95, end: 100, step: 0.5, interval: 80, message: 'Ready' }
        ];
        
        const updateProgress = () => {
            if (progress <= maxProgress) {
                // Find current step
                const currentStep = progressSteps.find(step => progress >= step.start && progress <= step.end);
                
                if (currentStep) {
                    // Update progress bar with smooth transition
                    const newWidth = `${progress}%`;
                    progressFill.style.width = newWidth;
                    
                    // Update progress text with step-specific message
                    progressText.textContent = `${currentStep.message}... ${Math.round(progress)}%`;
                    
                    this.log(`Progress: ${Math.round(progress)}% - ${currentStep.message}`, 'info');
                    
                    progress += currentStep.step;
                    
                    // Continue progress with step-specific interval
                    setTimeout(updateProgress, currentStep.interval);
                } else {
                    // Final step - completion
                    progressFill.style.width = '100%';
                    progressText.textContent = 'Welcome to My Desktop!';
                    this.log('Progress: 100% - Loading Complete!', 'success');
                    
                    // Simple completion effect
                    progressFill.style.background = '#00ff88';
                    
                    // Hide loading screen immediately when reaching 100%
                    setTimeout(() => {
                        this.hideLoadingScreen();
                    }, 500);
                }
            }
        };
        
        // Start progress simulation
        updateProgress();
    }
    
    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        this.log('Hiding loading screen...', 'info');
        
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            // Add hidden class for robust hiding
            loadingScreen.classList.add('hidden');
            
            // Also set styles directly for immediate effect
            loadingScreen.style.opacity = '0';
            loadingScreen.style.pointerEvents = 'none';
            loadingScreen.style.visibility = 'hidden';
            loadingScreen.style.zIndex = '-1';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.log('Loading screen hidden completely', 'success');
            }, 100);
        } else {
            this.log('Loading screen element not found', 'error');
        }
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.isInitialized = false;
        this.log('Test Mode Control destroyed');
    }
}

// Export the control class
window.TestModeControl = TestModeControl;