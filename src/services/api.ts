import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Typage des données d'enregistrement et des credentials
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UserData {
    username: string;
    password: string;
    email?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Credentials {
    username: string;
    password: string;
}

// Interface pour le token
interface TokenResponse {
    token: string;
}

// Interface pour les produits
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

// Enregistrement d'un nouvel utilisateur
export const register = async (userData: Record<string, unknown>): Promise<TokenResponse> => {
    try {
        const response = await axios.post<TokenResponse>(`${API_URL}/auth/users/register/`, userData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        throw error; // Relance l'erreur pour que le gestionnaire d'erreur puisse la traiter
    }
};

// Connexion de l'utilisateur
export const login = async (credentials: Record<string, unknown>): Promise<TokenResponse> => {
    try {
        const response = await axios.post<TokenResponse>(`${API_URL}/auth/users/login/`, credentials);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error; // Relance l'erreur pour que le gestionnaire d'erreur puisse la traiter
    }
};

// Déconnexion de l'utilisateur
export const logout = async (token: string): Promise<void> => {
    try {
        await axios.post(`${API_URL}/auth/users/logout/`, {}, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        throw error; // Relance l'erreur pour que le gestionnaire d'erreur puisse la traiter
    }
};

// Récupérer les produits
export const getProducts = async (token: string): Promise<Product[]> => {
    try {
        const response = await axios.get<Product[]>(`${API_URL}/products/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        throw error; // Relance l'erreur pour que le gestionnaire d'erreur puisse la traiter
    }
};