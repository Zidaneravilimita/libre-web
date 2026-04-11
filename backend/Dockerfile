# Utiliser une image Python officielle
FROM python:3.11-slim

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de requirements
COPY requirements.txt .

# Installer les dépendances Python
RUN python -m pip install --upgrade pip && \
    python -m pip install --no-cache-dir -r requirements.txt

# Copier le reste de l'application
COPY . .

# Créer les répertoires nécessaires
RUN mkdir -p staticfiles

# Exposer le port (Railway définira $PORT automatiquement)
ENV PORT=8000
EXPOSE 8000

# Commande de démarrage
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:$PORT"]
