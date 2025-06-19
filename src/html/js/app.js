/**
 * WebOS - Main Application
 * Initializes and manages the WebOS desktop environment
 */

class WebOSApp {
    constructor() {
        this.moduleLoader = null;
        this.isInitialized = false;
        this.loadingScreen = null;
        this.desktop = null;
        
        // Loading screen configuration
        this.loadingDelay = this.loadDelayFromStorage(); // Load from localStorage
        this.minLoadingTime = 1000; // Minimum loading time to show progress
    }

    /**
     * Load delay setting from localStorage
     * @returns {number} Delay in milliseconds (default: 2000)
     */
    loadDelayFromStorage() {
        try {
            const savedDelay = localStorage.getItem('webos_loading_delay');
            if (savedDelay !== null) {
                const delay = parseInt(savedDelay);
                if (!isNaN(delay) && delay >= 0 && delay <= 5000) {
                    console.log(`Loaded loading delay from storage: ${delay}ms`);
                    return delay;
                }
            }
        } catch (error) {
            console.warn('Failed to load delay from localStorage:', error);
        }
        return 2000; // Default 2 seconds
    }

    /**
     * Save delay setting to localStorage
     * @param {number} delay - Delay in milliseconds
     */
    saveDelayToStorage(delay) {
        try {
            localStorage.setItem('webos_loading_delay', delay.toString());
            console.log(`Saved loading delay to storage: ${delay}ms`);
        } catch (error) {
            console.warn('Failed to save delay to localStorage:', error);
        }
    }

    /**
     * Set loading screen delay
     * @param {number} delay - Delay in milliseconds (0-5000)
     */
    setLoadingDelay(delay) {
        // Clamp delay between 0 and 5000ms (0-5 seconds)
        this.loadingDelay = Math.max(0, Math.min(5000, delay));
        console.log(`Loading delay set to ${this.loadingDelay}ms (${this.loadingDelay / 1000}s)`);
        
        // Save to localStorage
        this.saveDelayToStorage(this.loadingDelay);
    }

    /**
     * Get current loading delay
     * @returns {number} Current delay in milliseconds
     */
    getLoadingDelay() {
        return this.loadingDelay;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing WebOS...');
            
            // Get loading screen elements
            this.loadingScreen = document.getElementById('loadingScreen');
            this.desktop = document.getElementById('desktop');
            
            if (!this.loadingScreen) {
                console.error('Loading screen not found');
                return;
            }
            
            if (!this.desktop) {
                console.error('Desktop element not found');
                return;
            }
            
            // Show loading screen with custom delay
            await this.showLoadingScreen();
            
            // Initialize module loader
            this.moduleLoader = new ModuleLoader();
            this.moduleLoader.init();
            
            // Load all modules
            await this.moduleLoader.initializeModules();
            
            // Ensure minimum loading time
            const elapsedTime = Date.now() - this.loadStartTime;
            const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);
            
            if (remainingTime > 0) {
                console.log(`Waiting ${remainingTime}ms to complete minimum loading time...`);
                await this.delay(remainingTime);
            }
            
            // Show desktop
            this.showDesktop();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Ensure desktop is interactive
            this.ensureDesktopInteractivity();
            
            // Add test button handler
            this.setupTestButton();
            
            this.isInitialized = true;
            console.log('WebOS initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize WebOS:', error);
            this.showError('Failed to initialize application');
        }
    }

    /**
     * Show loading screen with custom delay
     */
    async showLoadingScreen() {
        this.loadStartTime = Date.now();
        
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'block';
            this.loadingScreen.style.opacity = '1';
            
            // Update loading message
            const progressText = document.getElementById('progressText');
            if (progressText) {
                progressText.textContent = `Loading... (${this.loadingDelay / 1000}s delay)`;
            }
            
            console.log(`Showing loading screen for ${this.loadingDelay}ms...`);
            
            // Apply custom delay
            if (this.loadingDelay > 0) {
                await this.delay(this.loadingDelay);
            }
        }
    }

    /**
     * Utility function to create a delay
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after the delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Show the desktop
     */
    showDesktop() {
        console.log('Showing desktop...');
        if (this.desktop) {
            this.desktop.style.display = 'block';
            console.log('Desktop display set to block');
            
            // Check if desktop is visible and interactive
            const rect = this.desktop.getBoundingClientRect();
            console.log('Desktop bounds:', rect);
            console.log('Desktop computed style:', {
                display: getComputedStyle(this.desktop).display,
                visibility: getComputedStyle(this.desktop).visibility,
                pointerEvents: getComputedStyle(this.desktop).pointerEvents,
                zIndex: getComputedStyle(this.desktop).zIndex
            });
        } else {
            console.error('Desktop element not found');
        }
    }

    /**
     * Hide the loading screen
     */
    hideLoadingScreen() {
        console.log('Hiding loading screen...');
        if (this.loadingScreen) {
            // Add hidden class for robust hiding
            this.loadingScreen.classList.add('hidden');
            
            // Also set styles directly for immediate effect
            this.loadingScreen.style.opacity = '0';
            this.loadingScreen.style.pointerEvents = 'none';
            this.loadingScreen.style.visibility = 'hidden';
            this.loadingScreen.style.zIndex = '-1';
            
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                console.log('Loading screen hidden completely');
                
                // Check if loading screen is still blocking
                const rect = this.loadingScreen.getBoundingClientRect();
                console.log('Loading screen bounds after hide:', rect);
                console.log('Loading screen computed style after hide:', {
                    display: getComputedStyle(this.loadingScreen).display,
                    visibility: getComputedStyle(this.loadingScreen).visibility,
                    pointerEvents: getComputedStyle(this.loadingScreen).pointerEvents,
                    zIndex: getComputedStyle(this.loadingScreen).zIndex
                });
            }, 100); // Reduced timeout for faster hiding
        } else {
            console.error('Loading screen element not found');
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error('Application Error:', message);
        
        if (this.loadingScreen) {
            const progressText = document.getElementById('progressText');
            if (progressText) {
                progressText.textContent = `Error: ${message}`;
                progressText.style.color = '#ff6b6b';
            }
        }
    }

    /**
     * Get application statistics
     * @returns {Object} Application statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            moduleLoader: this.moduleLoader ? this.moduleLoader.getStats() : null
        };
    }

    /**
     * Setup test button for debugging
     */
    setupTestButton() {
        const testBtn = document.getElementById('testSettingsBtn');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                console.log('Test button clicked');
                if (window.settingsProcessor) {
                    console.log('Opening settings app...');
                    window.settingsProcessor.open();
                } else {
                    console.error('Settings processor not available');
                    alert('Settings processor not available. Check console for details.');
                }
            });
        }
        
        const testAboutMeBtn = document.getElementById('testAboutMeBtn');
        if (testAboutMeBtn) {
            testAboutMeBtn.addEventListener('click', () => {
                console.log('About Me test button clicked');
                if (window.aboutMeProcessor) {
                    console.log('Opening About Me app...');
                    window.aboutMeProcessor.launchAboutMe();
                } else {
                    console.error('About Me processor not available');
                    alert('About Me processor not available. Check console for details.');
                }
            });
        }
        
        const testDuplicateBtn = document.getElementById('testDuplicateBtn');
        if (testDuplicateBtn) {
            testDuplicateBtn.addEventListener('click', () => {
                console.log('Testing duplicate prevention...');
                this.testDuplicatePrevention();
            });
        }
        
        const testAnimationsBtn = document.getElementById('testAnimationsBtn');
        if (testAnimationsBtn) {
            testAnimationsBtn.addEventListener('click', () => {
                console.log('Testing animations...');
                this.testAnimations();
            });
        }
        
        const testLoadingDelayBtn = document.getElementById('testLoadingDelayBtn');
        if (testLoadingDelayBtn) {
            testLoadingDelayBtn.addEventListener('click', () => this.testLoadingDelay());
        }

        // Test loading screen button
        const testLoadingScreenBtn = document.getElementById('testLoadingScreenBtn');
        if (testLoadingScreenBtn) {
            testLoadingScreenBtn.addEventListener('click', () => this.testLoadingScreen());
        }

        // Test desktop interactivity button
        const testDesktopInteractivityBtn = document.getElementById('testDesktopInteractivityBtn');
        if (testDesktopInteractivityBtn) {
            testDesktopInteractivityBtn.addEventListener('click', () => this.testDesktopInteractivity());
        }

        // Test taskbar button
        const testTaskbarBtn = document.getElementById('testTaskbarBtn');
        if (testTaskbarBtn) {
            testTaskbarBtn.addEventListener('click', () => this.testTaskbarFunctionality());
        }

        // Test start menu button
        const testStartMenuBtn = document.getElementById('testStartMenuBtn');
        if (testStartMenuBtn) {
            testStartMenuBtn.addEventListener('click', () => this.testStartMenuFunctionality());
        }

        // Test drag and drop button
        const testDragDropBtn = document.getElementById('testDragDropBtn');
        if (testDragDropBtn) {
            testDragDropBtn.addEventListener('click', () => this.testDragDropFunctionality());
        }

        // Setup loading delay controls
        this.setupLoadingDelayControls();
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
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', () => {
                    this.setLoadingDelay(delay);
                    this.updateDelayDisplay();
                    this.highlightActiveDelayButton(delay);
                });
            }
        });

        // Restart button
        const restartBtn = document.getElementById('restartBtn');
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
     * Update the delay display
     */
    updateDelayDisplay() {
        const currentDelaySpan = document.getElementById('currentDelay');
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
            const button = document.getElementById(id);
            if (button) {
                if (delay === activeDelay) {
                    button.style.background = '#00b894';
                    button.style.fontWeight = 'bold';
                } else {
                    button.style.background = '#6c5ce7';
                    button.style.fontWeight = 'normal';
                }
            }
        });
    }

    /**
     * Restart the application with new delay setting
     */
    restartWithNewDelay() {
        console.log(`Restarting WebOS with ${this.loadingDelay}ms loading delay...`);
        
        // Show confirmation
        if (confirm(`Restart WebOS with ${this.loadingDelay / 1000}s loading delay?`)) {
            // Reload the page to restart with new delay
            window.location.reload();
        }
    }

    /**
     * Test duplicate icon prevention
     */
    testDuplicatePrevention() {
        console.log('=== Testing Duplicate Icon Prevention ===');
        
        // Test 1: Try to register the same app multiple times
        if (window.eventBus) {
            console.log('Test 1: Attempting to register About Me app multiple times...');
            
            for (let i = 0; i < 3; i++) {
                window.eventBus.emit('registerApp', {
                    id: 'aboutme',
                    name: 'About Me',
                    icon: '👤',
                    handler: () => console.log('About Me clicked')
                });
            }
            
            console.log('Test 1 completed. Check console for duplicate prevention messages.');
        }
        
        // Test 2: Try to register Calculator app multiple times
        if (window.eventBus) {
            console.log('Test 2: Attempting to register Calculator app multiple times...');
            
            for (let i = 0; i < 3; i++) {
                window.eventBus.emit('registerApp', {
                    id: 'calculator',
                    name: 'Calculator',
                    icon: '🧮',
                    handler: () => console.log('Calculator clicked')
                });
            }
            
            console.log('Test 2 completed. Check console for duplicate prevention messages.');
        }
        
        // Test 3: Check registered apps
        if (window.desktopIcons) {
            const registeredApps = window.desktopIcons.getRegisteredApps();
            console.log('Test 3: Currently registered apps:', registeredApps);
        }
        
        if (window.startMenu) {
            const startMenuApps = window.startMenu.getRegisteredApps();
            console.log('Test 3: Start menu registered apps:', startMenuApps);
        }
        
        console.log('=== Duplicate Prevention Test Complete ===');
    }

    /**
     * Test animation functionality
     */
    testAnimations() {
        console.log('=== Testing Animation System ===');
        
        // Test 1: Check if animations module is loaded
        if (window.animations) {
            console.log('Test 1: Animations module is loaded');
            const stats = window.animations.getStats();
            console.log('Animation stats:', stats);
        } else {
            console.error('Test 1: Animations module not found');
        }
        
        // Test 2: Test fade-in animation
        if (window.animations) {
            console.log('Test 2: Testing fade-in animation...');
            const testElement = document.createElement('div');
            testElement.style.position = 'fixed';
            testElement.style.top = '100px';
            testElement.style.left = '100px';
            testElement.style.width = '100px';
            testElement.style.height = '100px';
            testElement.style.background = 'red';
            testElement.style.zIndex = '10000';
            testElement.textContent = 'Test Animation';
            document.body.appendChild(testElement);
            
            // Test fade-in
            window.animations.fadeIn(testElement, 1000);
            
            // Remove after 2 seconds
            setTimeout(() => {
                window.animations.fadeOut(testElement, 500);
            }, 2000);
        }
        
        // Test 3: Test slide-in animation
        if (window.animations) {
            console.log('Test 3: Testing slide-in animation...');
            const testElement2 = document.createElement('div');
            testElement2.style.position = 'fixed';
            testElement2.style.top = '250px';
            testElement2.style.left = '100px';
            testElement2.style.width = '100px';
            testElement2.style.height = '100px';
            testElement2.style.background = 'blue';
            testElement2.style.zIndex = '10000';
            testElement2.textContent = 'Slide Test';
            document.body.appendChild(testElement2);
            
            // Test slide-in from left
            window.animations.slideIn(testElement2, 'left', 1000);
            
            // Remove after 3 seconds
            setTimeout(() => {
                if (testElement2.parentNode) {
                    testElement2.parentNode.removeChild(testElement2);
                }
            }, 3000);
        }
        
        // Test 4: Check CSS animations
        console.log('Test 4: Checking CSS animation classes...');
        const animationClasses = [
            '.desktop-icon:hover',
            '.window-control:hover',
            '.app-item:hover',
            '.taskbar-item:hover',
            '.start-button:hover'
        ];
        
        animationClasses.forEach(selector => {
            const elements = document.querySelectorAll(selector.replace(':hover', ''));
            console.log(`${selector}: ${elements.length} elements found`);
        });
        
        console.log('=== Animation Test Complete ===');
    }

    /**
     * Test loading delay functionality
     */
    testLoadingDelay() {
        console.log('=== Testing Loading Delay System ===');
        
        // Test 1: Check current delay
        const currentDelay = this.getLoadingDelay();
        console.log(`Test 1: Current loading delay: ${currentDelay}ms (${currentDelay / 1000}s)`);
        
        // Test 2: Test different delay settings
        console.log('Test 2: Testing different delay settings...');
        const testDelays = [0, 1000, 2000, 3000, 5000];
        
        testDelays.forEach(delay => {
            this.setLoadingDelay(delay);
            console.log(`  Set delay to ${delay}ms (${delay / 1000}s)`);
        });
        
        // Reset to original delay
        this.setLoadingDelay(currentDelay);
        console.log(`Reset delay to original: ${currentDelay}ms`);
        
        // Test 3: Check localStorage
        console.log('Test 3: Checking localStorage...');
        try {
            const savedDelay = localStorage.getItem('webos_loading_delay');
            console.log(`  Saved delay in localStorage: ${savedDelay}ms`);
        } catch (error) {
            console.error('  Failed to read localStorage:', error);
        }
        
        // Test 4: Show delay controls info
        console.log('Test 4: Loading delay controls available:');
        console.log('  - Use the purple buttons (0s, 1s, 2s, 3s, 5s) to change delay');
        console.log('  - Click "Restart with New Delay" to apply changes');
        console.log('  - Settings are saved to localStorage');
        
        console.log('=== Loading Delay Test Complete ===');
    }

    /**
     * Test loading screen positioning and functionality
     */
    testLoadingScreen() {
        console.log('=== Testing Loading Screen ===');
        
        // Test 1: Check loading screen element
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            console.log('Test 1: Loading screen element found');
            const rect = loadingScreen.getBoundingClientRect();
            console.log(`  Position: top=${rect.top}, left=${rect.left}`);
            console.log(`  Size: width=${rect.width}, height=${rect.height}`);
            console.log(`  CSS position: ${getComputedStyle(loadingScreen).position}`);
            console.log(`  CSS display: ${getComputedStyle(loadingScreen).display}`);
        } else {
            console.error('Test 1: Loading screen element not found');
        }
        
        // Test 2: Check loading content positioning
        const loadingContent = document.querySelector('.loading-content');
        if (loadingContent) {
            console.log('Test 2: Loading content element found');
            const rect = loadingContent.getBoundingClientRect();
            console.log(`  Position: top=${rect.top}, left=${rect.left}`);
            console.log(`  Size: width=${rect.width}, height=${rect.height}`);
            console.log(`  CSS text-align: ${getComputedStyle(loadingContent).textAlign}`);
        } else {
            console.error('Test 2: Loading content element not found');
        }
        
        // Test 3: Check logo positioning
        const logo = document.querySelector('.windows-logo');
        if (logo) {
            console.log('Test 3: Logo element found');
            const rect = logo.getBoundingClientRect();
            console.log(`  Position: top=${rect.top}, left=${rect.left}`);
            console.log(`  Size: width=${rect.width}, height=${rect.height}`);
            console.log(`  CSS font-size: ${getComputedStyle(logo).fontSize}`);
        } else {
            console.error('Test 3: Logo element not found');
        }
        
        // Test 4: Check progress bar positioning
        const progressBar = document.querySelector('.loading-progress');
        if (progressBar) {
            console.log('Test 4: Progress bar element found');
            const rect = progressBar.getBoundingClientRect();
            console.log(`  Position: top=${rect.top}, left=${rect.left}`);
            console.log(`  Size: width=${rect.width}, height=${rect.height}`);
        } else {
            console.error('Test 4: Progress bar element not found');
        }
        
        // Test 5: Check progress fill element
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            console.log('Test 5: Progress fill element found');
            console.log(`  Current width: ${getComputedStyle(progressFill).width}`);
        } else {
            console.error('Test 5: Progress fill element not found');
        }
        
        // Test 6: Check progress text element
        const progressText = document.getElementById('progressText');
        if (progressText) {
            console.log('Test 6: Progress text element found');
            console.log(`  Current text: "${progressText.textContent}"`);
            console.log(`  CSS position: ${getComputedStyle(progressText).position}`);
        } else {
            console.error('Test 6: Progress text element not found');
        }
        
        // Test 7: Test progress bar functionality
        if (progressFill) {
            console.log('Test 7: Testing progress bar functionality...');
            
            // Test different progress values
            const testProgresses = [0, 25, 50, 75, 100];
            let currentIndex = 0;
            
            const testProgress = () => {
                if (currentIndex < testProgresses.length) {
                    const progress = testProgresses[currentIndex];
                    progressFill.style.width = `${progress}%`;
                    console.log(`  Set progress to ${progress}%`);
                    currentIndex++;
                    setTimeout(testProgress, 500);
                } else {
                    // Reset to 0
                    progressFill.style.width = '0%';
                    console.log('  Reset progress to 0%');
                }
            };
            
            testProgress();
        }
        
        console.log('=== Loading Screen Test Complete ===');
    }

    /**
     * Test desktop interactivity and identify blocking elements
     */
    testDesktopInteractivity() {
        console.log('=== Testing Desktop Interactivity ===');
        
        // Test 1: Check loading screen status
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            console.log('Test 1: Loading screen status');
            const rect = loadingScreen.getBoundingClientRect();
            const style = getComputedStyle(loadingScreen);
            console.log(`  Bounds: ${rect.width}x${rect.height} at (${rect.left},${rect.top})`);
            console.log(`  Display: ${style.display}`);
            console.log(`  Visibility: ${style.visibility}`);
            console.log(`  Pointer Events: ${style.pointerEvents}`);
            console.log(`  Z-Index: ${style.zIndex}`);
            console.log(`  Opacity: ${style.opacity}`);
        }
        
        // Test 2: Check desktop status
        const desktop = document.getElementById('desktop');
        if (desktop) {
            console.log('Test 2: Desktop status');
            const rect = desktop.getBoundingClientRect();
            const style = getComputedStyle(desktop);
            console.log(`  Bounds: ${rect.width}x${rect.height} at (${rect.left},${rect.top})`);
            console.log(`  Display: ${style.display}`);
            console.log(`  Visibility: ${style.visibility}`);
            console.log(`  Pointer Events: ${style.pointerEvents}`);
            console.log(`  Z-Index: ${style.zIndex}`);
        }
        
        // Test 3: Check for overlapping elements
        console.log('Test 3: Checking for overlapping elements...');
        const allElements = document.querySelectorAll('*');
        const overlappingElements = [];
        
        allElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            
            // Check if element covers the screen and has high z-index
            if (rect.width > 100 && rect.height > 100 && 
                rect.left <= 0 && rect.top <= 0 &&
                parseInt(style.zIndex) > 1000 &&
                style.display !== 'none' &&
                style.visibility !== 'hidden') {
                
                overlappingElements.push({
                    element: element,
                    tagName: element.tagName,
                    className: element.className,
                    id: element.id,
                    zIndex: style.zIndex,
                    pointerEvents: style.pointerEvents,
                    bounds: rect
                });
            }
        });
        
        if (overlappingElements.length > 0) {
            console.log('  Found potentially blocking elements:');
            overlappingElements.forEach(item => {
                console.log(`    ${item.tagName}.${item.className}#${item.id} - z-index: ${item.zIndex}, pointer-events: ${item.pointerEvents}`);
            });
        } else {
            console.log('  No obvious blocking elements found');
        }
        
        // Test 4: Test desktop click events
        console.log('Test 4: Testing desktop click events...');
        if (desktop) {
            desktop.addEventListener('click', (e) => {
                console.log('  Desktop clicked!', e);
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
            console.log('  Click event dispatched to desktop');
        }
        
        // Test 5: Check if any global event listeners are preventing interaction
        console.log('Test 5: Checking for global event listeners...');
        const testElement = document.createElement('div');
        testElement.style.cssText = 'position: fixed; top: 50%; left: 50%; width: 100px; height: 100px; background: red; z-index: 9998;';
        testElement.textContent = 'Test Element';
        document.body.appendChild(testElement);
        
        setTimeout(() => {
            console.log('  Test element should be visible and clickable');
            testElement.addEventListener('click', () => {
                console.log('  Test element clicked!');
                document.body.removeChild(testElement);
            });
        }, 1000);
        
        // Test 6: Test taskbar icon and text functionality
        this.testTaskbarFunctionality();
        
        console.log('=== Desktop Interactivity Test Complete ===');
    }

    /**
     * Test taskbar icon and text functionality
     */
    testTaskbarFunctionality() {
        console.log('=== Testing Taskbar Functionality ===');
        
        // Test 1: Check taskbar element
        const taskbar = document.getElementById('taskbar');
        if (taskbar) {
            console.log('Test 1: Taskbar element found');
            const rect = taskbar.getBoundingClientRect();
            console.log(`  Bounds: ${rect.width}x${rect.height} at (${rect.left},${rect.top})`);
            console.log(`  CSS display: ${getComputedStyle(taskbar).display}`);
        } else {
            console.error('Test 1: Taskbar element not found');
        }
        
        // Test 2: Check taskbar items container
        const taskbarItems = document.querySelector('.taskbar-items');
        if (taskbarItems) {
            console.log('Test 2: Taskbar items container found');
            const items = taskbarItems.querySelectorAll('.taskbar-item');
            console.log(`  Number of taskbar items: ${items.length}`);
            
            items.forEach((item, index) => {
                const icon = item.querySelector('.taskbar-icon');
                const title = item.querySelector('.taskbar-title');
                console.log(`  Item ${index + 1}:`);
                console.log(`    Icon: ${icon ? icon.textContent : 'undefined'}`);
                console.log(`    Title: ${title ? title.textContent : 'undefined'}`);
                console.log(`    Width: ${getComputedStyle(item).width}`);
                console.log(`    Height: ${getComputedStyle(item).height}`);
            });
        } else {
            console.error('Test 2: Taskbar items container not found');
        }
        
        // Test 3: Test creating a taskbar item
        console.log('Test 3: Testing taskbar item creation...');
        if (window.eventBus) {
            // Simulate window creation event
            window.eventBus.emit('windowCreated', {
                id: 'test-window-' + Date.now(),
                title: 'Test Application with Long Name',
                icon: '🧪'
            });
            
            setTimeout(() => {
                const newItems = taskbarItems ? taskbarItems.querySelectorAll('.taskbar-item') : [];
                console.log(`  New total taskbar items: ${newItems.length}`);
                
                if (newItems.length > 0) {
                    const lastItem = newItems[newItems.length - 1];
                    const icon = lastItem.querySelector('.taskbar-icon');
                    const title = lastItem.querySelector('.taskbar-title');
                    console.log(`  Latest item:`);
                    console.log(`    Icon: ${icon ? icon.textContent : 'undefined'}`);
                    console.log(`    Title: ${title ? title.textContent : 'undefined'}`);
                    console.log(`    Width: ${getComputedStyle(lastItem).width}`);
                    console.log(`    Height: ${getComputedStyle(lastItem).height}`);
                    
                    // Test click functionality
                    lastItem.addEventListener('click', () => {
                        console.log('  Taskbar item clicked!');
                    });
                    
                    // Simulate click
                    lastItem.click();
                }
            }, 100);
        }
        
        // Test 4: Test responsive behavior
        console.log('Test 4: Testing responsive behavior...');
        const testItem = document.createElement('div');
        testItem.className = 'taskbar-item';
        testItem.innerHTML = `
            <div class="taskbar-icon">📱</div>
            <div class="taskbar-title">Very Long Application Name That Should Truncate</div>
        `;
        
        if (taskbarItems) {
            taskbarItems.appendChild(testItem);
            console.log(`  Test item added with long name`);
            console.log(`  Width: ${getComputedStyle(testItem).width}`);
            console.log(`  Title overflow: ${getComputedStyle(testItem.querySelector('.taskbar-title')).textOverflow}`);
            
            // Remove test item after 2 seconds
            setTimeout(() => {
                testItem.remove();
                console.log('  Test item removed');
            }, 2000);
        }
        
        console.log('=== Taskbar Functionality Test Complete ===');
    }

    /**
     * Test start menu icon and text functionality
     */
    testStartMenuFunctionality() {
        console.log('=== Testing Start Menu Functionality ===');
        
        // Test 1: Check start menu element
        const startMenu = document.getElementById('startMenu');
        if (startMenu) {
            console.log('Test 1: Start menu element found');
            const rect = startMenu.getBoundingClientRect();
            console.log(`  Bounds: ${rect.width}x${rect.height} at (${rect.left},${rect.top})`);
            console.log(`  CSS display: ${getComputedStyle(startMenu).display}`);
        } else {
            console.error('Test 1: Start menu element not found');
        }
        
        // Test 2: Check app list container
        const appList = document.querySelector('#startMenuApps');
        if (appList) {
            console.log('Test 2: App list container found');
            const items = appList.querySelectorAll('.app-item');
            console.log(`  Number of app items: ${items.length}`);
            
            items.forEach((item, index) => {
                const icon = item.querySelector('.app-icon');
                const name = item.querySelector('.app-name');
                console.log(`  App ${index + 1}:`);
                console.log(`    Icon: ${icon ? icon.textContent : 'undefined'}`);
                console.log(`    Name: ${name ? name.textContent : 'undefined'}`);
                console.log(`    Width: ${getComputedStyle(item).width}`);
                console.log(`    Height: ${getComputedStyle(item).height}`);
                console.log(`    CSS class: ${item.className}`);
            });
        } else {
            console.error('Test 2: App list container not found');
        }
        
        // Test 3: Test start menu toggle
        console.log('Test 3: Testing start menu toggle...');
        if (window.eventBus) {
            // Toggle start menu open
            window.eventBus.emit('toggleStartMenu');
            
            setTimeout(() => {
                console.log(`  Start menu display: ${getComputedStyle(startMenu).display}`);
                console.log(`  Start menu opacity: ${getComputedStyle(startMenu).opacity}`);
                
                // Toggle start menu closed
                window.eventBus.emit('toggleStartMenu');
            }, 500);
        }
        
        // Test 4: Test app registration
        console.log('Test 4: Testing app registration...');
        if (window.eventBus) {
            // Simulate app registration
            window.eventBus.emit('registerApp', {
                id: 'test-app-' + Date.now(),
                name: 'Test Application with Long Name',
                icon: '🧪',
                handler: () => console.log('Test app clicked!')
            });
            
            setTimeout(() => {
                const newItems = appList ? appList.querySelectorAll('.app-item') : [];
                console.log(`  New total app items: ${newItems.length}`);
                
                if (newItems.length > 0) {
                    const lastItem = newItems[newItems.length - 1];
                    const icon = lastItem.querySelector('.app-icon');
                    const name = lastItem.querySelector('.app-name');
                    console.log(`  Latest app item:`);
                    console.log(`    Icon: ${icon ? icon.textContent : 'undefined'}`);
                    console.log(`    Name: ${name ? name.textContent : 'undefined'}`);
                    console.log(`    Width: ${getComputedStyle(lastItem).width}`);
                    console.log(`    Height: ${getComputedStyle(lastItem).height}`);
                    
                    // Test click functionality
                    lastItem.addEventListener('click', () => {
                        console.log('  App item clicked!');
                    });
                    
                    // Simulate click
                    lastItem.click();
                }
            }, 100);
        }
        
        // Test 5: Test responsive behavior
        console.log('Test 5: Testing responsive behavior...');
        const testItem = document.createElement('div');
        testItem.className = 'app-item';
        testItem.innerHTML = `
            <div class="app-icon">📱</div>
            <div class="app-name">Very Long Application Name That Should Truncate</div>
        `;
        
        if (appList) {
            appList.appendChild(testItem);
            console.log(`  Test app item added with long name`);
            console.log(`  Width: ${getComputedStyle(testItem).width}`);
            console.log(`  Height: ${getComputedStyle(testItem).height}`);
            console.log(`  Name overflow: ${getComputedStyle(testItem.querySelector('.app-name')).textOverflow}`);
            
            // Remove test item after 3 seconds
            setTimeout(() => {
                testItem.remove();
                console.log('  Test app item removed');
            }, 3000);
        }
        
        console.log('=== Start Menu Functionality Test Complete ===');
    }

    /**
     * Test drag and drop functionality
     */
    testDragDropFunctionality() {
        console.log('=== Testing Drag and Drop Functionality ===');
        
        // Check if desktop icons module is available
        if (!window.desktopIcons) {
            console.error('Desktop Icons module not available');
            alert('Desktop Icons module not available. Check console for details.');
            return;
        }
        
        console.log('Test 1: Checking desktop icons module...');
        const desktopIcons = window.desktopIcons;
        console.log(`  Module initialized: ${desktopIcons.isInitialized}`);
        console.log(`  Registered apps: ${desktopIcons.getRegisteredApps().length}`);
        
        // Test 2: Check icon positions
        console.log('Test 2: Checking icon positions...');
        const positions = desktopIcons.getIconPositions();
        console.log(`  Saved positions: ${positions.size}`);
        positions.forEach((position, appId) => {
            console.log(`    ${appId}: x=${position.x}, y=${position.y}`);
        });
        
        // Test 3: Test icon positioning
        console.log('Test 3: Testing icon positioning...');
        const desktop = document.getElementById('desktop');
        const icons = desktop ? desktop.querySelectorAll('.desktop-icon') : [];
        console.log(`  Current desktop icons: ${icons.length}`);
        
        icons.forEach((icon, index) => {
            const appId = icon.dataset.appId;
            const left = parseInt(icon.style.left) || 0;
            const top = parseInt(icon.style.top) || 0;
            console.log(`    Icon ${index + 1} (${appId}): left=${left}px, top=${top}px`);
            
            // Check if icon is properly positioned
            if (left >= 0 && top >= 0) {
                console.log(`      ✓ Properly positioned`);
            } else {
                console.log(`      ✗ Positioning issue`);
            }
        });
        
        // Test 4: Test drag functionality simulation
        console.log('Test 4: Testing drag functionality...');
        if (icons.length > 0) {
            const testIcon = icons[0];
            const appId = testIcon.dataset.appId;
            const originalLeft = parseInt(testIcon.style.left) || 0;
            const originalTop = parseInt(testIcon.style.top) || 0;
            
            console.log(`  Testing drag on icon: ${appId}`);
            console.log(`  Original position: x=${originalLeft}, y=${originalTop}`);
            
            // Simulate mouse events for drag
            const rect = testIcon.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Mouse down
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY,
                button: 0
            });
            testIcon.dispatchEvent(mouseDownEvent);
            
            // Mouse move (simulate drag)
            setTimeout(() => {
                const mouseMoveEvent = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: centerX + 50,
                    clientY: centerY + 50
                });
                document.dispatchEvent(mouseMoveEvent);
                
                // Mouse up
                setTimeout(() => {
                    const mouseUpEvent = new MouseEvent('mouseup', {
                        bubbles: true,
                        cancelable: true,
                        clientX: centerX + 50,
                        clientY: centerY + 50
                    });
                    document.dispatchEvent(mouseUpEvent);
                    
                    // Check new position
                    setTimeout(() => {
                        const newLeft = parseInt(testIcon.style.left) || 0;
                        const newTop = parseInt(testIcon.style.top) || 0;
                        console.log(`  New position: x=${newLeft}, y=${newTop}`);
                        
                        if (newLeft !== originalLeft || newTop !== originalTop) {
                            console.log(`  ✓ Drag functionality working`);
                        } else {
                            console.log(`  ✗ Drag functionality not working`);
                        }
                        
                        // Reset position
                        testIcon.style.left = `${originalLeft}px`;
                        testIcon.style.top = `${originalTop}px`;
                        desktopIcons.iconPositions.set(appId, { x: originalLeft, y: originalTop });
                        desktopIcons.saveIconPositions();
                        console.log(`  Position reset to original`);
                    }, 100);
                }, 100);
            }, 100);
        }
        
        // Test 5: Test position saving
        console.log('Test 5: Testing position saving...');
        const testPositions = {
            'test-app-1': { x: 100, y: 100 },
            'test-app-2': { x: 200, y: 150 }
        };
        
        // Save test positions
        testPositions.forEach((position, appId) => {
            desktopIcons.iconPositions.set(appId, position);
        });
        desktopIcons.saveIconPositions();
        console.log(`  Test positions saved`);
        
        // Clear and reload positions
        desktopIcons.iconPositions.clear();
        desktopIcons.loadIconPositions();
        
        const reloadedPositions = desktopIcons.getIconPositions();
        let positionsMatch = true;
        testPositions.forEach((position, appId) => {
            const saved = reloadedPositions.get(appId);
            if (!saved || saved.x !== position.x || saved.y !== position.y) {
                positionsMatch = false;
            }
        });
        
        if (positionsMatch) {
            console.log(`  ✓ Position saving/loading working`);
        } else {
            console.log(`  ✗ Position saving/loading not working`);
        }
        
        // Clean up test positions
        testPositions.forEach((position, appId) => {
            desktopIcons.iconPositions.delete(appId);
        });
        desktopIcons.saveIconPositions();
        
        // Test 6: Test reset functionality
        console.log('Test 6: Testing reset functionality...');
        const originalPositions = new Map(desktopIcons.getIconPositions());
        
        // Move an icon to a random position
        if (icons.length > 0) {
            const testIcon = icons[0];
            const appId = testIcon.dataset.appId;
            testIcon.style.left = '500px';
            testIcon.style.top = '300px';
            desktopIcons.iconPositions.set(appId, { x: 500, y: 300 });
            console.log(`  Moved icon ${appId} to test position`);
        }
        
        // Reset positions
        desktopIcons.resetIconPositions();
        console.log(`  Positions reset`);
        
        // Check if positions were reset
        const resetPositions = desktopIcons.getIconPositions();
        if (resetPositions.size === 0) {
            console.log(`  ✓ Reset functionality working`);
        } else {
            console.log(`  ✗ Reset functionality not working`);
        }
        
        console.log('=== Drag and Drop Functionality Test Complete ===');
    }

    /**
     * Ensure desktop is interactive
     */
    ensureDesktopInteractivity() {
        console.log('Ensuring desktop is interactive...');
        
        // Check if desktop is visible and interactive
        const desktop = document.getElementById('desktop');
        if (desktop) {
            // Ensure desktop is properly displayed
            desktop.style.display = 'block';
            desktop.style.visibility = 'visible';
            desktop.style.pointerEvents = 'auto';
            desktop.style.zIndex = '1';
            
            console.log('Desktop is visible and interactive');
            
            // Ensure desktop is interactive
            const rect = desktop.getBoundingClientRect();
            console.log('Desktop bounds:', rect);
            console.log('Desktop computed style:', {
                display: getComputedStyle(desktop).display,
                visibility: getComputedStyle(desktop).visibility,
                pointerEvents: getComputedStyle(desktop).pointerEvents,
                zIndex: getComputedStyle(desktop).zIndex
            });
        } else {
            console.error('Desktop element not found');
        }
        
        // Check for and remove any blocking elements
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            // Force hide loading screen completely
            loadingScreen.style.display = 'none';
            loadingScreen.style.visibility = 'hidden';
            loadingScreen.style.pointerEvents = 'none';
            loadingScreen.style.opacity = '0';
            loadingScreen.style.zIndex = '-1';
            loadingScreen.classList.add('hidden');
            
            console.log('Loading screen forcefully hidden');
        }
        
        // Check for any other high z-index elements that might be blocking
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const style = getComputedStyle(element);
            const zIndex = parseInt(style.zIndex);
            
            // If element has very high z-index and covers the screen, check if it should be blocking
            if (zIndex > 5000 && element !== loadingScreen) {
                const rect = element.getBoundingClientRect();
                if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.8) {
                    console.warn(`Found potentially blocking element: ${element.tagName}.${element.className}#${element.id} with z-index ${zIndex}`);
                    
                    // If it's not supposed to be blocking, remove it
                    if (element.classList.contains('loading-screen') || element.id === 'loadingScreen') {
                        element.style.display = 'none';
                        element.style.visibility = 'hidden';
                        element.style.pointerEvents = 'none';
                        console.log('Removed blocking loading screen element');
                    }
                }
            }
        });
        
        // Test desktop click functionality
        if (desktop) {
            // Add a test click handler
            const testClickHandler = (e) => {
                console.log('Desktop click test successful!', e);
                desktop.removeEventListener('click', testClickHandler);
            };
            
            desktop.addEventListener('click', testClickHandler);
            
            // Simulate a test click
            setTimeout(() => {
                const testEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: 100,
                    clientY: 100
                });
                desktop.dispatchEvent(testEvent);
            }, 100);
        }
        
        console.log('Desktop interactivity check complete');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting WebOS...');
    
    // Create and initialize the application
    window.webOSApp = new WebOSApp();
    window.webOSApp.init();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Re-center any centered windows
    if (window.windowManager) {
        const windows = window.windowManager.getAllWindows();
        for (const [windowId, windowData] of windows) {
            if (windowData.data.centered) {
                window.windowManager.centerWindow(
                    windowData.element,
                    windowData.element.offsetWidth,
                    windowData.element.offsetHeight
                );
            }
        }
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Handle beforeunload
window.addEventListener('beforeunload', () => {
    console.log('Application shutting down...');
    
    // Cleanup modules
    if (window.webOSApp && window.webOSApp.moduleLoader) {
        const modules = window.webOSApp.moduleLoader.getAllModules();
        for (const [moduleName, module] of modules) {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        }
    }
});

// Export the main app class
window.WebOSApp = WebOSApp; 