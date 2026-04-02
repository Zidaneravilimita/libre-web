import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, MapPin, ArrowLeft, UserPlus } from 'lucide-react';
import { supabase } from '../config/supabase';

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
      const { data, error } = await supabase
        .from('ville')
        .select('id_ville, nom_ville')
        .order('nom_ville', { ascending: true });
      
      if (error) throw error;
      setCities(data || []);
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password
      });
      
      if (error) throw error;
      
      const user = data?.user;
      if (!user) throw new Error('Impossible de créer le compte');
      
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: user.id,
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: formData.role,
        avatar_url: 'https://i.ibb.co/2n9H0hZ/default-avatar.png',
        id_ville: formData.cityId || null
      }]);
      
      if (profileError) throw profileError;
      
      const userData = { ...user, ...formData };
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      showNotification('Inscription réussie !', 'success');
      
      setTimeout(() => {
        onSignup(userData);
      }, 1500);
      
    } catch (error) {
      console.error('Erreur inscription:', error);
      showNotification(error.message || 'Erreur lors de l\'inscription', 'error');
    } finally {
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
                <option key={city.id_ville} value={city.id_ville}>
                  {city.nom_ville}
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
