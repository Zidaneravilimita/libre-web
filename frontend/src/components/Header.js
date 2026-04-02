import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, User, LogIn } from 'lucide-react';
import { supabase } from '../config/supabase';

const Header = ({ onSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const checkAuth = () => {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    };

    checkAuth();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} animate-slideInFromTop`}>
      <div className="header-container">
        <div className="logo animate-fadeInLeft" onClick={() => navigateTo('/')}>
          <Calendar className="logo-icon" />
          <span>EventHub</span>
        </div>
        
        <nav className="nav-menu">
          <a href="#events" className="nav-link animate-stagger-1">Événements</a>
          <a href="#categories" className="nav-link animate-stagger-2">Catégories</a>
          <a href="#about" className="nav-link animate-stagger-3">À propos</a>
        </nav>

        <div className="header-search">
          <div className="search-input-group">
            <Search size={20} />
            <input
              type="text"
              placeholder="Rechercher des événements..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="header-actions">
          {currentUser ? (
            <>
              <button 
                className="header-actions user-btn animate-stagger-1"
                onClick={() => navigateTo(currentUser.role === 'organisateur' ? '/dashboard-organizer' : '/dashboard-visitor')}
              >
                <User size={20} />
                <span>{currentUser.username}</span>
              </button>
              <button 
                className="header-actions logout-btn animate-stagger-2"
                onClick={handleLogout}
              >
                <LogIn size={20} />
              </button>
            </>
          ) : (
            <button 
              className="header-actions login-btn animate-stagger-1"
              onClick={() => navigateTo('/login')}
            >
              <LogIn size={20} />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
