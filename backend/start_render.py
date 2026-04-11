#!/usr/bin/env python
"""
Script de démarrage pour Render
"""
import os
import sys
from django.core.management import execute_from_command_line

def main():
    """Démarrer le serveur Django pour Render"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings.production')
    
    # Récupérer le port depuis l'environnement Render
    port = os.environ.get('PORT', '10000')
    
    # Démarrer le serveur
    execute_from_command_line(['manage.py', 'runserver', f'0.0.0.0:{port}'])

if __name__ == '__main__':
    main()
