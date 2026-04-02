// Service de géolocalisation pour détecter la position de l'utilisateur

class LocationService {
  constructor() {
    this.currentPosition = null;
    this.currentCity = null;
  }

  // Obtenir la position actuelle de l'utilisateur
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La géolocalisation n\'est pas supportée par votre navigateur'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          resolve(this.currentPosition);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Convertir les coordonnées en nom de ville avec l'API Google Maps
  async getAddressFromCoordinates(lat, lng) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_GOOGLE_MAPS_API_KEY&language=fr&region=MG`
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'adresse');
      }

      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const address = data.results[0];
        const city = this.extractCityFromAddress(address);
        this.currentCity = city;
        return city;
      } else {
        throw new Error('Aucune adresse trouvée pour ces coordonnées');
      }
    } catch (error) {
      console.error('Erreur de géocodage inversé:', error);
      return null;
    }
  }

  // Extraire le nom de la ville depuis l'adresse Google Maps
  extractCityFromAddress(address) {
    if (!address.address_components) return null;

    const cityComponent = address.address_components.find(component =>
      component.types.includes('locality') || 
      component.types.includes('administrative_area_level_2') ||
      component.types.includes('administrative_area_level_1')
    );

    return cityComponent ? cityComponent.long_name : null;
  }

  // Détecter automatiquement la ville de l'utilisateur
  async detectUserCity() {
    try {
      // Obtenir la position GPS
      const position = await this.getCurrentPosition();
      
      // Convertir en nom de ville
      const city = await this.getAddressFromCoordinates(position.lat, position.lng);
      
      if (city) {
        console.log('Ville détectée:', city);
        return city;
      } else {
        // Fallback : utiliser la première ville de Madagascar
        return 'Antananarivo';
      }
    } catch (error) {
      console.error('Erreur lors de la détection de la ville:', error);
      // Fallback : utiliser la première ville de Madagascar
      return 'Antananarivo';
    }
  }

  // Demander la permission de géolocalisation
  async requestLocationPermission() {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        if (result.state === 'granted') {
          return true;
        } else if (result.state === 'prompt') {
          return this.requestUserConsent();
        } else {
          return false;
        }
      } catch (error) {
        console.error('Erreur de permission:', error);
        return false;
      }
    }
    return true;
  }

  // Demander le consentement utilisateur
  requestUserConsent() {
    return new Promise((resolve) => {
      // Créer une modal de consentement
      const modal = document.createElement('div');
      modal.className = 'location-consent-modal';
      modal.innerHTML = `
        <div class="location-consent-content">
          <h3> Géolocalisation</h3>
          <p>Nous aimerons connaître votre position pour vous proposer des événements près de chez vous.</p>
          <div class="location-consent-buttons">
            <button id="allow-location" class="btn-primary">Autoriser</button>
            <button id="deny-location" class="btn-secondary">Refuser</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const allowBtn = modal.querySelector('#allow-location');
      const denyBtn = modal.querySelector('#deny-location');

      allowBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        resolve(true);
      });

      denyBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        resolve(false);
      });
    });
  }

  // Obtenir la distance entre deux points (en km)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance en km
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Obtenir les coordonnées d'une ville de Madagascar
  getMadagascarCityCoordinates(cityName) {
    const madagascarCities = {
      'Antananarivo': { lat: -18.8792, lng: 47.5079 },
      'Toamasina': { lat: -18.1491, lng: 49.4027 },
      'Mahajanga': { lat: -15.7167, lng: 46.3167 },
      'Fianarantsoa': { lat: -21.4539, lng: 47.0861 },
      'Toliara': { lat: -23.3539, lng: 43.6742 },
      'Antsirabe': { lat: -19.8686, lng: 47.0333 },
      'Morondava': { lat: -20.2833, lng: 44.2833 },
      'Ambatondrazaka': { lat: -17.8500, lng: 48.4333 },
      'Sambava': { lat: -14.2667, lng: 50.1667 },
      'Manakara': { lat: -22.1500, lng: 48.0333 }
    };

    return madagascarCities[cityName] || madagascarCities['Antananarivo'];
  }
}

export default new LocationService();
