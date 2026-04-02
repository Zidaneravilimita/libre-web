import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Settings, LogOut, Edit2, Camera, Save, X, Users, Ticket, Heart } from 'lucide-react';
import { supabase } from '../config/supabase';

const Profile = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    city: '',
    avatar_url: '',
    bio: ''
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        city: user.id_ville || '',
        avatar_url: user.avatar_url || 'https://i.ibb.co/2n9H0hZ/default-avatar.png',
        bio: user.bio || ''
      });
    }
    loadCities();
  }, [user]);

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

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          bio: profileData.bio,
          id_ville: profileData.city,
          avatar_url: profileData.avatar_url
        })
        .eq('id', user.id);

      if (error) throw error;

      // Mettre à jour le localStorage
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      showNotification('Profil mis à jour avec succès !', 'success');
      setEditing(false);
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      showNotification('Erreur lors de la mise à jour du profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('currentUser');
      onLogout();
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulation d'upload (à implémenter avec Supabase Storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isOrganizer = user?.role === 'organisateur';

  return (
    <div className="profile-container animate-fadeInUp">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profileData.avatar_url} alt="Avatar" />
          {editing && (
            <label className="avatar-upload">
              <Camera size={20} />
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
          )}
        </div>
        
        <div className="profile-info">
          <h1>{profileData.username}</h1>
          <p className="user-role">
            {isOrganizer ? '🎪 Organisateur d\'événements' : '👤 Visiteur'}
          </p>
          <p className="user-email">{profileData.email}</p>
        </div>

        <div className="profile-actions">
          {!editing ? (
            <button className="edit-btn" onClick={() => setEditing(true)}>
              <Edit2 size={20} />
              Modifier
            </button>
          ) : (
            <div className="editing-actions">
              <button className="save-btn" onClick={handleSaveProfile} disabled={loading}>
                {loading ? <div className="loading"></div> : <Save size={20} />}
              </button>
              <button className="cancel-btn" onClick={() => setEditing(false)}>
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification.message && (
        <div className={`notification ${notification.type} animate-slideInFromTop`}>
          {notification.message}
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          <User size={16} />
          Informations
        </button>
        <button 
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <Calendar size={16} />
          Activité
        </button>
        {isOrganizer && (
          <button 
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Ticket size={16} />
            Mes événements
          </button>
        )}
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={16} />
          Paramètres
        </button>
      </div>

      {/* Content */}
      <div className="profile-content">
        {activeTab === 'info' && (
          <div className="info-section">
            <div className="info-grid">
              <div className="info-item">
                <Mail size={20} />
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled={!editing}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="info-input"
                  />
                </div>
              </div>

              <div className="info-item">
                <MapPin size={20} />
                <div>
                  <label>Ville</label>
                  <select
                    value={profileData.city}
                    disabled={!editing}
                    onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                    className="info-input"
                  >
                    <option value="">Choisir une ville</option>
                    {cities.map(city => (
                      <option key={city.id_ville} value={city.id_ville}>
                        {city.nom_ville}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="info-item full-width">
                <User size={20} />
                <div>
                  <label>Bio</label>
                  <textarea
                    value={profileData.bio}
                    disabled={!editing}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="info-textarea"
                    rows={4}
                    placeholder="Parlez-nous de vous..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-section">
            <div className="activity-stats">
              <div className="stat-card">
                <Calendar size={24} />
                <div>
                  <h3>Événements</h3>
                  <p>{isOrganizer ? '12 créés' : '8 participés'}</p>
                </div>
              </div>
              <div className="stat-card">
                <Heart size={24} />
                <div>
                  <h3>Favoris</h3>
                  <p>15 événements</p>
                </div>
              </div>
              {!isOrganizer && (
                <div className="stat-card">
                  <Users size={24} />
                  <div>
                    <h3>Réseau</h3>
                    <p>42 contacts</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && isOrganizer && (
          <div className="events-section">
            <h3>Mes événements organisés</h3>
            <div className="events-grid">
              {/* Simulation d'événements */}
              {[1, 2, 3].map(i => (
                <div key={i} className="event-card-mini">
                  <div className="event-image">
                    <img src={`/api/placeholder/150/100`} alt="Event" />
                  </div>
                  <div className="event-info">
                    <h4>Festival de Musique {i}</h4>
                    <p>15 Juillet 2024</p>
                    <span className="event-status">Actif</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="settings-list">
              <button className="setting-item">
                <Settings size={20} />
                <span>Préférences</span>
              </button>
              <button className="setting-item">
                <Mail size={20} />
                <span>Notifications par email</span>
              </button>
              <button className="setting-item">
                <User size={20} />
                <span>Confidentialité</span>
              </button>
              <button className="setting-item logout" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
