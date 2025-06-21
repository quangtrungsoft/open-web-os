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
     * @param {Object} data - Initial data for the UI
     */
    init(windowId, windowElement, data) {
        this.windowId = windowId;
        this.windowElement = windowElement;
        
        if (this.isInitialized) {
            this.updateUI(data);
            return;
        };
        
        this.bindEvents();
        this.setupAnimations();
        this.setupBookingMenu();
        if (data) {
            this.updateUI(data);
        }
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
        if (!data) return;

        // Update avatar
        if (data.avatar) {
            const avatarElement = this.windowElement.querySelector('.summary-avatar');
            if (avatarElement) avatarElement.src = data.avatar;
        }

        // Update full name
        if (data.fullName) {
            const nameElement = this.windowElement.querySelector('.summary-header-main h1');
            if (nameElement) nameElement.textContent = data.fullName;
        }

        // Update tagline
        if (data.tagline) {
            const taglineElement = this.windowElement.querySelector('.summary-tagline');
            if (taglineElement) taglineElement.textContent = data.tagline;
        }

        // Update introduction
        if (data.introduction) {
            const introElement = this.windowElement.querySelector('.summary-best');
            if (introElement) introElement.textContent = data.introduction;
        }

        // Update contact links
        if (data.email) {
            const emailLink = this.windowElement.querySelector('.summary-contact a[href^="mailto:"]');
            if (emailLink) {
                emailLink.href = `mailto:${data.email}`;
                emailLink.textContent = data.email;
            }
        }
        if (data.linkedin) {
            const linkedinLink = this.windowElement.querySelector('.summary-contact a[href*="linkedin.com"]');
            if (linkedinLink) {
                linkedinLink.href = data.linkedin;
                linkedinLink.textContent = data.linkedin;
            }
        }
        if (data.github) {
            const githubLink = this.windowElement.querySelector('.summary-contact a[href*="github.com"]');
            if (githubLink) {
                githubLink.href = data.github;
                githubLink.textContent = data.github;
            }
        }

        // Update projects
        if (data.projects) {
            this.updateProjectList(data.projects);
        }

        // Update latest posts
        if (data.latestPosts) {
            this.updateLatestPosts(data.latestPosts);
        }
    }

    /**
     * Update the project list
     * @param {Array} projects - Array of project objects
     */
    updateProjectList(projects) {
        const projectList = this.windowElement.querySelector('.summary-project-list');
        if (projectList) {
            projectList.innerHTML = ''; // Clear existing projects
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'summary-project-card';

                let linksHTML = '';
                if (project.links && project.links.length > 0) {
                    linksHTML = project.links.map(link => 
                        `<a href="${link.url}" target="_blank">${link.label}</a>`
                    ).join(' | ');
                }

                projectCard.innerHTML = `
                    <h3>${project.title}</h3>
                    <p class="multiline-ellipsis">${project.description}</p>
                    ${linksHTML ? `<div class="summary-project-links">${linksHTML}</div>` : ''}
                `;
                projectList.appendChild(projectCard);
            });
        }
    }

    /**
     * Update the latest posts list
     * @param {Array} posts - Array of post objects
     */
    updateLatestPosts(posts) {
        const postList = this.windowElement.querySelector('.summary-post-list');
        if (postList) {
            postList.innerHTML = ''; // Clear existing posts
            posts.forEach(post => {
                const postCard = document.createElement('div');
                postCard.className = 'summary-post-card';
                postCard.innerHTML = `
                    <h4><a href="${post.link}" target="_blank">${post.title}</a></h4>
                    <p class="multiline-ellipsis">${post.summary}</p>
                `;
                postList.appendChild(postCard);
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

    /**
     * Setup booking menu toggle and label hover
     */
    setupBookingMenu() {
        const bookingMenu = this.windowElement.querySelector('.booking-menu');
        const bookingToggle = this.windowElement.querySelector('.booking-toggle');
        const bookingActions = this.windowElement.querySelectorAll('.booking-action');

        if (bookingToggle && bookingMenu) {
            bookingToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                bookingMenu.classList.toggle('open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!bookingMenu.contains(e.target)) {
                    bookingMenu.classList.remove('open');
                }
            });
        }

        bookingActions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                this.handleBookingAction(action);
                bookingMenu.classList.remove('open');
            });
        });
    }

    /**
     * Handle booking action clicks
     * @param {string} action - The booking action to perform
     */
    handleBookingAction(action) {
        if (this.processor && typeof this.processor.handleBookingAction === 'function') {
            this.processor.handleBookingAction(action, this.windowElement);
        } else {
            console.error('Processor or handleBookingAction method not available');
        }
    }
}

// Export the control class
window.AboutMeControl = AboutMeControl;