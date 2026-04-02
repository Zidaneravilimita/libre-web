-- Création de la base de données pour EventHub
-- Exécuter cette commande dans PostgreSQL: psql -U libre_user -d libredb -f setup_database.sql

-- Création de la table des villes
CREATE TABLE IF NOT EXISTS ville (
    id_ville SERIAL PRIMARY KEY,
    nom_ville VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des villes de démonstration
INSERT INTO ville (nom_ville) VALUES
('Paris'),
('Lyon'),
('Marseille'),
('Bordeaux'),
('Lille'),
('Toulouse'),
('Nice'),
('Nantes'),
('Strasbourg'),
('Montpellier');

-- Création de la table des catégories
CREATE TABLE IF NOT EXISTS category (
    id_category SERIAL PRIMARY KEY,
    nom_category VARCHAR(100) NOT NULL UNIQUE,
    photo VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des catégories de démonstration
INSERT INTO category (nom_category, photo) VALUES
('Musique', 'https://example.com/music.jpg'),
('Technologie', 'https://example.com/tech.jpg'),
('Gastronomie', 'https://example.com/food.jpg'),
('Art', 'https://example.com/art.jpg'),
('Sport', 'https://example.com/sport.jpg'),
('Spectacle', 'https://example.com/show.jpg'),
('Conférence', 'https://example.com/conference.jpg'),
('Festival', 'https://example.com/festival.jpg');

-- Création de la table des utilisateurs personnalisée
CREATE TABLE IF NOT EXISTS backend_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) NOT NULL UNIQUE,
    email VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    role VARCHAR(20) DEFAULT 'visitor' CHECK (role IN ('visitor', 'organizer')),
    avatar_url VARCHAR(500) DEFAULT 'https://i.ibb.co/2n9H0hZ/default-avatar.png',
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des événements
CREATE TABLE IF NOT EXISTS events (
    id_event SERIAL PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date_event TIMESTAMP NOT NULL,
    lieu_detail VARCHAR(500) NOT NULL,
    image_url VARCHAR(500),
    price DECIMAL(10, 2) DEFAULT 0,
    max_participants INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    organizer_id INTEGER REFERENCES backend_user(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES category(id_category) ON DELETE SET NULL,
    city_id INTEGER REFERENCES ville(id_ville) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des participants aux événements
CREATE TABLE IF NOT EXISTS event_participants (
    id_participant SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES backend_user(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id_event) ON DELETE CASCADE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'registered',
    UNIQUE(user_id, event_id)
);

-- Création de la table des événements favoris
CREATE TABLE IF NOT EXISTS favorite_events (
    id_favorite SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES backend_user(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id_event) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_event);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city_id);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_user_email ON backend_user(email);
CREATE INDEX IF NOT EXISTS idx_user_username ON backend_user(username);

-- Insertion d'utilisateurs de démonstration
INSERT INTO backend_user (username, email, password, role, bio) VALUES
('admin_demo', 'admin@eventhub.com', 'pbkdf2_sha256$260000$8K3m2Z8Y8L9a9Q6Q8J3Q$3Y8G8K9Q8J3Q8K9Q8J3Q8K9Q8J3Q8K9Q8J3Q', 'organizer', 'Administrateur du système'),
('orga_demo', 'orga@eventhub.com', 'pbkdf2_sha256$260000$8K3m2Z8Y8L9a9Q6Q8J3Q$3Y8G8K9Q8J3Q8K9Q8J3Q8K9Q8J3Q8K9Q8J3Q', 'organizer', 'Organisateur d''événements'),
('visitor_demo', 'visitor@eventhub.com', 'pbkdf2_sha256$260000$8K3m2Z8Y8L9a9Q6Q8J3Q$3Y8G8K9Q8J3Q8K9Q8J3Q8K9Q8J3Q8K9Q8J3Q', 'visitor', 'Visiteur passionné');

-- Insertion d'événements de démonstration
INSERT INTO events (titre, description, date_event, lieu_detail, image_url, price, organizer_id, category_id, city_id) VALUES
('Festival de Musique Électronique', 'Une nuit de musique électronique avec les meilleurs DJs internationaux', '2024-07-15 22:00:00', 'Paris, Parc de la Villette', 'https://example.com/festival1.jpg', 45.00, 2, 1, 1),
('Conférence Tech Innovation', 'Découvrez les dernières tendances en technologie et innovation', '2024-07-20 09:00:00', 'Lyon, Centre de Congrès', 'https://example.com/conference1.jpg', 0.00, 2, 2, 2),
('Atelier Cuisine Gastronomique', 'Apprenez à cuisiner comme un chef avec des ingrédients locaux', '2024-07-18 18:30:00', 'Marseille, École de Cuisine', 'https://example.com/cuisine1.jpg', 85.00, 2, 3, 3),
('Marathon Urbain de Paris', 'Courrez à travers les plus beaux quartiers de Paris', '2024-08-05 08:00:00', 'Paris, Point de départ Tour Eiffel', 'https://example.com/marathon1.jpg', 35.00, 2, 5, 1);

-- Création de la séquence pour les IDs si nécessaire
CREATE SEQUENCE IF NOT EXISTS ville_id_ville_seq START 1;
CREATE SEQUENCE IF NOT EXISTS category_id_category_seq START 1;
CREATE SEQUENCE IF NOT EXISTS backend_user_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS events_id_event_seq START 1;
CREATE SEQUENCE IF NOT EXISTS event_participants_id_participant_seq START 1;
CREATE SEQUENCE IF NOT EXISTS favorite_events_id_favorite_seq START 1;

COMMENT ON TABLE ville IS 'Table des villes disponibles pour les événements';
COMMENT ON TABLE category IS 'Table des catégories d''événements';
COMMENT ON TABLE backend_user IS 'Table des utilisateurs avec rôles (visitor/organizer)';
COMMENT ON TABLE events IS 'Table des événements créés par les organisateurs';
COMMENT ON TABLE event_participants IS 'Table des participants aux événements';
COMMENT ON TABLE favorite_events IS 'Table des événements favoris des utilisateurs';
