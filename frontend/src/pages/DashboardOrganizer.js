import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, BarChart3, Bell, User, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Profile from '../components/Profile';
import { supabase } from '../config/supabase';

const DashboardOrganizer = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    upcomingEvents: 0,
    revenue: 0
  });
  const [myEvents, setMyEvents] = useState([]);

  const loadMyEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', currentUser?.id)
        .order('date_event', { ascending: false });

      if (error) throw error;
      setMyEvents(data || []);
    } catch (error) {
      console.error('Erreur chargement événements:', error);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
      setCurrentUser(userData);
      loadStats();
    } else {
      window.location.href = '/login';
    }
  }, []);

  const loadStats = async () => {
    try {
      // Charger les statistiques (simulation)
      setStats({
        totalEvents: 12,
        totalAttendees: 3420,
        upcomingEvents: 3,
        revenue: 15420
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <Calendar size={24} />
                <div>
                  <h3>{stats.totalEvents}</h3>
                  <p>Événements créés</p>
                </div>
              </div>
              <div className="stat-card">
                <Users size={24} />
                <div>
                  <h3>{stats.totalAttendees}</h3>
                  <p>Participants totaux</p>
                </div>
              </div>
              <div className="stat-card">
                <TrendingUp size={24} />
                <div>
                  <h3>{stats.upcomingEvents}</h3>
                  <p>Événements à venir</p>
                </div>
              </div>
              <div className="stat-card">
                <BarChart3 size={24} />
                <div>
                  <h3>{stats.revenue}€</h3>
                  <p>Revenus générés</p>
                </div>
              </div>
            </div>

            <div className="recent-events">
              <h3>Événements récents</h3>
              <div className="events-list">
                {myEvents.slice(0, 3).map(event => (
                  <div key={event.id_event} className="event-item">
                    <div className="event-image">
                      <img src={event.image_url || '/api/placeholder/60/60'} alt={event.titre} />
                    </div>
                    <div className="event-info">
                      <h4>{event.titre}</h4>
                      <p>{new Date(event.date_event).toLocaleDateString()}</p>
                      <span className="event-status">Actif</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'events':
        return (
          <div className="events-management">
            <div className="section-header">
              <h2>Mes événements</h2>
              <button className="create-event-btn">
                <Plus size={20} />
                Créer un événement
              </button>
            </div>
            <div className="events-grid">
              {myEvents.map(event => (
                <div key={event.id_event} className="event-card">
                  <div className="event-image">
                    <img src={event.image_url || '/api/placeholder/200/150'} alt={event.titre} />
                  </div>
                  <div className="event-content">
                    <h3>{event.titre}</h3>
                    <p>{event.description}</p>
                    <div className="event-meta">
                      <span><MapPin size={16} /> {event.lieu_detail}</span>
                      <span><Calendar size={16} /> {new Date(event.date_event).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="analytics-section">
            <h2>Analytiques</h2>
            <div className="charts-container">
              <div className="chart-card">
                <h3>Évolution des participants</h3>
                <div className="chart-placeholder">
                  <BarChart3 size={48} />
                  <p>Graphique des participants</p>
                </div>
              </div>
              <div className="chart-card">
                <h3>Revenus par mois</h3>
                <div className="chart-placeholder">
                  <TrendingUp size={48} />
                  <p>Graphique des revenus</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return <Profile user={currentUser} onLogout={handleLogout} />;
      
      default:
        return null;
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
    <div className="dashboard-organizer">
      <Header />
      
      <div className="dashboard-nav">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <BarChart3 size={20} />
            Aperçu
          </button>
          <button 
            className={`nav-tab ${activeSection === 'events' ? 'active' : ''}`}
            onClick={() => setActiveSection('events')}
          >
            <Calendar size={20} />
            Événements
          </button>
          <button 
            className={`nav-tab ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            <TrendingUp size={20} />
            Analytiques
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
          </button>
        </div>
      </div>

      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardOrganizer;
