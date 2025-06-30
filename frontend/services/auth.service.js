const API_URL = 'http://localhost:4090/api/auth';

// Event types for auth state changes
export const AuthEvents = {
    AUTH_STATE_CHANGED: 'auth-state-changed',
    USER_UPDATED: 'user-updated',
    LOGIN_SUCCESS: 'login-success',
    LOGOUT: 'logout'
};

class AuthService {
    constructor() {
        this.subscribers = new Set();
        this.currentUser = null;
        this._init();
    }

    async _init() {
        // Load user data if token exists
        const token = this.getToken();
        if (token) {
            try {
                await this.fetchUserData();
            } catch (error) {
                console.error('Failed to load user data:', error);
                this._clearAuth();
            }
        }
        
        // Listen for storage events to sync across tabs
        window.addEventListener('storage', this._handleStorageEvent.bind(this));
    }

    _handleStorageEvent(event) {
        if (event.key === 'userToken' || event.key === null) {
            this._notifySubscribers();
        }
    }

    _notifySubscribers(user = this.currentUser) {
        const event = new CustomEvent(AuthEvents.AUTH_STATE_CHANGED, {
            detail: { user, isAuthenticated: !!user }
        });
        window.dispatchEvent(event);
        
        // Also notify individual subscribers
        this.subscribers.forEach(callback => callback(user));
    }

    onAuthStateChanged(callback) {
        // Call immediately with current user if exists
        if (this.currentUser) {
            callback(this.currentUser);
        }
        
        // Add to subscribers
        this.subscribers.add(callback);
        
        // Return unsubscribe function
        return () => this.offAuthStateChanged(callback);
    }
    
    offAuthStateChanged(callback) {
        this.subscribers.delete(callback);
    }
    
    _clearAuth() {
        localStorage.removeItem('userToken');
        this.currentUser = null;
        this._notifySubscribers(null);
    }

    async register(userData) {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to register');
        }

        if (data.token) {
            localStorage.setItem('userToken', data.token);
            await this.fetchUserData();
            this._notifySubscribers(this.currentUser);
            window.dispatchEvent(new CustomEvent(AuthEvents.LOGIN_SUCCESS, { detail: this.currentUser }));
        }

        return data;
    }

    async login(email, password) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to login');
        }

        if (data.token) {
            localStorage.setItem('userToken', data.token);
            await this.fetchUserData();
            this._notifySubscribers(this.currentUser);
            window.dispatchEvent(new CustomEvent(AuthEvents.LOGIN_SUCCESS, { detail: this.currentUser }));
        }

        return data;
    }

    async logout() {
        try {
            // Call server-side logout if needed
            const token = this.getToken();
            if (token) {
                await fetch(`${API_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            this._clearAuth();
            window.dispatchEvent(new CustomEvent(AuthEvents.LOGOUT));
        }
    }
    
    async updateProfile(profileData) {
        const token = this.getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }
        
        const response = await fetch('http://localhost:4090/api/users/me', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update profile');
        }
        
        // Update current user data
        this.currentUser = { ...this.currentUser, ...data };
        this._notifySubscribers(this.currentUser);
        window.dispatchEvent(new CustomEvent(AuthEvents.USER_UPDATED, { detail: this.currentUser }));
        
        return data;
    }
    
    async changePassword(currentPassword, newPassword) {
        const token = this.getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }
        
        const response = await fetch('http://localhost:4090/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to change password');
        }
        
        return data;
    }

    isAuthenticated() {
        const token = localStorage.getItem('userToken');
        return !!token;
    }

    getUser() {
        const token = localStorage.getItem('userToken');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch (e) {
            console.error('Failed to decode token:', e);
            return null;
        }
    }

    getToken() {
        return localStorage.getItem('userToken');
    }

    async fetchUserData() {
        const token = this.getToken();
        if (!token) {
            this.currentUser = null;
            return null;
        }

        try {
            const response = await fetch('http://localhost:4090/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include' // Include cookies for session handling
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token is invalid or expired
                    this._clearAuth();
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();
            this.currentUser = userData;
            this._notifySubscribers(userData);
            
            localStorage.setItem('userData', JSON.stringify(userData));
            
            return userData;
        } catch (error) {
            console.error('Error fetching user data:', error);
            this._clearAuth();
            return null;
        }
    }

    getStoredUserData() {
        return this.currentUser;
    }
    
    // Helper method to check user roles
    hasRole(role) {
        if (!this.currentUser || !this.currentUser.roles) return false;
        return this.currentUser.roles.includes(role);
    }
    
    // Check if user has any of the specified roles
    hasAnyRole(roles) {
        if (!this.currentUser || !this.currentUser.roles) return false;
        return roles.some(role => this.currentUser.roles.includes(role));
    }
}

// Export a singleton instance
export const authService = new AuthService();

// For backward compatibility
window.authService = authService;
