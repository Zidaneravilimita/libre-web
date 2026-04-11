#!/bin/bash
# Script de démarrage pour Render
export DJANGO_SETTINGS_MODULE=backend.settings.production
gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
