/**
 * My Desktop - Notifications
 * Handles notification system and user feedback
 */

class Notifications {
    constructor() {
        this.notificationsContainer = null;
        this.eventBus = null;
        this.isInitialized = false;
    }

    init(dependencies = {}) {
        this.eventBus = dependencies.eventBus || window.eventBus;
        
        if (!this.eventBus) {
            console.error('Notifications: EventBus not available');
            return false;
        }
        
        this.createNotificationsContainer();
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('Notifications initialized');
        return true;
    }

    createNotificationsContainer() {
        this.notificationsContainer = document.createElement('div');
        this.notificationsContainer.id = 'notificationsContainer';
        this.notificationsContainer.className = 'notifications-container';
        
        document.body.appendChild(this.notificationsContainer);
    }

    bindEvents() {
        this.eventBus.on('showNotification', (data) => {
            this.showNotification(data);
        });
    }

    showNotification(data) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">${data.message}</div>
            <div class="notification-close">×</div>
        `;
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        this.notificationsContainer.appendChild(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            this.removeNotification(notification);
        }, data.duration || 3000);
    }

    removeNotification(notification) {
        notification.remove();
    }

    destroy() {
        if (this.notificationsContainer) {
            this.notificationsContainer.remove();
        }
        this.isInitialized = false;
        console.log('Notifications destroyed');
    }
}

window.Notifications = Notifications; 