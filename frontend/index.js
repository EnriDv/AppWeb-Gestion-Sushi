import { layout } from './blocks/layout/layout.js';
import { frontPage } from './blocks/frontpage/frontpage.js';
import { NotFound } from './blocks/not-found/not-found.js';
import { Login } from './blocks/login/login.js';
import { Registration } from './blocks/registration/registration.js';
import { Router } from './services/router.js';

const registerComponents = async () => {
    if (!customElements.get('app-layout')) {
        await customElements.whenDefined('app-layout');
    }
    
    const components = [
        { name: 'app-layout', class: Layout },
        { name: 'frontpage-component', class: frontPage },
        { name: 'not-found-component', class: NotFound },
        { name: 'login-component', class: Login },
        { name: 'registration-component', class: Registration }
    ];
    
    components.forEach(({ name, class: componentClass }) => {
        if (!customElements.get(name)) {
            customElements.define(name, componentClass);
        }
    });
};

const initApp = async () => {
    try {
        console.log('Starting application initialization...');
        
        await registerComponents();
        console.log('Components registered');
        
        if (!customElements.get('app-layout')) {
            throw new Error('app-layout component is not defined');
        }
        
        const router = Router.getInstance();
        console.log('Router initialized');
        
        const path = window.location.pathname || '/';
        console.log('Navigating to initial path:', path);
        await router.navigateTo(path);
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}