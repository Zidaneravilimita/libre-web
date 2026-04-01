import React, { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import EventCard from './EventCard';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Données de démonstration
  const mockEvents = [
    {
      id: 1,
      title: "Festival de Musique Électronique",
      description: "Une nuit de musique électronique avec les meilleurs DJs internationaux",
      category: "Musique",
      date: "2024-07-15T22:00:00",
      location: "Paris, Parc de la Villette",
      price: 45,
      attendees: 1250,
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Conférence Tech Innovation",
      description: "Découvrez les dernières tendances en technologie et innovation",
      category: "Technologie",
      date: "2024-07-20T09:00:00",
      location: "Lyon, Centre de Congrès",
      price: 0,
      attendees: 500,
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Atelier Cuisine Gastronomique",
      description: "Apprenez à cuisiner comme un chef avec des ingrédients locaux",
      category: "Gastronomie",
      date: "2024-07-18T18:30:00",
      location: "Marseille, École de Cuisine",
      price: 85,
      attendees: 24,
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      title: "Exposition d'Art Contemporain",
      description: "Une collection unique d'œuvres d'artistes émergents",
      category: "Art",
      date: "2024-07-22T10:00:00",
      location: "Bordeaux, Galerie d'Art Moderne",
      price: 12,
      attendees: 150,
      image: "/api/placeholder/300/200"
    },
    {
      id: 5,
      title: "Marathon Urbain de Paris",
      description: "Courrez à travers les plus beaux quartiers de Paris",
      category: "Sport",
      date: "2024-08-05T08:00:00",
      location: "Paris, Point de départ Tour Eiffel",
      price: 35,
      attendees: 3000,
      image: "/api/placeholder/300/200"
    },
    {
      id: 6,
      title: "Soirée Stand-up Comedy",
      description: "Les meilleurs humoristes français sur scène",
      category: "Spectacle",
      date: "2024-07-25T20:00:00",
      location: "Lille, Théâtre Municipal",
      price: 28,
      attendees: 200,
      image: "/api/placeholder/300/200"
    }
  ];

  const categories = ['all', 'Musique', 'Technologie', 'Gastronomie', 'Art', 'Sport', 'Spectacle'];

  useEffect(() => {
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, [mockEvents]);

  useEffect(() => {
    let filtered = events;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h2>Événements à venir</h2>
        
        <div className="event-list-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="control-buttons">
            <button 
              className="filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filtres
            </button>
            
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Catégorie:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toutes les catégories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className={`events-container ${viewMode}`}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="no-events">
            <p>Aucun événement trouvé pour votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
