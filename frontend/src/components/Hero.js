import React from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Découvrez les événements qui vous passionnent
        </h1>
        <p className="hero-subtitle">
          Trouvez des événements près de chez vous et connectez-vous avec votre communauté
        </p>
        
        <div className="hero-search">
          <div className="search-input-group">
            <Calendar className="search-icon" />
            <input
              type="text"
              placeholder="Que cherchez-vous ?"
              className="search-input"
            />
          </div>
          
          <div className="search-input-group">
            <MapPin className="search-icon" />
            <input
              type="text"
              placeholder="Où ?"
              className="search-input"
            />
          </div>
          
          <button className="search-btn-primary">
            <Search size={20} />
            Rechercher
          </button>
        </div>
        
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Événements</span>
          </div>
          <div className="stat">
            <span className="stat-number">50,000+</span>
            <span className="stat-label">Participants</span>
          </div>
          <div className="stat">
            <span className="stat-number">100+</span>
            <span className="stat-label">Villes</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
