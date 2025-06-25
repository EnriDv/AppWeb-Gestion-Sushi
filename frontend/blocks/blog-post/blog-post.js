export class BlogPost extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="styles.css">
            <div class="blog-post-container">
                <div class="left-section">
                    <img id="main-post-image" src="" alt="Blog Post Image">
                    <div class="overlay-content"></div>
                </div>
                <div class="right-section">
                    <div class="article-meta">
                        <span class="date" id="post-date"></span>
                    </div>
                    <h1 class="article-title" id="post-title">Cargando...</h1>
                    <div class="article-content" id="post-content"></div>
                    <div class="author-info">
                        <span class="author-label">Author:</span> <span class="author-name" id="post-author"></span>
                    </div>
                    <div class="footer-links">
                        <a href="#">Licensing</a>
                        <a href="#">Styleguide</a>
                    </div>
                </div>
            </div>
        `;
    }
    
    connectedCallback() {
        this.loadBlogPost();
    }

    async loadBlogPost() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id');

            if (!postId) {
                throw new Error('No se encontró un ID de post en la URL.');
            }

            const response = await fetch(`http://localhost:4090/api/blogs/${postId}`);
            if (!response.ok) {
                throw new Error(`Post no encontrado (status: ${response.status})`);
            }
            const post = await response.json();
            this.renderPost(post);

        } catch (error) {
            console.error('Error al cargar el post del blog:', error);
            this.renderError(error.message);
        }
    }

    renderPost(post) {
        this.shadowRoot.getElementById('post-title').textContent = post.title;
        this.shadowRoot.getElementById('post-date').textContent = new Date(post.publication_date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        }).toUpperCase();
        this.shadowRoot.getElementById('post-author').textContent = post.author;
        
        const contentEl = this.shadowRoot.getElementById('post-content');
        const paragraphs = post.content.split('\n').filter(p => p.trim() !== '');
        contentEl.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');

        const imageEl = this.shadowRoot.getElementById('main-post-image');
        imageEl.src = post.image_url || 'img/blog-post-main.png';
        imageEl.alt = post.title || 'Imagen del post';
    }

    renderError(message) {
        this.shadowRoot.getElementById('post-title').textContent = 'Error';
        this.shadowRoot.getElementById('post-content').innerHTML = `<p>${message}</p>`;
    }
}
customElements.define('blog-post-component', BlogPost);