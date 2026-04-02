import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Signup from '../components/Signup';

const AuthPage = () => {
  const [currentView, setCurrentView] = useState('login');
  const [userType, setUserType] = useState('visitor');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('userType') || 'visitor';
    setUserType(type);
    
    if (window.location.pathname.includes('/signup')) {
      setCurrentView('signup');
    }
  }, []);

  const handleLogin = (userData) => {
    // Redirection selon le type d'utilisateur
    if (userData.role === 'organisateur') {
      window.location.href = '/dashboard-organizer';
    } else {
      window.location.href = '/dashboard-visitor';
    }
  };

  const handleSignup = (userData) => {
    handleLogin(userData);
  };

  const switchToLogin = () => {
    setCurrentView('login');
    window.history.pushState({}, '', '/login');
  };

  const switchToSignup = (type = 'visitor') => {
    setUserType(type);
    setCurrentView('signup');
    window.history.pushState({}, '', `/signup?userType=${type}`);
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="auth-content">
        <div className="auth-logo">
          <h1>EventHub</h1>
          <p>La plateforme pour tous vos événements</p>
        </div>
        
        <div className="auth-card">
          {currentView === 'login' ? (
            <Login 
              onLogin={handleLogin}
              onSwitchToSignup={switchToSignup}
              onSwitchToOrganizer={switchToSignup}
            />
          ) : (
            <Signup 
              onSignup={handleSignup}
              onSwitchToLogin={switchToLogin}
              userType={userType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
