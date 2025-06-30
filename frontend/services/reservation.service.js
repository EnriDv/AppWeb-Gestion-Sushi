const API_URL = 'http://localhost:4090/api/reservations';

export const reservationService = {
    async createReservation(data, token = null) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Agregar token de autenticación si está disponible
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Error al crear la reserva');
        }

        return await response.json();
    }
};
