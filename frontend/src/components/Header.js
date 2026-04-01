import React from 'react';
import { Calendar, MapPin, Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Calendar className="logo-icon" />
          <span>EventHub</span>
        </div>
        
        <nav className="nav-menu">
          <a href="#events" className="nav-link">Événements</a>
          <a href="#categories" className="nav-link">Catégories</a>
          <a href="#about" className="nav-link">À propos</a>
        </nav>

        <div className="header-actions">
          <button className="header-actions button">
            <Search size={20} />
          </button>
          <button className="header-actions button">
            <MapPin size={20} />
          </button>
          <button className="header-actions button">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
