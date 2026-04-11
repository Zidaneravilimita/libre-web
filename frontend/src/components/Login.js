import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, UserPlus } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const Login = ({ onLogin, onSwitchToSignup, onSwitchToOrganizer }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' });

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email: email.trim(),
        password: password
      });
      
      const { user, token } = response.data;
      
      // Stocker le token et l'utilisateur
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Configurer axios pour les futures requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      showNotification('Connexion réussie !', 'success');
      
      setTimeout(() => {
        onLogin(user);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      const errorMessage = error.response?.data?.message || 'Email ou mot de passe incorrect';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      // Sauvegarder l'état du formulaire avant la redirection
      const formData = { email, password };
      sessionStorage.setItem('oauthFormData', JSON.stringify(formData));
      sessionStorage.setItem('oauthProvider', provider);
      
      // Rediriger vers le backend Django pour l'authentification OAuth
      const callbackUrl = encodeURIComponent(`${window.location.origin}/oauth-callback`);
      const oauthUrl = API_ENDPOINTS[`OAUTH_${provider.toUpperCase()}`];
      if (oauthUrl) {
        window.location.href = `${oauthUrl}?callback_url=${callbackUrl}`;
      } else {
        throw new Error(`Fournisseur OAuth ${provider} non supporté`);
      }
    } catch (error) {
      console.error(`Erreur connexion ${provider}:`, error);
      showNotification(`Erreur lors de la connexion avec ${provider}`, 'error');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fadeInUp">
      {/* Header */}
      <div className="auth-header">
        <button 
          className="back-btn"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={20} />
        </button>
        <h2>Connexion</h2>
        <div></div>
      </div>

      {/* Notification */}
      {notification.message && (
        <div className={`notification ${notification.type} animate-slideInFromTop`}>
          {notification.message}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-group">
          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <div className="input-wrapper">
            <Lock className="input-icon" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-input ${errors.password ? 'error' : ''}`}
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button
          type="submit"
          className="auth-btn primary"
          disabled={loading}
        >
          {loading ? (
            <div className="loading"></div>
          ) : (
            <>
              <User size={20} />
              Se connecter
            </>
          )}
        </button>
      </form>

      {/* Séparateur */}
      <div className="auth-divider">
        <span>OU</span>
      </div>

      {/* Boutons de connexion sociale */}
      <div className="social-login">
        <button
          type="button"
          className="social-btn google"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuer avec Google
        </button>

        <button
          type="button"
          className="social-btn facebook"
          onClick={() => handleSocialLogin('facebook')}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continuer avec Facebook
        </button>

        <button
          type="button"
          className="social-btn github"
          onClick={() => handleSocialLogin('github')}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continuer avec GitHub
        </button>
      </div>

      {/* Options de connexion */}
      <div className="auth-options">
        <div className="auth-links">
          <button 
            className="link-btn"
            onClick={onSwitchToSignup}
          >
            <UserPlus size={16} />
            Pas encore de compte ? S'inscrire
          </button>
        </div>
        
        <div className="user-types">
          <p>Connexion en tant que :</p>
          <div className="type-buttons">
            <button 
              className="type-btn visitor"
              onClick={() => onSwitchToOrganizer('visitor')}
            >
              <User size={16} />
              Visiteur
            </button>
            <button 
              className="type-btn organizer"
              onClick={() => onSwitchToOrganizer('organizer')}
            >
              <User size={16} />
              Organisateur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
