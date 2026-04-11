#!/bin/bash

# Script de déploiement pour EventHub sur Render
echo "Début du déploiement d'EventHub Backend..."

# Installation des dépendances
echo "Installation des dépendances..."
pip install -r requirements.txt

# Collecte des fichiers statiques
echo "Collecte des fichiers statiques..."
python manage.py collectstatic --noinput --settings=backend.settings.production

# Application des migrations
echo "Application des migrations de base de données..."
python manage.py migrate --settings=backend.settings.production

# Création d'un superutilisateur si nécessaire
echo "Vérification du superutilisateur..."
python manage.py shell --settings=backend.settings.production << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@eventhub.fr').exists():
    User.objects.create_superuser('admin@eventhub.fr', 'admin123', 'Admin EventHub')
    print("Superutilisateur créé: admin@eventhub.fr")
else:
    print("Superutilisateur existe déjà")
EOF

echo "Déploiement terminé avec succès!"
