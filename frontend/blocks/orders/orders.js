import OrderService from '../../services/order.service.js';

export class Orders extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.orders = [];
        this.isLoading = true;
        this.error = null;
        this.render();
    }

    connectedCallback() {
        this.fetchOrders();
    }

    async fetchOrders() {
        this.isLoading = true;
        this.error = null;
        this.render();

        try {
            const response = await OrderService.getMyOrders();
            if (response && response.success) {
                this.orders = response.data || [];
                this.orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
            } else {
                this.error = 'No se pudieron cargar los pedidos';
            }
        } catch (error) {
            console.error('Error al cargar los pedidos:', error);
            this.error = error.message || 'Error al cargar los pedidos';
        } finally {
            this.isLoading = false;
            this.render();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/blocks/orders/orders.css">
            <div class="orders">
                <div class="orders__container">
                    <div class="orders__left">
                        <img src="/img/orders-bg.jpg" alt="Pedidos de sushi" class="orders__image">
                        <div class="orders__overlay">
                            <h1 class="orders__title">Mis Pedidos</h1>
                        </div>
                    </div>
                    <div class="orders__right">
                        <div class="orders__header">
                            <h2 class="orders__subtitle">Historial de Pedidos</h2>
                        </div>
                        <div class="orders__list" id="orders-list">
                            ${this.isLoading ? `
                                <p class="orders__message orders__message--loading">Cargando tus pedidos...</p>
                            ` : this.error ? `
                                <div class="orders__error">
                                    <p class="orders__error-text">${this.error}</p>
                                    <button class="orders__retry" id="retry-button">Reintentar</button>
                                </div>
                            ` : this.orders.length === 0 ? `
                                <p class="orders__message">No tienes pedidos realizados</p>
                            ` : this.orders.map(order => this.renderOrder(order)).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const retryButton = this.shadowRoot.getElementById('retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', () => this.fetchOrders());
        }
    }

    renderOrder(order) {
        if (!order) return '';
        
        const formatDate = (dateString) => {
            if (!dateString) return 'Fecha no disponible';
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return new Date(dateString).toLocaleDateString('es-ES', options);
        };
        
        const getStatusClass = (status) => {
            switch (status?.toLowerCase()) {
                case 'completed':
                case 'entregado':
                    return 'order__status--completed';
                case 'cancelled':
                case 'cancelado':
                    return 'order__status--cancelled';
                case 'pending':
                case 'pendiente':
                default:
                    return 'order__status--pending';
            }
        };
        
        const getStatusText = (status) => {
            switch (status?.toLowerCase()) {
                case 'completed':
                case 'entregado':
                    return 'Completado';
                case 'cancelled':
                case 'cancelado':
                    return 'Cancelado';
                case 'pending':
                case 'pendiente':
                default:
                    return 'Pendiente';
            }
        };
        
        const orderItems = order.order_items || order.items || [];
        
        return `
            <div class="order">
                <div class="order__header">
                    <span class="order__id">Pedido #${order.id}</span>
                    <span class="order__status ${getStatusClass(order.status)}">
                        ${getStatusText(order.status)}
                    </span>
                </div>
                <div class="order__date">${formatDate(order.order_date || order.createdAt)}</div>
                <div class="order__items">
                    ${orderItems.length > 0 ? 
                        orderItems.map(item => `
                            <div class="order__item">
                                <span class="order__item-name">
                                    ${item.dish?.name || item.Dish?.name || 'Producto'}
                                </span>
                                <span class="order__item-quantity">x${item.quantity}</span>
                                <span class="order__item-price">
                                    $${((item.unit_price || item.Dish?.price || 0) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        `).join('') : 
                        '<p class="order__no-items">No hay ítems en este pedido</p>'
                    }
                </div>
                <div class="order__total">
                    Total: $${(order.total_amount || 0).toFixed(2)}
                </div>
            </div>
        `;
    }
    
    render() {
        this.renderShell();
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pendiente',
            'processing': 'En preparación',
            'shipped': 'En camino',
            'delivered': 'Entregado',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    showError(message) {
        const ordersList = this.shadowRoot.getElementById('orders-list');
        ordersList.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button id="retry-button">Reintentar</button>
            </div>
        `;
        
        const retryButton = this.shadowRoot.getElementById('retry-button');
        if (retryButton) {
            retryButton.addEventListener('click', () => this.fetchOrders());
        }
    }
}

customElements.define('orders-component', Orders);
