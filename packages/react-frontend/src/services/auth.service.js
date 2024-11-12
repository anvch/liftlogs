export const AuthService = {
    async login(username, pwd) {  
        const response = await fetch('/login', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, pwd })  
        });

        if (!response.ok) {
            throw new Error(await response.text());  
        }

        const { token } = await response.json();
        this.setToken(token);
        return token;
    },

    async register(username, pwd) {  
        const response = await fetch('/signup', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, pwd }) 
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const { token } = await response.json();
        this.setToken(token);
        return token;
    },
    
    setToken(token) {
        localStorage.setItem('auth_token', token);
    },

    getToken() {
        return localStorage.getItem('auth_token');
    },

    removeToken() {
        localStorage.removeItem('auth_token');
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    logout() {
        this.removeToken();
    }
};