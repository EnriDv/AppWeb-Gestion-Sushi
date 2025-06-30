import cartService from './cart.service.js';

const API_URL = 'http://localhost:4090/api/orders';

class OrderService {
    static async createOrder(orderData) {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        try {
            console.log('Enviando orden al servidor:', orderData);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    items: orderData.items || []
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error('Error en la respuesta del servidor:', data);
                throw new Error(data.message || `Error al crear la orden: ${response.status} ${response.statusText}`);
            }

            console.log('Orden creada exitosamente:', data);
            return data;
            
        } catch (error) {
            console.error('Error al crear la orden:', error);
            throw error; // Re-lanzar el error para que lo maneje el componente
        }
    }

    static async getMyOrders() {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        try {
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error al obtener las órdenes:', data);
                throw new Error(data.message || 'Error al obtener las órdenes');
            }

            return {
                success: true,
                data: Array.isArray(data) ? data : []
            };
        } catch (error) {
            console.error('Error en getMyOrders:', error);
            throw error;
        }
    }

    // Método para obtener órdenes (para administradores)
    static async getOrders() {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        try {
            const response = await fetch(API_URL + '/all', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error al obtener las órdenes:', data);
                throw new Error(data.message || 'Error al obtener las órdenes');
            }

            return {
                success: true,
                data: Array.isArray(data) ? data : []
            };
        } catch (error) {
            console.error('Error en getOrders:', error);
            throw error;
        }
    }

    static async getOrderById(orderId) {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`${API_URL}/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los detalles de la orden');
        }

        return response.json();
    }
    
    static async updateOrderStatus(orderId, status) {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`${API_URL}/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Error al actualizar el estado de la orden');
        }

        return response.json();
    }
    
    static async deleteOrder(orderId) {
        const token = localStorage.getItem('userToken');
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`${API_URL}/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Error al eliminar la orden');
        }

        return response.json();
    }
}

// Exportar la instancia por compatibilidad
export const orderService = OrderService;
export default OrderService;
