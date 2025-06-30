export class Blog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/blocks/blog/blog.css">
            <div class="blog-container">
                <div class="left-section">
                    <img src="img/blog-main.png" alt="Personas fotografiando platos de comida">
                    <div class="overlay-content"><h1>BLOG</h1></div>
                </div>
                <div class="right-section">
                    <div class="blog-header">
                        <span class="small-text">BEHIND THE SCENES</span>
                        <h2>& LATEST NEWS</h2>
                    </div>
                    <div class="articles-list"></div>
                    <div class="footer-links">
                        <a href="#">Licensing</a>
                        <a href="#">Styleguide</a>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.fetchBlogData();
    }

    async fetchBlogData() {
        try {
            const response = await fetch('http://localhost:4090/api/blogs');
            if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
            
            const posts = await response.json();
            this.loadBlogPosts(posts);
        } catch (error) {
            console.error('Error al cargar los datos del blog:', error);
            this.shadowRoot.querySelector('.articles-list').innerHTML = '<p>No se pudo cargar el blog.</p>';
        }
    }

    loadBlogPosts(posts) {
        const articlesList = this.shadowRoot.querySelector('.articles-list');
        articlesList.innerHTML = '';

        posts.forEach(post => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('blog-article');
            
            const summary = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '');

            articleDiv.innerHTML = `
                <a href="/blog-post?id=${post.id}" class="article-link">
                    <img src="${post.image_url || 'img/blog-post-main.png'}" alt="Imagen del post">
                    <div class="article-content">
                        <h3>${post.title}</h3>
                        <p>${summary}</p>
                        <span class="article-meta">By ${post.author} on ${new Date(post.publication_date).toLocaleDateString()}</span>
                    </div>
                </a>
            `;
            articlesList.appendChild(articleDiv);
        });

        const style = document.createElement('style');
        style.textContent = `
            .article-link {
                text-decoration: none;
                color: inherit;
                display: block;
            }
        `;
        this.shadowRoot.appendChild(style);
    }
}
customElements.define('blog-component', Blog);
