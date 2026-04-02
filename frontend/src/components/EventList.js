import React, { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import EventCard from './EventCard';
import { eventService } from '../services/eventService';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  // Données de démonstration en fallback
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
    }
  ];

  // Charger les données depuis Supabase
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Détecter la position de l'utilisateur
        await eventService.detectUserLocation();
        
        // Charger les données depuis Supabase
        const [eventsData, citiesData, categoriesData] = await Promise.all([
          eventService.getEvents(),
          eventService.getCities(),
          eventService.getCategories()
        ]);
        
        setEvents(eventsData);
        setCities(citiesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erreur chargement données:', error);
        // Utiliser les données mock en cas d'erreur
        const mockEvents = eventService.getMockEvents();
        const mockCities = eventService.getMockCities();
        const mockCategories = eventService.getMockCategories();
        
        setEvents(mockEvents);
        setCities(mockCities);
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Filtrer les événements
  useEffect(() => {
    let filtered = events;

    // Filtrer par ville
    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(event => event.cityId === selectedCity);
    }

    // Filtrer par catégorie
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.categoryId === selectedCategory);
    }

    // Filtrer par date
    filtered = eventService.filterEventsByDate(filtered, dateFilter);

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, selectedCity, selectedCategory, dateFilter, searchTerm]);

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
              className={`filter-btn ${showFilters ? 'active' : ''}`}
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
        <div className="filters-panel animate-fadeInUp">
          <div className="filter-group">
            <label>Ville:</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="all">Toutes les villes</option>
              {cities.map(city => (
                <option key={city.id_ville} value={city.id_ville}>
                  {city.nom_ville}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Catégorie:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id_category} value={category.id_category}>
                  {category.nom_category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Date:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Toutes les dates</option>
              <option value="upcoming">À venir</option>
              <option value="past">Passés</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading"></div>
          <p>Chargement des événements...</p>
        </div>
      ) : (
        <div className={`events-container ${viewMode}`}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                className={`animate-stagger-${(index % 4) + 1}`}
              />
            ))
          ) : (
            <div className="no-events">
              <p>Aucun événement trouvé pour votre recherche.</p>
              <button 
                className="reset-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('all');
                  setSelectedCategory('all');
                  setDateFilter('all');
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventList;
