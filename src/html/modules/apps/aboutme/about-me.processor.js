/**
 * My Desktop - About Me Processor
 * Handles the About Me application logic and data management
 */

class AboutMeProcessor {
    constructor() {
        this.eventBus = null;
        this.templateLoader = null;
        this.windowManager = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the About Me processor
     * @param {Object} dependencies - Required dependencies
     */
    init(dependencies = {}) {
        // Prevent duplicate initialization
        if (this.isInitialized) {
            console.log('AboutMeProcessor: Already initialized, skipping');
            return true;
        }
        
        this.eventBus = dependencies.eventBus || window.eventBus;
        this.templateLoader = dependencies.templateLoader || window.templateLoader;
        this.windowManager = dependencies.windowManager || window.windowManager;
        
        if (!this.eventBus || !this.templateLoader || !this.windowManager) {
            console.error('AboutMeProcessor: Required dependencies not available');
            return false;
        }
        
        this.bindEvents();
        this.registerApp();
        this.isInitialized = true;
        
        console.log('About Me Processor initialized');
        return true;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Listen for about me app launch requests
        this.eventBus.on('launchApp', (data) => {
            if (data.appName === 'aboutme') {
                this.launchAboutMe();
            }
        });
    }

    /**
     * Register the app with the system
     */
    registerApp() {
        if (this.eventBus) {
            this.eventBus.emit('registerApp', {
                id: 'aboutme',
                name: 'About Me',
                icon: '👤',
                handler: () => this.launchAboutMe(),
                display: ["desktop", "startmenu"]
            });
        }
    }

    /**
     * Launch the About Me application
     */
    async launchAboutMe() {
        try {
            // Load the about me template
            const template = await this.templateLoader.loadTemplate('apps/aboutme/about-me.html');
            
            if (!template) {
                console.error('Failed to load about me template');
                return;
            }
            
            // Create window configuration
            const windowId = 'about-me-' + Date.now();
            const windowConfig = {
                id: windowId,
                title: 'About Me',
                icon: '👤',
                content: template,
                width: 680,
                height: 500,
                resizable: true,
                centered: true,
                draggable: true,
                data: {
                    fullName: 'Vu Quang Trung',
                    avatar: 'modules/apps/aboutme/images/vu-quang-trung.jpg',
                    tagline: '⚡NET Team Lead | Senior Software Architect | Database optimization⚡',
                    introduction: `I am a software engineer with a passion for building scalable and efficient systems. 
                    I have a strong background in .NET development and have worked on a variety of projects, 
                    including e-commerce platforms, mobile applications, and web services.`,
                    email: 'trungvu.evolution@gmail.com',
                    linkedin: 'https://www.linkedin.com/in/vu-quang-trung',
                    github: 'https://github.com/quangtrungsoft',
                    projects: [
                        {
                            title: 'My Desktop',
                            description: `My Desktop is a personal, interactive web-based desktop environment that showcases creativity and skills. It's a unique blend of portfolio, personal website, and interactive experience.`,
                            links: [
                                { label: 'Live Demo', url: 'https://yourusername.github.io/my-desktop' },
                                { label: 'GitHub', url: 'https://github.com/yourusername/my-desktop' }
                            ]
                        },
                        {
                            title: 'BreadMaster',
                            description: 'Artisan bread recipe tracker and community platform built with modern web technologies.',
                            links: [
                                { label: 'Live Demo', url: 'https://breadmaster.app' },
                                { label: 'GitHub', url: 'https://github.com/quangtrungsoft/breadmaster' }
                            ]
                        },
                        {
                            title: 'ERPify',
                            description: 'Modular ERP system designed for small businesses with customizable modules.',
                            links: [
                                { label: 'Documentation', url: 'https://erpify.dev' },
                                { label: 'GitHub', url: 'https://github.com/quangtrungsoft/erpify' }
                            ]
                        },
                        {
                            title: 'RecipeShare',
                            description: 'Social platform for sharing and discovering recipes with community features.',
                            links: [
                                { label: 'Live Demo', url: 'https://recipeshare.social' },
                                { label: 'GitHub', url: 'https://github.com/quangtrungsoft/recipeshare' }
                            ]
                        },
                        {
                            title: 'TaskFlow',
                            description: 'Productivity app for managing daily tasks and building better habits.',
                            links: [
                                { label: 'Live Demo', url: 'https://taskflow.app' },
                                { label: 'GitHub', url: 'https://github.com/quangtrungsoft/taskflow' }
                            ]
                        },
                        {
                            title: 'BakeCam',
                            description: 'Smart camera app for monitoring bread proofing and baking with AI assistance.',
                            links: [
                                { label: 'App Store', url: 'https://apps.apple.com/bakecam' },
                                { label: 'GitHub', url: 'https://github.com/quangtrungsoft/bakecam' }
                            ]
                        }
                    ]
                },
                onWindowCreated: (windowElement) => {
                    if (!windowElement) return;
                    if (!window.aboutMeControl) window.aboutMeControl = new AboutMeControl(this);
                    window.aboutMeControl.init(windowId, windowElement);
                }
            };
            
            // Create and show the window
            this.windowManager.createWindow(windowConfig);
            
            console.log('About Me application launched');
            
        } catch (error) {
            console.error('Failed to launch About Me:', error);
        }
    }

    /**
     * Get About Me processor statistics
     * @returns {Object} Processor statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            name: 'AboutMeProcessor'
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.isInitialized = false;
        console.log('About Me Processor destroyed');
    }
}

// Export the About Me processor class
window.AboutMeProcessor = AboutMeProcessor; 