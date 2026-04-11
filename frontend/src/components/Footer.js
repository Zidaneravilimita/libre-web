import React from 'react';
import { Share2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>EventHub</h3>
          <p>Votre plateforme pour découvrir et partager les meilleurs événements près de chez vous.</p>
          <div className="social-links">
            <button className="social-link">
              <Share2 size={20} />
            </button>
            <button className="social-link">
              <Share2 size={20} />
            </button>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Explorer</h4>
          <ul className="footer-links">
            <li><a href="#events" className="footer-link">Événements</a></li>
            <li><a href="#categories" className="footer-link">Catégories</a></li>
            <li><a href="#cities" className="footer-link">Villes</a></li>
            <li><a href="#organizers" className="footer-link">Organisateurs</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Organisateur</h4>
          <ul className="footer-links">
            <li><a href="#create" className="footer-link">Créer un événement</a></li>
            <li><a href="#pricing" className="footer-link">Tarifs</a></li>
            <li><a href="#resources" className="footer-link">Ressources</a></li>
            <li><a href="#blog" className="footer-link">Blog</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={16} />
              <span>tahiendrazazidane@gmail.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+261 32 68 792 14</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>Mahajanga Madagascar</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 EventHub. Tous droits réservés.</p>
        <div className="footer-bottom-links">
          <a href="#privacy" className="footer-link">Confidentialité</a>
          <a href="#terms" className="footer-link">Conditions d'utilisation</a>
          <a href="#cookies" className="footer-link">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
