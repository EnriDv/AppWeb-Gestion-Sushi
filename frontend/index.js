import { FrontPage } from './blocks/frontpage/frontpage.js';
import { NotFound } from './blocks/not-found/not-found.js';
import { Login } from './blocks/login/login.js';
import { Registration } from './blocks/registration/registration.js';
import { Router } from './services/router.js';
import { Navbar } from '../blocks/navbar/Navbar.js';
import { menu } from '../blocks/menu/menu.js';
import { About } from '../blocks/about/about.js';
import { Contact } from '../blocks/contact/contact.js';
import { Blog } from '../blocks/blog/blog.js';
import { BlogPost } from '../blocks/blog-post/blog-post.js';
import { Reservation } from '../blocks/reservation/reservation.js';
import { Cart } from '../blocks/cart/cart.js';

document.addEventListener('DOMContentLoaded', () => {
    Router.init();
});
