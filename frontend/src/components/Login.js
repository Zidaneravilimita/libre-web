import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, UserPlus } from 'lucide-react';
import { supabase } from '../config/supabase';

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      
      if (error) throw error;
      
      const user = data?.user;
      if (!user) throw new Error('Impossible de récupérer l\'utilisateur');
      
      // Récupérer le profil de l'utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) throw profileError;
      
      const userData = { ...user, ...profile };
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      showNotification('Connexion réussie !', 'success');
      
      setTimeout(() => {
        onLogin(userData);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      showNotification(error.message || 'Email ou mot de passe incorrect', 'error');
    } finally {
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
