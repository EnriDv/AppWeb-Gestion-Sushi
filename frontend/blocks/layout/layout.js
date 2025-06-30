import { authService } from '../../services/auth.service.js';

class Layout {
    constructor() {
        console.log('Layout initialized');
    }

    init() {
        console.log('Layout init');
        this.updateAuthUI();
        this.addListeners();
    }

    updateAuthUI() {
        const userInfo = document.querySelector('.layout__user');
        const authButtons = document.querySelector('.layout__auth-buttons');
        
        if (authService.isLoggedIn()) {
            if (userInfo) userInfo.style.display = 'block';
            if (authButtons) authButtons.style.display = 'none';
        } else {
            if (userInfo) userInfo.style.display = 'none';
            if (authButtons) authButtons.style.display = 'flex';
        }
    }

    addListeners() {
        const menuButton = document.querySelector('.layout__menu-button');
        const overlay = document.querySelector('.layout__overlay');
        const userMenuToggle = document.querySelector('.layout__user-info');
        const logoutButton = document.querySelector('.layout__logout-button');
        const navLinks = document.querySelectorAll('.layout__nav-link');

        if (menuButton) {
            menuButton.addEventListener('click', () => {
                document.querySelector('.layout__sidebar').classList.toggle('layout__sidebar--open');
                if (overlay) {
                    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
                }
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                document.querySelector('.layout__sidebar').classList.remove('layout__sidebar--open');
                overlay.style.display = 'none';
            });
        }

        if (userMenuToggle) {
            userMenuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const userMenu = document.querySelector('.layout__user-menu');
                if (userMenu) {
                    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', async () => {
                try {
                    await authService.logout();
                    this.updateAuthUI();
                    window.location.href = '/login';
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            });
        }
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.querySelector('.layout__sidebar').classList.remove('layout__sidebar--open');
                if (overlay) {
                    overlay.style.display = 'none';
                }
            });
        });

        document.addEventListener('click', (e) => {
            const userMenu = document.querySelector('.layout__user-menu');
            if (userMenu && !e.target.closest('.layout__user-info')) {
                userMenu.style.display = 'none';
            }
        });
    }
}

export const layout = new Layout();
