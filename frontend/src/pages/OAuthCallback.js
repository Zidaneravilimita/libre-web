import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const refresh = searchParams.get('refresh');
        const error = searchParams.get('error');

        if (error) {
          setError('Authentification annulée ou échouée');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (token && refresh) {
          // Stocker les tokens
          localStorage.setItem('authToken', token);
          localStorage.setItem('refreshToken', refresh);
          
          // Configurer axios pour les futures requêtes
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Récupérer les informations utilisateur
          const response = await axios.get('http://localhost:8000/api/auth/user/');
          const user = response.data;
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          // Rediriger vers le dashboard approprié
          const redirectPath = user.role === 'organizer' ? '/dashboard-organizer' : '/dashboard-visitor';
          navigate(redirectPath);
        } else {
          setError('Tokens manquants dans la réponse');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Erreur callback OAuth:', err);
        setError('Erreur lors de la finalisation de l\'authentification');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="oauth-callback-container">
        <div className="loading-spinner"></div>
        <p>Finalisation de l'authentification...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="oauth-callback-container error">
        <h2>Erreur d'authentification</h2>
        <p>{error}</p>
        <p>Redirection vers la page de connexion...</p>
      </div>
    );
  }

  return (
    <div className="oauth-callback-container">
      <div className="loading-spinner"></div>
      <p>Authentification réussie ! Redirection...</p>
    </div>
  );
};

export default OAuthCallback;
