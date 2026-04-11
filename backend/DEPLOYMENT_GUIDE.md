# Guide de Déploiement EventHub sur Render

## Étapes Préparatoires

### 1. Préparer le Repository Git
```bash
git add .
git commit -m "Configuration pour déploiement Render"
git push origin main
```

### 2. Créer un Compte Render
- Allez sur [render.com](https://render.com)
- Créez un compte avec GitHub/GitLab

## Étape 1: Déployer la Base de Données PostgreSQL

1. **Nouveau Service** > **PostgreSQL**
2. **Nom**: `eventhub-db`
3. **Plan**: Free (suffisant pour commencer)
4. **Nom de la base**: `libredb`
5. **Utilisateur**: `libre_user`
6. **Région**: Choisissez la plus proche de vos utilisateurs

### 2: Configurer les Variables d'Environnement

Dans le service PostgreSQL, allez dans **Environment** et ajoutez:
```
DATABASE_URL=postgresql://libre_user:votre_mot_de_passe@host:5432/libredb
```

### 3: Déployer le Backend Django

1. **Nouveau Service** > **Web Service**
2. **Connectez votre repository GitHub**
3. **Configuration**:
   - **Name**: `eventhub-backend`
   - **Environment**: `Python 3`
   - **Region**: Même que la base de données
   - **Branch**: `main`

4. **Build Settings**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`

5. **Advanced Settings**:
   - **Auto-Deploy**: `Yes`

### 4: Variables d'Environnement du Backend

Ajoutez ces variables dans **Environment**:

#### Variables Essentielles
```
DJANGO_SETTINGS_MODULE=backend.settings.production
SECRET_KEY=votre_clé_secrète_générée_ici
DEBUG=False
ALLOWED_HOSTS=eventhub-backend.onrender.com,.onrender.com
```

#### Variables Base de Données (automatiquement ajoutées par Render)
```
DATABASE_URL=postgresql://libre_user:password@host:5432/libredb
```

#### Variables Email (pour formulaire de contact)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre_email@gmail.com
EMAIL_HOST_PASSWORD=votre_mot_de_passe_app
DEFAULT_FROM_EMAIL=noreply@eventhub.fr
ADMIN_EMAIL=tahiendrazazidane@gmail.com
```

#### Variables Frontend
```
FRONTEND_URL=https://votre-frontend.onrender.com
```

### 5: Configurer le Domaine CORS

Après le déploiement, notez l'URL de votre backend (ex: `https://eventhub-backend.onrender.com`) et ajoutez-la aux CORS dans les variables d'environnement du frontend.

## Étape 6: Déployer le Frontend React

1. **Nouveau Service** > **Static Site**
2. **Configuration**:
   - **Name**: `eventhub-frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`
   - **Node Version**: `18`

3. **Variables d'Environnement**:
```
REACT_APP_API_URL=https://eventhub-backend.onrender.com/api
```

## Étape 7: Finalisation

### 1. Vérifier la Connexion
```bash
# Testez l'API backend
curl https://eventhub-backend.onrender.com/api/cities/
```

### 2. Créer un Superutilisateur
1. Allez dans le service backend sur Render
2. **Shell** > **Web Service**
3. Exécutez:
```bash
python manage.py createsuperuser --settings=backend.settings.production
```

### 3. Tester l'Application
- Accédez à votre frontend
- Testez l'inscription/connexion
- Testez le formulaire de contact

## Configuration Email Recommandée

### Gmail (recommandé pour commencer)
1. Activez la validation en 2 étapes sur votre compte Gmail
2. Générez un mot de passe d'application:
   - Allez dans [Paramètres Google](https://myaccount.google.com/)
   - Sécurité > Mot de passe des applications
   - Créez un nouveau mot de passe
3. Utilisez ce mot de passe dans `EMAIL_HOST_PASSWORD`

### Autres Options
- **SendGrid**: Plus robuste pour la production
- **Mailgun**: Alternative professionnelle
- **AWS SES**: Pour les applications à grande échelle

## Surveillance et Maintenance

### Logs Render
- Vérifiez les logs dans le dashboard Render
- Surveillez les erreurs 4xx/5xx

### Base de Données
- Surveillez l'utilisation du stockage (plan gratuit: 256MB)
- Faites des sauvegardes régulières

### Performance
- Le plan gratuit a des limites (750 heures/mois)
- Surveillez le temps de réponse

## Sécurité

### HTTPS
- Render fournit automatiquement des certificats SSL
- Toutes les communications sont chiffrées

### Variables d'Environnement
- Ne jamais exposer les clés secrètes dans le code
- Utilisez toujours les variables d'environnement

### Base de Données
- Le plan gratuit inclut le SSL
- Limitez l'accès aux services Render uniquement

## Dépannage

### Problèmes Communs
1. **CORS Error**: Vérifiez que l'URL du frontend est dans `CORS_ALLOWED_ORIGINS`
2. **Database Connection**: Vérifiez les variables d'environnement de la base de données
3. **Static Files**: Assurez-vous que `collectstatic` s'exécute pendant le build

### Commandes Utiles
```bash
# Vérifier la configuration
python manage.py check --settings=backend.settings.production

# Tester la connexion à la base de données
python manage.py dbshell --settings=backend.settings.production

# Vérifier les migrations
python manage.py showmigrations --settings=backend.settings.production
```

## Coûts Estimés (Plan Gratuit)

- **Backend Web Service**: Gratuit
- **PostgreSQL**: Gratuit (256MB storage)
- **Frontend Static Site**: Gratuit
- **Total**: $0/mois (avec limitations)

### Limitations du Plan Gratuit
- **Web Service**: 750 heures/mois
- **Base de données**: 256MB storage
- **Bandwith**: 100GB/mois
- **Redémarrages automatiques** après 15 minutes d'inactivité

Pour une application en production, envisagez de passer aux plans payants (~$7-25/mois) pour plus de ressources et de fiabilité.
