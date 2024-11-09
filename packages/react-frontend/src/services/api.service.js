import { AuthService } from "./auth.service";
export const ApiService = {
    async fetch(url, options = {}) {
        const token = AuthService.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (response.status === 401) {
                AuthService.logout();
                window.location.href = '/login';
                return;
            }

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const text = await response.text();
            return text ? JSON.parse(text) : null;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Rest remains the same
    get(url) {
        return this.fetch(url);
    },

    post(url, data) {
        return this.fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    put(url, data) {
        return this.fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete(url) {
        return this.fetch(url, {
            method: 'DELETE'
        });
    }
};
