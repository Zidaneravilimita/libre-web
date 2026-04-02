# Backend EventHub - API REST

Ce backend Django fournit une API REST pour l'application EventHub avec authentification et gestion des événements.

## 🚀 Installation

### Prérequis
- Python 3.8+
- PostgreSQL 12+
- pip

### 1. Installation des dépendances
```bash
pip install -r requirements.txt
```

### 2. Configuration de la base de données
```bash
# Créer la base de données PostgreSQL
createdb libredb

# Créer l'utilisateur PostgreSQL
CREATE USER libre_user WITH PASSWORD '2804';

# Donner les permissions à l'utilisateur
GRANT ALL PRIVILEGES ON DATABASE libredb TO libre_user;
```

### 3. Configuration du fichier .env
Créer un fichier `.env` à la racine du projet :
```env
SECRET_KEY=votre-clé-secrète-django
DEBUG=True
DB_NAME=libredb
DB_USER=libre_user
DB_PASSWORD=2804
DB_HOST=localhost
DB_PORT=5432
```

### 4. Migration de la base de données
```bash
# Appliquer le schéma de la base de données
python manage.py makemigrations
python manage.py migrate

# Charger les données initiales (optionnel)
psql -U libre_user -d libredb -f setup_database.sql
```

### 5. Création du superutilisateur
```bash
python manage.py createsuperuser
```

### 6. Démarrage du serveur
```bash
python manage.py runserver
```

L'API sera disponible sur : `http://localhost:8000`

## 📊 Structure de la base de données

### Tables principales

#### `backend_user` - Utilisateurs
- `id` : Clé primaire
- `username` : Nom d'utilisateur (unique)
- `email` : Email (unique)
- `password` : Mot de passe hashé
- `role` : Rôle ('visitor' ou 'organizer')
- `avatar_url` : URL de l'avatar
- `bio` : Biographie de l'utilisateur
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

#### `ville` - Villes
- `id_ville` : Clé primaire
- `nom_ville` : Nom de la ville (unique)
- `created_at` : Date de création

#### `category` - Catégories
- `id_category` : Clé primaire
- `nom_category` : Nom de la catégorie (unique)
- `photo` : URL de l'image de la catégorie
- `created_at` : Date de création

#### `events` - Événements
- `id_event` : Clé primaire
- `titre` : Titre de l'événement
- `description` : Description détaillée
- `date_event` : Date et heure de l'événement
- `lieu_detail` : Lieu précis
- `image_url` : URL de l'image
- `price` : Prix (décimal)
- `max_participants` : Nombre maximum de participants
- `is_active` : Statut actif
- `organizer_id` : Clé étrangère vers backend_user
- `category_id` : Clé étrangère vers category
- `city_id` : Clé étrangère vers ville
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

#### `event_participants` - Participants
- `id_participant` : Clé primaire
- `user_id` : Clé étrangère vers backend_user
- `event_id` : Clé étrangère vers events
- `registration_date` : Date d'inscription
- `status` : Statut de l'inscription

#### `favorite_events` - Favoris
- `id_favorite` : Clé primaire
- `user_id` : Clé étrangère vers backend_user
- `event_id` : Clé étrangère vers events
- `created_at` : Date d'ajout aux favoris

## 🔌 Endpoints API

### Authentification
- `POST /api/auth/register/` - Inscription
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/logout/` - Déconnexion (authentifié)

### Données de référence
- `GET /api/cities/` - Liste des villes
- `GET /api/categories/` - Liste des catégories

### Utilisateurs authentifiés
- `GET /api/profile/` - Profil utilisateur
- `PUT /api/profile/` - Mise à jour profil

## 📝 Exemples d'utilisation

### Inscription d'un utilisateur
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "visitor",
    "bio": "Passionné d''événements"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Récupération des villes
```bash
curl -X GET http://localhost:8000/api/cities/ \
  -H "Content-Type: application/json"
```

## 🔧 Configuration

### Variables d'environnement
- `SECRET_KEY` : Clé secrète Django
- `DEBUG` : Mode debug (True/False)
- `DB_NAME` : Nom de la base de données
- `DB_USER` : Utilisateur PostgreSQL
- `DB_PASSWORD` : Mot de passe PostgreSQL
- `DB_HOST` : Hôte PostgreSQL
- `DB_PORT` : Port PostgreSQL

### CORS
L'API est configurée pour accepter les requêtes depuis :
- `http://localhost:3000` (frontend React)
- `http://127.0.0.1:3000`

## 🛡️ Sécurité

- Les mots de passe sont hashés avec Django PBKDF2
- Configuration CORS pour le frontend
- Validation des entrées utilisateur
- Protection CSRF activée

## 📱 Compatibilité Frontend

Ce backend est conçu pour fonctionner avec le frontend React situé dans le dossier `../frontend/`.

Les endpoints correspondent exactement aux appels API du frontend pour l'authentification et la gestion des utilisateurs.
