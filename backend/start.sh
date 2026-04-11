#!/bin/bash
# Script de démarrage pour Render
export DJANGO_SETTINGS_MODULE=backend.settings.production
python manage.py runserver 0.0.0.0:$PORT
