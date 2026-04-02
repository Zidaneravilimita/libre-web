// src/services/eventService.js
import { supabase } from '../config/supabase';
import { madagascarCities, findCityByName } from '../data/madagascarCities';
import locationService from './locationService';

class EventService {
  constructor() {
    this.cachedEvents = null;
    this.cachedCities = null;
    this.cachedCategories = null;
    this.userLocation = null;
    this.userCity = null;
  }

  // Initialiser avec les villes de Madagascar
  async initializeMadagascarCities() {
    try {
      // Insérer les villes de Madagascar dans la base de données si elles n'existent pas
      for (const city of madagascarCities) {
        const { error } = await supabase
          .from('ville')
          .upsert({
            id_ville: city.id_ville,
            nom_ville: city.nom_ville
          }, {
            onConflict: 'id_ville'
          });

        if (error) {
          console.error(`Erreur insertion ville ${city.nom_ville}:`, error);
        }
      }
      console.log('Villes de Madagascar initialisées avec succès');
    } catch (error) {
      console.error('Erreur initialisation villes Madagascar:', error);
    }
  }

  // Détecter la position de l'utilisateur
  async detectUserLocation() {
    try {
      // Demander la permission de géolocalisation
      const hasPermission = await locationService.requestLocationPermission();
      
      if (hasPermission) {
        // Détecter automatiquement la ville
        const detectedCity = await locationService.detectUserCity();
        this.userCity = detectedCity;
        this.userLocation = locationService.currentPosition;
        
        console.log('Ville détectée:', detectedCity);
        return detectedCity;
      } else {
        // Utiliser Antananarivo par défaut
        this.userCity = 'Antananarivo';
        console.log('Utilisation de la ville par défaut: Antananarivo');
        return 'Antananarivo';
      }
    } catch (error) {
      console.error('Erreur détection position:', error);
      this.userCity = 'Antananarivo';
      return 'Antananarivo';
    }
  }

  // Récupérer les villes de Madagascar
  async getCities() {
    if (this.cachedCities) {
      return this.cachedCities;
    }

    try {
      // D'abord, essayer de récupérer depuis Supabase
      const { data, error } = await supabase
        .from('ville')
        .select('id_ville, nom_ville')
        .order('nom_ville', { ascending: true });

      if (error) {
        console.error('Erreur récupération villes:', error);
        // Fallback : utiliser les données locales
        this.cachedCities = madagascarCities;
        return madagascarCities;
      }

      // Si pas de données dans Supabase, initialiser avec les villes de Madagascar
      if (!data || data.length === 0) {
        await this.initializeMadagascarCities();
        this.cachedCities = madagascarCities;
        return madagascarCities;
      }

      this.cachedCities = data;
      return data;
    } catch (error) {
      console.error('Erreur service villes:', error);
      // Fallback : utiliser les données locales
      this.cachedCities = madagascarCities;
      return madagascarCities;
    }
  }

  // Récupérer les catégories
  async getCategories() {
    if (this.cachedCategories) {
      return this.cachedCategories;
    }

    try {
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .order('nom_category', { ascending: true });

      if (error) {
        console.error('Erreur récupération catégories:', error);
        return this.getMockCategories();
      }

      this.cachedCategories = data;
      return data;
    } catch (error) {
      console.error('Erreur service catégories:', error);
      return this.getMockCategories();
    }
  }

  // Récupérer les événements avec filtres
  async getEvents(filters = {}) {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          category:category(id_category, nom_category, photo),
          city:ville(id_ville, nom_ville)
        `)
        .eq('is_active', true)
        .order('date_event', { ascending: true });

      // Filtre par ville
      if (filters.cityId) {
        query = query.eq('city_id', filters.cityId);
      } else if (this.userCity) {
        // Si l'utilisateur a une ville détectée, filtrer par cette ville
        const city = findCityByName(this.userCity);
        if (city) {
          query = query.eq('city_id', city.id_ville);
        }
      }

      // Filtre par catégorie
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      // Filtre par date
      if (filters.dateFrom) {
        query = query.gte('date_event', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('date_event', filters.dateTo);
      }

      // Filtre par recherche
      if (filters.search) {
        query = query.or(`titre.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur récupération événements:', error);
        return this.getMockEvents(filters);
      }

      return this.transformEventData(data || []);
    } catch (error) {
      console.error('Erreur service événements:', error);
      return this.getMockEvents(filters);
    }
  }

  // Transformer les données d'événements
  transformEventData(events) {
    return events.map(event => ({
      ...event,
      date_event: new Date(event.date_event),
      // Ajouter la distance si position utilisateur connue
      distance: this.userLocation && event.city ? 
        this.calculateDistanceToEvent(event) : null
    }));
  }

  // Calculer la distance à un événement
  calculateDistanceToEvent(event) {
    if (!this.userLocation || !event.city) return null;
    
    const cityData = findCityByName(event.city.nom_ville);
    if (!cityData || !cityData.coordonnees) return null;
    
    return locationService.calculateDistance(
      this.userLocation.lat,
      this.userLocation.lng,
      cityData.coordonnees.lat,
      cityData.coordonnees.lng
    );
  }

  // Obtenir les événements près de l'utilisateur
  async getNearbyEvents(radiusKm = 50) {
    if (!this.userLocation) {
      // Si pas de localisation, retourner les événements de la ville détectée
      return this.getEvents();
    }

    try {
      const allEvents = await this.getEvents();
      
      // Filtrer par distance
      return allEvents.filter(event => {
        if (!event.distance) return false;
        return event.distance <= radiusKm;
      }).sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Erreur événements proches:', error);
      return [];
    }
  }

  // Données mock pour fallback
  getMockEvents(filters = {}) {
    const mockEvents = [
      {
        id_event: 1,
        titre: "Festival Hira Gasy à Antananarivo",
        description: "Grand festival de musique traditionnelle malgache avec les meilleurs artistes locaux",
        date_event: new Date("2024-07-15T19:00:00"),
        lieu_detail: "Stade Municipal Antananarivo",
        image_url: "https://images.unsplash.com/photo-1459749411171-0485213f6e66?w=400",
        price: 5000,
        max_participants: 5000,
        is_active: true,
        category: { id_category: 1, nom_category: "Musique", photo: "" },
        city: { id_ville: 1, nom_ville: "Antananarivo" }
      },
      {
        id_event: 2,
        titre: "Salon de l'Agriculture à Toamasina",
        description: "Exposition des produits agricoles et artisanaux de la région",
        date_event: new Date("2024-07-20T09:00:00"),
        lieu_detail: "Parc Expo Toamasina",
        image_url: "https://images.unsplash.com/photo-1523966211575-eb4a01e70dd5?w=400",
        price: 0,
        max_participants: 2000,
        is_active: true,
        category: { id_category: 2, nom_category: "Exposition", photo: "" },
        city: { id_ville: 2, nom_ville: "Toamasina" }
      },
      {
        id_event: 3,
        titre: "Course de Pirogues à Mahajanga",
        description: "Compétition traditionnelle de pirogues sur la rivière Betsiboka",
        date_event: new Date("2024-07-25T08:00:00"),
        lieu_detail: "Port de Mahajanga",
        image_url: "https://images.unsplash.com/photo-1540206395-68808572332f?w=400",
        price: 1000,
        max_participants: 1000,
        is_active: true,
        category: { id_category: 3, nom_category: "Sport", photo: "" },
        city: { id_ville: 3, nom_ville: "Mahajanga" }
      },
      {
        id_event: 4,
        titre: "Fête du Zébu à Fianarantsoa",
        description: "Célébration traditionnelle avec courses de zébus et animations culturelles",
        date_event: new Date("2024-08-01T10:00:00"),
        lieu_detail: "Plaine de Fianarantsoa",
        image_url: "https://images.unsplash.com/photo-1515372039744-b8e02a3d4ea5?w=400",
        price: 2000,
        max_participants: 3000,
        is_active: true,
        category: { id_category: 4, nom_category: "Culture", photo: "" },
        city: { id_ville: 4, nom_ville: "Fianarantsoa" }
      }
    ];

    let filteredEvents = mockEvents;

    // Appliquer les filtres
    if (filters.cityId) {
      filteredEvents = filteredEvents.filter(event => event.city.id_ville === filters.cityId);
    } else if (this.userCity) {
      const city = findCityByName(this.userCity);
      if (city) {
        filteredEvents = filteredEvents.filter(event => event.city.id_ville === city.id_ville);
      }
    }

    if (filters.categoryId) {
      filteredEvents = filteredEvents.filter(event => event.category.id_category === filters.categoryId);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.titre.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower)
      );
    }

    return this.transformEventData(filteredEvents);
  }

  getMockCategories() {
    return [
      { id_category: 1, nom_category: "Musique", photo: "" },
      { id_category: 2, nom_category: "Exposition", photo: "" },
      { id_category: 3, nom_category: "Sport", photo: "" },
      { id_category: 4, nom_category: "Culture", photo: "" },
      { id_category: 5, nom_category: "Gastronomie", photo: "" },
      { id_category: 6, nom_category: "Artisanat", photo: "" },
      { id_category: 7, nom_category: "Religion", photo: "" },
      { id_category: 8, nom_category: "Éducation", photo: "" }
    ];
  }

  // Formater la date
  formatDate(date) {
    return date.toLocaleDateString('fr-MG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Formater le prix
  formatPrice(price) {
    if (price === 0) return 'Gratuit';
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA'
    }).format(price);
  }

  // Vider le cache
  clearCache() {
    this.cachedEvents = null;
    this.cachedCities = null;
    this.cachedCategories = null;
  }
}

export default new EventService();
