/**
 * About Me App - Control Layer
 * Handles UI interactions, user events, and DOM manipulation
 */

class AboutMeControl {
    constructor(processor) {
        this.processor = processor;
        this.windowId = null;
        this.isInitialized = false;
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
        
        console.log('About Me Control initialized');
    }

    /**
     * Bind event listeners to UI elements
     */
    bindEvents() {
        // Add click handlers for interactive elements
        const contactItems = this.windowElement.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleContactClick(e));
        });

        // Add hover effects for project list
        const projectItems = this.windowElement.querySelectorAll('.project-list li');
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => this.handleProjectHover(e, true));
            item.addEventListener('mouseleave', (e) => this.handleProjectHover(e, false));
        });

        // Add avatar click handler
        const avatar = this.windowElement.querySelector('.avatar-placeholder');
        if (avatar) {
            avatar.addEventListener('click', (e) => this.handleAvatarClick(e));
        }
    }

    /**
     * Setup CSS animations and transitions
     */
    setupAnimations() {
        // Add entrance animation
        const content = this.windowElement.querySelector('.about-me-content');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                content.style.transition = 'all 0.5s ease-out';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 100);
        }

        // Add staggered animation for sections
        const sections = this.windowElement.querySelectorAll('.info-section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.4s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'translateX(0)';
            }, 300 + (index * 100));
        });
    }

    /**
     * Handle contact item clicks
     * @param {Event} e - Click event
     */
    handleContactClick(e) {
        const contactValue = e.currentTarget.querySelector('.contact-value');
        if (contactValue) {
            const text = contactValue.textContent;
            
            // Notify processor about contact interaction
            this.processor.handleContactInteraction(text);
            
            // Add visual feedback
            e.currentTarget.style.transform = 'scale(1.05)';
            setTimeout(() => {
                e.currentTarget.style.transform = 'scale(1)';
            }, 200);
        }
    }

    /**
     * Handle project item hover effects
     * @param {Event} e - Mouse event
     * @param {boolean} isHovering - Whether mouse is entering or leaving
     */
    handleProjectHover(e, isHovering) {
        const item = e.currentTarget;
        
        if (isHovering) {
            item.style.transform = 'translateX(10px)';
            item.style.color = 'rgba(255, 255, 255, 1)';
        } else {
            item.style.transform = 'translateX(0)';
            item.style.color = 'rgba(255, 255, 255, 0.9)';
        }
    }

    /**
     * Handle avatar click
     * @param {Event} e - Click event
     */
    handleAvatarClick(e) {
        const avatar = e.currentTarget;
        
        // Add rotation animation
        avatar.style.transform = 'rotate(360deg)';
        avatar.style.transition = 'transform 0.6s ease-in-out';
        
        setTimeout(() => {
            avatar.style.transform = 'rotate(0deg)';
        }, 600);

        // Notify processor about avatar interaction with the correct window element
        this.processor.handleAvatarInteraction(this.windowElement);
    }

    /**
     * Update the UI with new data
     * @param {Object} data - Data to update the UI with
     */
    updateUI(data) {
        // Update creator name
        if (data.name) {
            const nameElement = this.windowElement.querySelector('.creator-info h2');
            if (nameElement) {
                nameElement.textContent = data.name;
            }
        }

        // Update creator title
        if (data.title) {
            const titleElement = this.windowElement.querySelector('.creator-title');
            if (titleElement) {
                titleElement.textContent = data.title;
            }
        }

        // Update email
        if (data.email) {
            const emailElement = this.windowElement.querySelector('.contact-item .contact-value');
            if (emailElement) {
                emailElement.textContent = data.email;
            }
        }

        // Update website
        if (data.website) {
            const websiteElements = this.windowElement.querySelectorAll('.contact-item .contact-value');
            if (websiteElements.length > 1) {
                websiteElements[1].textContent = data.website;
            }
        }

        // Update projects
        if (data.projects) {
            this.updateProjectList(data.projects);
        }

        // Update copyright
        if (data.copyright) {
            const copyrightElement = this.windowElement.querySelector('.copyright p');
            if (copyrightElement) {
                copyrightElement.textContent = data.copyright;
            }
        }
    }

    /**
     * Update the project list
     * @param {Array} projects - Array of project names
     */
    updateProjectList(projects) {
        const projectList = this.windowElement.querySelector('.project-list');
        if (projectList) {
            projectList.innerHTML = '';
            projects.forEach(project => {
                const li = document.createElement('li');
                li.textContent = project;
                li.addEventListener('mouseenter', (e) => this.handleProjectHover(e, true));
                li.addEventListener('mouseleave', (e) => this.handleProjectHover(e, false));
                projectList.appendChild(li);
            });
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        const content = this.windowElement.querySelector('.about-me-content');
        if (content) {
            content.innerHTML = '<div class="loading">Loading...</div>';
        }
    }

    /**
     * Show error state
     * @param {string} message - Error message
     */
    showError(message) {
        const content = this.windowElement.querySelector('.about-me-content');
        if (content) {
            content.innerHTML = `<div class="error">Error: ${message}</div>`;
        }
    }

    /**
     * Cleanup event listeners and resources
     */
    destroy() {
        // Remove event listeners
        const contactItems = this.windowElement.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.removeEventListener('click', this.handleContactClick);
        });

        const projectItems = this.windowElement.querySelectorAll('.project-list li');
        projectItems.forEach(item => {
            item.removeEventListener('mouseenter', this.handleProjectHover);
            item.removeEventListener('mouseleave', this.handleProjectHover);
        });

        const avatar = this.windowElement.querySelector('.avatar-placeholder');
        if (avatar) {
            avatar.removeEventListener('click', this.handleAvatarClick);
        }

        this.isInitialized = false;
        console.log('About Me Control destroyed');
    }
}

// Export the control class
window.AboutMeControl = AboutMeControl; 