// Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Authentification
  LOGIN: `${API_BASE_URL}/auth/login/`,
  REGISTER: `${API_BASE_URL}/auth/register/`,
  USER: `${API_BASE_URL}/auth/user/`,
  
  // Données de référence
  CITIES: `${API_BASE_URL}/cities/`,
  CATEGORIES: `${API_BASE_URL}/categories/`,
  
  // Contact
  CONTACT: `${API_BASE_URL}/contact/`,
  
  // OAuth (pour référence)
  OAUTH_GOOGLE: `${API_BASE_URL}/auth/google/`,
  OAUTH_FACEBOOK: `${API_BASE_URL}/auth/facebook/`,
  OAUTH_GITHUB: `${API_BASE_URL}/auth/github/`,
};

export default API_BASE_URL;
