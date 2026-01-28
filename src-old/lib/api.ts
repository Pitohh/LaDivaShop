/**
 * API Client for LaDivaShop Backend
 * Replaces Supabase client with HTTP requests to Node.js backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

class ApiClient {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    /**
     * Get JWT token from localStorage
     */
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    /**
     * Set JWT token in localStorage
     */
    setToken(token: string): void {
        localStorage.setItem('auth_token', token);
    }

    /**
     * Remove JWT token from localStorage
     */
    removeToken(): void {
        localStorage.removeItem('auth_token');
    }

    /**
     * Get auth headers with JWT
     */
    getAuthHeaders(): Record<string, string> {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    /**
     * Generic request method
     */
    async request(endpoint: string, options: RequestOptions = {}): Promise<any> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            const isJson = contentType && contentType.includes('application/json');

            const data = isJson ? await response.json() : await response.text();

            if (!response.ok) {
                throw new Error(data?.error || data || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint: string, options: RequestOptions = {}): Promise<any> {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     */
    async post(endpoint: string, data: any, options: RequestOptions = {}): Promise<any> {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * PUT request
     */
    async put(endpoint: string, data: any, options: RequestOptions = {}): Promise<any> {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint: string, options: RequestOptions = {}): Promise<any> {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

// Export singleton instance
export const api = new ApiClient();
