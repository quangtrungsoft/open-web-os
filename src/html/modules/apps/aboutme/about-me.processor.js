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
                            description: `A personal, interactive web-based desktop environment that showcases creativity and skills. It's a unique blend of portfolio, personal website, and interactive experience.`,
                            links: [
                                { label: 'Live Demo', url: 'https://vuquangtrung.io.vn' },
                                { label: 'GitHub', url: 'https://github.com/quangtrungsoft/my-desktop' }
                            ]
                        },
                        {
                            title: 'Open Jourual Submit',
                            description: 'An online journal management system that streamlines submission, peer review, and publishing. With a user-friendly and customizable interface, it helps academic organizations save time and improve editorial efficiency.',
                            links: []
                        },
                        {
                            title: 'Open ERP',
                            description: 'Designed for small businesses with customizable modules.',
                            links: []
                        },
                        {
                            title: 'Payment gateway',
                            description: 'An open-source payment platform that connects banks and e-wallets. It features modular architecture for easy integration, enabling fast, secure, and scalable online transactions for diverse business needs.',
                            links: []
                        },
                    ],
                    latestPosts: [
                        {
                            title: 'The Art of Clean Code: Beyond the Basics',
                            summary: 'Exploring advanced principles of writing maintainable and readable code that stands the test of time.',
                            link: '#'
                        },
                        {
                            title: 'Database Optimization: A Deep Dive into Indexing',
                            summary: 'How to properly use database indexes to dramatically improve query performance.',
                            link: '#'
                        },
                        {
                            title: 'Microservices vs. Monoliths: A Pragmatic Approach',
                            summary: 'Breaking down the pros and cons of each architectural style and when to use them.',
                            link: '#'
                        },
                        {
                            title: 'The Power of Asynchronous Programming in .NET',
                            summary: 'A practical guide to using async/await to build responsive and scalable applications.',
                            link: '#'
                        },
                        {
                            title: 'Securing Your Web Applications: Best Practices',
                            summary: 'An overview of common security vulnerabilities and how to protect your apps from them.',
                            link: '#'
                        }
                    ]
                },
                onWindowCreated: (windowElement) => {
                    if (!windowElement) return;
                    if (!window.aboutMeControl) window.aboutMeControl = new AboutMeControl(this);
                    window.aboutMeControl.init(windowId, windowElement, windowConfig.data);
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
     * Handle booking actions from the control layer
     * @param {string} action - The booking action to perform
     * @param {HTMLElement} windowElement - The window element
     */
    handleBookingAction(action, windowElement) {
        let notification = {
            title: 'Booking Request',
            message: '',
            icon: '📅'
        };

        switch (action) {
            case 'cv':
                notification.message = 'Your CV download will begin shortly.';
                notification.icon = '⬇️';
                // In a real app, you would trigger a file download here
                // window.location.href = '/path/to/cv.pdf';
                break;
            case 'feedback':
                notification.message = 'Thank you for your feedback! We will get back to you soon.';
                notification.icon = '✉️';
                // In a real app, you might open a feedback form or mail client
                // window.open('mailto:trungvu.evolution@gmail.com?subject=Feedback');
                break;
            case 'callback':
                notification.message = 'We have received your callback request. We will call you back within 24 hours.';
                notification.icon = '📞';
                break;
            case 'dev':
                notification.message = 'Your development request has been submitted. We will contact you to discuss the details.';
                notification.icon = '💻';
                break;
            case 'consult':
                notification.message = 'Your consultation request has been scheduled. Please check your email for confirmation.';
                notification.icon = '🗓️';
                break;
            default:
                notification.title = 'Unknown Action';
                notification.message = `The action "${action}" is not recognized.`;
                notification.icon = '❓';
                break;
        }

        if (this.eventBus) {
            this.eventBus.emit('showNotification', notification);
        } else {
            console.error('EventBus not available for notifications');
            alert(notification.message);
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