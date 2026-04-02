import React, { useState, useEffect } from 'react';
import { Calendar, Bell, User, Heart } from 'lucide-react';
import Header from '../components/Header';
import EventList from '../components/EventList';
import Profile from '../components/Profile';

const DashboardVisitor = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('events');
  const [notifications] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
      setCurrentUser(userData);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };


  const renderContent = () => {
    switch (activeSection) {
      case 'events':
        return <EventList />;
      case 'favorites':
        return (
          <div className="favorites-section">
            <h2>Mes événements favoris</h2>
            <div className="empty-state">
              <Heart size={48} />
              <p>Aucun événement favori pour le moment</p>
            </div>
          </div>
        );
      case 'profile':
        return <Profile user={currentUser} onLogout={handleLogout} />;
      default:
        return <EventList />;
    }
  };

  if (!currentUser) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-visitor">
      <Header />
      
      <div className="dashboard-nav">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeSection === 'events' ? 'active' : ''}`}
            onClick={() => setActiveSection('events')}
          >
            <Calendar size={20} />
            Événements
          </button>
          <button 
            className={`nav-tab ${activeSection === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveSection('favorites')}
          >
            <Heart size={20} />
            Favoris
          </button>
          <button 
            className={`nav-tab ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <User size={20} />
            Profil
          </button>
        </div>
        
        <div className="nav-actions">
          <button className="notification-btn">
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>
        </div>
      </div>

      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardVisitor;
