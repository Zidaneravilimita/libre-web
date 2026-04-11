import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, MapPin, ArrowLeft, UserPlus } from 'lucide-react';
import axios from 'axios';

const Signup = ({ onSignup, onSwitchToLogin, userType = 'visitor' }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    cityId: '',
    role: userType
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/cities/');
      setCities(response.data || []);
    } catch (error) {
      console.error('Erreur chargement villes:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/', {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        city_id: formData.cityId || null
      });
      
      const { user, token } = response.data;
      
      // Stocker le token et l'utilisateur
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Configurer axios pour les futures requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      showNotification('Inscription réussie !', 'success');
      
      setTimeout(() => {
        onSignup(user);
      }, 1500);
      
    } catch (error) {
      console.error('Erreur inscription:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider) => {
    setLoading(true);
    try {
      // Rediriger vers le backend Django pour l'authentification OAuth
      window.location.href = `http://localhost:8000/api/auth/${provider}/`;
    } catch (error) {
      console.error(`Erreur inscription ${provider}:`, error);
      showNotification(`Erreur lors de l'inscription avec ${provider}`, 'error');
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="auth-container animate-fadeInUp">
      <div className="auth-header">
        <button 
          className="back-btn"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={20} />
        </button>
        <h2>Inscription - {userType === 'organizer' ? 'Organisateur' : 'Visiteur'}</h2>
        <div></div>
      </div>

      {notification.message && (
        <div className={`notification ${notification.type} animate-slideInFromTop`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <div className="input-wrapper">
            <User className="input-icon" size={20} />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={`form-input ${errors.username ? 'error' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="form-group">
          <div className="input-wrapper">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={loading}
            />
          </div>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <div className="input-wrapper">
            <MapPin className="input-icon" size={20} />
            <select
              value={formData.cityId}
              onChange={(e) => handleInputChange('cityId', e.target.value)}
              className={`form-input ${errors.cityId ? 'error' : ''}`}
              disabled={loading}
            >
              <option value="">Choisissez votre ville</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          {errors.cityId && <span className="error-message">{errors.cityId}</span>}
        </div>

        <div className="form-group">
          <div className="input-wrapper">
            <Lock className="input-icon" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
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

        <div className="form-group">
          <div className="input-wrapper">
            <Lock className="input-icon" size={20} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
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
              <UserPlus size={20} />
              S'inscrire
            </>
          )}
        </button>
      </form>

      {/* Séparateur */}
      <div className="auth-divider">
        <span>OU</span>
      </div>

      {/* Boutons d'inscription sociale */}
      <div className="social-login">
        <button
          type="button"
          className="social-btn google"
          onClick={() => handleSocialSignup('google')}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          S'inscrire avec Google
        </button>

        <button
          type="button"
          className="social-btn facebook"
          onClick={() => handleSocialSignup('facebook')}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          S'inscrire avec Facebook
        </button>

        <button
          type="button"
          className="social-btn github"
          onClick={() => handleSocialSignup('github')}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          S'inscrire avec GitHub
        </button>
      </div>

      <div className="auth-options">
        <div className="auth-links">
          <button 
            className="link-btn"
            onClick={onSwitchToLogin}
          >
            Déjà un compte ? Se connecter
          </button>
        </div>
        
        <div className="user-types">
          <p>S'inscrire en tant que :</p>
          <div className="type-buttons">
            <button 
              className={`type-btn ${userType === 'visitor' ? 'active' : ''}`}
              onClick={() => window.location.href = '/signup?userType=visitor'}
            >
              Visiteur
            </button>
            <button 
              className={`type-btn ${userType === 'organizer' ? 'active' : ''}`}
              onClick={() => window.location.href = '/signup?userType=organizer'}
            >
              Organisateur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
