export class Blog extends HTMLElement {
    constructor() {
        super();
        this.articles = [];
        this.page = 1;
        this.productsPerPage = 8;
        this.hasMore = true;
        this.observer = null;
        this.sentinel = null;
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
            
            this.setup();
        } catch (error) {
            console.error('Error al cargar los datos del blog:', error);
            this.shadowRoot.querySelector('.articles-list').innerHTML = '<p>No se pudo cargar el blog.</p>';
        }
    }

    setup() {
        if (this.observer) {
            this.observer.disconnect();
        }

        const articles = this.shadowRoot.querySelector('.articles-list');
        if (!articles) return;

        const existingSentinel = this.shadowRoot.querySelector('.article__sentinel');
        if (existingSentinel) {
            existingSentinel.remove();
        }

        this.sentinel = document.createElement('div');
        this.sentinel.className = 'article__sentinel';
        articles.appendChild(this.sentinel);

        this.observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !this.isLoading && this.hasMore) {
                this.loadMoreArticles();
            }
        }, { rootMargin: '100px' });

        this.observer.observe(this.sentinel);
    }

     loadMoreArticles() {
        const start = (this.page - 1) * this.productsPerPage;
        const end = start + this.productsPerPage;

        if (this.articles.length === 0) {
            this.hasMore = false;
            if (this.sentinel) {
                this.sentinel.style.display = 'none';
            }
            return;
        }

        this.renderArticles(this.articles, true);
        this.page++;
    }

    loadBlogPosts(posts, append = false) {
        const articlesList = this.shadowRoot.querySelector('.articles-list');
        
        if (!articlesList) return;
        
        if (!append) {
            articlesList.innerHTML = '';
            this.page = 1;
            this.hasMore = true;
        }

        const articleDiv.innerHTML = this.articles.map( post=> `
            <div class='blog-article'>
                <a href="/blog-post?id=${post.id}" class="article-link">
                    <img src="${post.image_url || 'img/blog-post-main.png'}" alt="Imagen del post">
                    <div class="article-content">
                        <h3>${post.title}</h3>
                        <p>${summary}</p>
                        <span class="article-meta">By ${post.author} on ${new Date(post.publication_date).toLocaleDateString()}</span>
                    </div>
                </a>
            </div>
            `).join('');
            

        const style = document.createElement('style');
        style.textContent = `
            .article-link {
                text-decoration: none;
                color: inherit;
                display: block;
            }
        `;
        this.shadowRoot.appendChild(style);

        if (append) {
                articlesList.insertAdjacentHTML('beforeEnd', articleDiv);
            } else {
                articlesList.innerHTML = articleDiv;
                this.setup();
            }
    }
}
customElements.define('blog-component', Blog);
