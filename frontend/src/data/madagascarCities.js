// Liste des principales villes de Madagascar avec leurs coordonnées

export const madagascarCities = [
  {
    id_ville: 1,
    nom_ville: 'Antananarivo',
    nom_complet: 'Antananarivo (Tana)',
    region: 'Analamanga',
    coordonnees: { lat: -18.8792, lng: 47.5079 },
    population: '2,500,000',
    description: 'Capitale et plus grande ville de Madagascar'
  },
  {
    id_ville: 2,
    nom_ville: 'Toamasina',
    nom_complet: 'Toamasina (Tamatave)',
    region: 'Atsinanana',
    coordonnees: { lat: -18.1491, lng: 49.4027 },
    population: '300,000',
    description: 'Principal port sur la côte Est'
  },
  {
    id_ville: 3,
    nom_ville: 'Mahajanga',
    nom_complet: 'Mahajanga (Majunga)',
    region: 'Boeny',
    coordonnees: { lat: -15.7167, lng: 46.3167 },
    population: '250,000',
    description: 'Important port sur la côte Ouest'
  },
  {
    id_ville: 4,
    nom_ville: 'Fianarantsoa',
    nom_complet: 'Fianarantsoa (Fianar)',
    region: 'Haute Matsiatra',
    coordonnees: { lat: -21.4539, lng: 47.0861 },
    population: '200,000',
    description: 'Capitale économique du Sud'
  },
  {
    id_ville: 5,
    nom_ville: 'Toliara',
    nom_complet: 'Toliara (Tuléar)',
    region: 'Atsimo-Andrefana',
    coordonnees: { lat: -23.3539, lng: 43.6742 },
    population: '180,000',
    description: 'Principal port sur la côte Sud-Ouest'
  },
  {
    id_ville: 6,
    nom_ville: 'Antsirabe',
    nom_complet: 'Antsirabe',
    region: 'Vakinankaratra',
    coordonnees: { lat: -19.8686, lng: 47.0333 },
    population: '250,000',
    description: 'Centre industriel et thermal'
  },
  {
    id_ville: 7,
    nom_ville: 'Morondava',
    nom_complet: 'Morondava',
    region: 'Menabe',
    coordonnees: { lat: -20.2833, lng: 44.2833 },
    population: '80,000',
    description: 'Port de pêche et ville touristique'
  },
  {
    id_ville: 8,
    nom_ville: 'Ambatondrazaka',
    nom_complet: 'Ambatondrazaka',
    region: 'Alaotra-Mangoro',
    coordonnees: { lat: -17.8500, lng: 48.4333 },
    population: '50,000',
    description: 'Centre agricole de la région Alaotra'
  },
  {
    id_ville: 9,
    nom_ville: 'Sambava',
    nom_complet: 'Sambava',
    region: 'Sava',
    coordonnees: { lat: -14.2667, lng: 50.1667 },
    population: '90,000',
    description: 'Capitale de la vanille malgache'
  },
  {
    id_ville: 10,
    nom_ville: 'Manakara',
    nom_complet: 'Manakara',
    region: 'Vatovavy-Fitovinany',
    coordonnees: { lat: -22.1500, lng: 48.0333 },
    population: '40,000',
    description: 'Port sur la côte Sud-Est'
  },
  {
    id_ville: 11,
    nom_ville: 'Antsiranana',
    nom_complet: 'Antsiranana (Diego Suarez)',
    region: 'Diana',
    coordonnees: { lat: -12.2800, lng: 49.2833 },
    population: '130,000',
    description: 'Port stratégique au Nord de Madagascar'
  },
  {
    id_ville: 12,
    nom_ville: 'Miarinarivo',
    nom_complet: 'Miarinarivo',
    region: 'Itasy',
    coordonnees: { lat: -18.7667, lng: 47.2167 },
    population: '25,000',
    description: 'Centre agricole près d\'Antananarivo'
  },
  {
    id_ville: 13,
    nom_ville: 'Ambovombe',
    nom_complet: 'Ambovombe',
    region: 'Androy',
    coordonnees: { lat: -25.1667, lng: 46.0833 },
    population: '70,000',
    description: 'Capitale de la région Androy'
  },
  {
    id_ville: 14,
    nom_ville: 'Farafangana',
    nom_complet: 'Farafangana',
    region: 'Atsimo-Atsinanana',
    coordonnees: { lat: -22.8167, lng: 47.8500 },
    population: '35,000',
    description: 'Port sur la côte Sud-Est'
  },
  {
    id_ville: 15,
    nom_ville: 'Maintirano',
    nom_complet: 'Maintirano',
    region: 'Melaky',
    coordonnees: { lat: -18.2500, lng: 44.0333 },
    population: '20,000',
    description: 'Petit port de pêche sur la côte Ouest'
  }
];

// Fonction pour trouver une ville par nom
export const findCityByName = (cityName) => {
  return madagascarCities.find(city => 
    city.nom_ville.toLowerCase() === cityName.toLowerCase() ||
    city.nom_complet.toLowerCase().includes(cityName.toLowerCase())
  );
};

// Fonction pour obtenir les villes par région
export const getCitiesByRegion = (region) => {
  return madagascarCities.filter(city => city.region === region);
};

// Fonction pour obtenir les coordonnées d'une ville
export const getCityCoordinates = (cityName) => {
  const city = findCityByName(cityName);
  return city ? city.coordonnees : null;
};

// Liste des régions de Madagascar
export const madagascarRegions = [
  'Analamanga',
  'Atsinanana',
  'Boeny',
  'Haute Matsiatra',
  'Atsimo-Andrefana',
  'Vakinankaratra',
  'Menabe',
  'Alaotra-Mangoro',
  'Sava',
  'Vatovavy-Fitovinany',
  'Diana',
  'Itasy',
  'Androy',
  'Atsimo-Atsinanana',
  'Melaky',
  'Betsiboka',
  'Ihorombe',
  'Sofia',
  'Amoron\'i Mania',
  'Anosy',
  'Androy',
  'Bongolava'
];

export default madagascarCities;
