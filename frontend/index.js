import {AppLayout} from './blocks/layout/layout.js';
import {AppNavbar} from './blocks/navbar/navbar.js';
import {AppModal} from './blocks/menu nav/modal.js';
import {FrontPage} from './blocks/frontpage/frontpage.js';

import Router from './services/router.js';

// Layout configuration per route
const layoutConfig = {
  '/': { src: '/frontend/images/frontpage/frontpage.jpg', desc: 'Inicio', frontpage: true },
  '/menu': { src: '/images/menu/menu.jpg', desc: 'Nuestro Menú' },
  '/about': { src: '/images/about/about.jpg', desc: 'Sobre Nosotros' },
  '/book': { src: '/images/book/book.jpg', desc: 'Reserva tu Mesa' }
};

window.addEventListener('navigate', e => {
  const route = e.detail.route;
  const cfg = layoutConfig[route] || layoutConfig['/'];
  window.dispatchEvent(new CustomEvent('layout-change', { detail: cfg }));
  Router.go(route);
});

document.addEventListener('DOMContentLoaded', () => {
  const initial = layoutConfig[location.pathname] || layoutConfig['/'];
  window.dispatchEvent(new CustomEvent('layout-change', { detail: initial }));
  Router.init();
});