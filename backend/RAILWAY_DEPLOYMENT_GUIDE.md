# Guide de Déploiement EventHub sur Railway

## Étapes Préparatoires

### 1. Préparer le Repository Git
```bash
git add .
git commit -m "Configuration pour déploiement Railway"
git push origin main
```

### 2. Créer un Compte Railway
- Allez sur [railway.app](https://railway.app)
- Créez un compte avec GitHub/GitLab

## Étape 1: Déployer le Backend Django

### 1. Nouveau Projet sur Railway
1. Connectez-vous à Railway
2. Cliquez sur **"New Project"** > **"Deploy from GitHub repo"**
3. Sélectionnez votre repository EventHub
4. Choisissez le dossier `backend`

### 2. Configuration du Service
1. **Nom du service**: `eventhub-backend`
2. **Environment**: `Python`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`

### 3. Ajouter une Base de Données PostgreSQL
1. Dans votre projet Railway, cliquez sur **"New Service"**
2. Choisissez **"PostgreSQL"**
3. **Nom**: `eventhub-db`
4. Railway créera automatiquement la base de données

### 4. Configurer les Variables d'Environnement
Dans les settings de votre service backend, ajoutez :

```bash
# Django
DJANGO_SETTINGS_MODULE=backend.settings.production
DEBUG=false
SECRET_KEY=votre-secret-key-généré-automatiquement

# Hôtes autorisés
ALLOWED_HOSTS=.railway.app,.onrender.com,localhost,127.0.0.1

# CORS
CORS_ALLOWED_ORIGINS=https://*.railway.app,https://*.onrender.com,http://localhost:3000

# Python
PYTHON_VERSION=3.11
```

### 5. Configurer le Healthcheck
Dans l'interface Railway, configurez le healthcheck pour assurer un déploiement réussi :

1. Allez dans les settings de votre service
2. Cliquez sur **"+ Healthcheck Path"**
3. Entrez : `/api/health/`
4. Railway vérifiera automatiquement que votre application fonctionne avant de la rendre publique

**Note** : Le healthcheck est déjà configuré dans `railway.toml` avec `healthcheckPath = "/api/health/"`

**Note**: Railway fournit automatiquement `DATABASE_URL` pour la connexion à la base de données.

## Étape 2: Vérifier le Déploiement

### 1. Logs de Déploiement
- Allez dans l'onglet **"Logs"** de votre service
- Vérifiez qu'il n'y a pas d'erreurs de connexion à la base de données
- Le service devrait afficher "Server started at http://0.0.0.0:$PORT"

### 2. Tester l'API
- Railway vous donnera une URL comme `https://eventhub-backend-production.up.railway.app`
- Testez les endpoints avec curl ou Postman:
```bash
curl https://votre-url.railway.app/api/
```

## Étape 3: Migrations de la Base de Données

### 1. Exécuter les Migrations
1. Allez dans les **"Variables"** de votre service
2. Cliquez sur **"New Command"**
3. Ajoutez la commande: `python manage.py migrate`
4. Exécutez la commande

### 2. Créer un Superutilisateur (Optionnel)
1. Allez dans les **"Variables"** de votre service
2. Cliquez sur **"New Command"**
3. Ajoutez la commande: `python manage.py createsuperuser`
4. Exécutez la commande et suivez les instructions

### 3. Configurer les Watch Paths
Pour éviter des déploiements inutiles, configurez les Watch Paths pour que seuls les changements dans le dossier `backend` déclenchent un nouveau déploiement :

1. Dans les settings de votre service, allez à la section **"Watch Paths"**
2. Ajoutez le pattern : `/backend/**`
3. Cliquez sur le checkmark pour valider

**Pourquoi c'est important :**
- Évite les déploiements déclenchés par des changements dans d'autres dossiers
- Réduit l'utilisation des ressources de build
- Accélère le cycle de développement

## Étape 4: Configuration du Frontend (si applicable)

### 1. Mettre à jour l'URL de l'API
Dans votre frontend, mettez à jour l'URL de l'API pour pointer vers votre URL Railway:
```javascript
const API_URL = 'https://votre-url-backend.railway.app/api'
```

## Fichiers de Configuration Créés

### railway.toml
Configuration principale pour Railway avec:
- Commandes de build et de démarrage
- Variables d'environnement par défaut
- Politique de redémarrage

### nixpacks.toml
Configuration de build avec:
- Python 3.14 et PostgreSQL
- Installation des dépendances
- Commande de démarrage

### .env.railway
Variables d'environnement exemple pour Railway

### Mise à jour de production.py
Support de `DATABASE_URL` pour Railway en plus de la configuration Render

## Avantages de Railway vs Render

1. **DATABASE_URL automatique**: Pas besoin de configurer les variables DB manuellement
2. **Déploiement plus simple**: Moins de configuration requise
3. **Interface plus intuitive**: Dashboard plus simple à utiliser
4. **Intégration Git**: Déploiement automatique sur chaque push

## Dépannage

### Erreurs Communes
1. **ModuleNotFoundError**: Vérifiez que `dj-database-url` est dans requirements.txt
2. **Connection refused**: Assurez-vous que la base de données est démarrée
3. **Port binding**: Vérifiez que gunicorn utilise `$PORT` et non un port fixe
4. **pip: not found**: Railway détecte Node.js au lieu de Python à cause des fichiers package.json

### Erreur "pip: not found" - Solution Docker
Si Railway détecte Node.js au lieu de Python ou si pip n'est pas disponible :

1. **Utilisez Dockerfile** : Le projet est maintenant configuré avec un Dockerfile qui fonctionne avec Railway
2. **Fichiers créés** :
   - `Dockerfile` : Configuration Docker pour Python 3.11
   - `.dockerignore` : Exclut les fichiers inutiles du build
   - `railway.toml` : Configuré pour utiliser `builder = "DOCKERFILE"`

3. **Avantages du Dockerfile** :
   - Environnement Python garanti
   - pip toujours disponible
   - Isolation complète
   - Build reproductible

### Logs Utiles
- Logs de build: Vérifiez l'installation des dépendances Python
- Logs de runtime: Vérifiez le démarrage de Django et la connexion DB
- Logs de database: Vérifiez que PostgreSQL fonctionne correctement

### Problèmes de Détection de Language
Railway peut détecter le mauvais language si :
- Il y a des fichiers `package.json` dans le dossier backend
- Le dossier `node_modules` n'est pas dans `.gitignore`
- Les fichiers de configuration sont au mauvais endroit

## Prochaines Étapes

1. **Monitoring**: Configurez les alertes dans Railway
2. **Domaine personnalisé**: Ajoutez votre domaine personnalisé
3. **SSL**: Railway fournit automatiquement des certificats SSL
4. **Backup**: Configurez les backups automatiques de la base de données
