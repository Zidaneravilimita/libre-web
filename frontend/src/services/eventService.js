// src/services/eventService.js
import { supabase } from '../config/supabase';

export const eventService = {
  // Récupérer tous les événements avec leurs relations
  async fetchEvents(villeId = null, categoryId = null) {
    try {
      let query = supabase
        .from("events")
        .select(`
          id_event,
          titre,
          description,
          date_event,
          lieu_detail,
          image_url,
          id_category,
          id_ville,
          category!events_id_category_fkey (id_category, nom_category),
          ville (id_ville, nom_ville)
        `);

      if (villeId && villeId !== "all") {
        query = query.eq("id_ville", villeId);
      }
      if (categoryId) {
        query = query.eq("id_category", categoryId);
      }

      const { data, error } = await query.order("date_event", { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des événements:", error);
      return [];
    }
  },

  // Récupérer les villes
  async fetchVilles() {
    try {
      const { data, error } = await supabase
        .from("ville")
        .select("id_ville, nom_ville")
        .order("nom_ville", { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des villes:", error);
      return [];
    }
  },

  // Récupérer les catégories
  async fetchCategories() {
    try {
      const { data, error } = await supabase
        .from("category")
        .select("id_category, nom_category, photo")
        .order("nom_category", { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
      return [];
    }
  },

  // Convertir les événements de la base de données au format du frontend
  transformEventData(events) {
    return events.map(event => ({
      id: event.id_event,
      title: event.titre,
      description: event.description,
      date: event.date_event,
      location: event.lieu_detail,
      image: event.image_url || '/api/placeholder/300/200',
      category: event.category?.nom_category || 'Non catégorisé',
      categoryId: event.id_category,
      city: event.ville?.nom_ville || 'Non spécifié',
      cityId: event.id_ville,
      // Ajoutons des valeurs par défaut pour les champs manquants
      price: Math.floor(Math.random() * 100) + 10, // Prix aléatoire entre 10 et 110
      attendees: Math.floor(Math.random() * 2000) + 50, // Participants aléatoires entre 50 et 2050
    }));
  },

  // Filtrer les événements par date
  filterEventsByDate(events, dateFilter = 'all') {
    const now = Date.now();
    
    switch (dateFilter) {
      case 'upcoming':
        return events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getTime() >= now;
        });
      case 'past':
        return events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getTime() < now;
        });
      default:
        return events;
    }
  }
};
