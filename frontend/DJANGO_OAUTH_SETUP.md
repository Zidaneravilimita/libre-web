# Configuration OAuth avec Django Backend

## Vue d'ensemble
Le frontend est maintenant configuré pour utiliser votre backend Django/PostgreSQL au lieu de Supabase. Voici ce qui a été modifié et ce qu'il faut configurer dans votre backend.

## Modifications apportées au frontend

### 1. Remplacement de Supabase par Axios
- Importation d'axios pour les requêtes HTTP
- Suppression de toutes les références Supabase
- Configuration des endpoints Django

### 2. Endpoints API configurés
- **Login** : `POST http://localhost:8000/api/auth/login/`
- **Register** : `POST http://localhost:8000/api/auth/register/`
- **Cities** : `GET http://localhost:8000/api/cities/`
- **OAuth** : `GET http://localhost:8000/api/auth/{provider}/`

### 3. Gestion des tokens
- Stockage du token JWT dans `localStorage`
- Configuration automatique des headers Authorization
- Format : `Bearer {token}`

## Configuration requise dans votre backend Django

### 1. Installer les packages nécessaires
```bash
pip install djangorestframework
pip install django-oauth-toolkit
pip install social-auth-app-django
pip install djangorestframework-simplejwt
```

### 2. Configurer settings.py
```python
INSTALLED_APPS = [
    # ... vos apps
    'rest_framework',
    'oauth2_provider',
    'social_django',
    'rest_framework_simplejwt',
]

# Configuration JWT
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
}

# Configuration OAuth
AUTHENTICATION_BACKENDS = [
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
    'social_core.backends.github.GithubOAuth2',
    'django.contrib.auth.backends.ModelBackend',
]

# Configuration Social Django
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = 'votre-google-client-id'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'votre-google-client-secret'

SOCIAL_AUTH_FACEBOOK_KEY = 'votre-facebook-app-id'
SOCIAL_AUTH_FACEBOOK_SECRET = 'votre-facebook-app-secret'

SOCIAL_AUTH_GITHUB_KEY = 'votre-github-client-id'
SOCIAL_AUTH_GITHUB_SECRET = 'votre-github-client-secret'

# URLs de redirection
SOCIAL_AUTH_REDIRECT_URI = 'http://localhost:3000/auth/callback'
```

### 3. Créer les URLs dans urls.py
```python
from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/google/', views.GoogleOAuthView.as_view(), name='google_oauth'),
    path('auth/facebook/', views.FacebookOAuthView.as_view(), name='facebook_oauth'),
    path('auth/github/', views.GithubOAuthView.as_view(), name='github_oauth'),
    path('cities/', views.CityListView.as_view(), name='city_list'),
]
```

### 4. Créer les vues (views.py)
```python
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from social_django.utils import psa
from .models import User, City

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(request, username=email, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'role': user.role,
                },
                'token': str(refresh.access_token),
            })
        
        return Response(
            {'message': 'Email ou mot de passe incorrect'},
            status=status.HTTP_401_UNAUTHORIZED
        )

class RegisterView(APIView):
    def post(self, request):
        # Logique d'inscription
        pass

class CityListView(APIView):
    def get(self, request):
        cities = City.objects.all()
        data = [{'id': city.id, 'name': city.name} for city in cities]
        return Response(data)

@psa('social:complete')
def oauth_complete(request, backend):
    # Logique de complétion OAuth
    pass
```

### 5. Configuration des URLs OAuth

Dans votre projet principal `urls.py` :
```python
urlpatterns = [
    # ... vos URLs
    path('auth/', include('social_django.urls')),
]
```

### 6. Créer les modèles (models.py)
```python
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('visitor', 'Visiteur'),
        ('organizer', 'Organisateur'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='visitor')
    city = models.ForeignKey('City', on_delete=models.SET_NULL, null=True, blank=True)

class City(models.Model):
    name = models.CharField(max_length=100)
    # ... autres champs
```

## Configuration des providers OAuth

### 1. Google OAuth
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet
3. Activez Google+ API
4. Créez des identifiants OAuth 2.0
5. URL de redirection : `http://localhost:8000/auth/complete/google/`

### 2. Facebook OAuth
1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Créez une application
3. Ajoutez Facebook Login
4. URL de redirection : `http://localhost:8000/auth/complete/facebook/`

### 3. GitHub OAuth
1. Allez sur [GitHub Settings > Developer](https://github.com/settings/developers)
2. Créez une OAuth App
3. URL de callback : `http://localhost:8000/auth/complete/github/`

## Test de l'intégration

1. Démarrez votre backend Django : `python manage.py runserver`
2. Démarrez votre frontend React : `npm start`
3. Testez la connexion normale avec email/mot de passe
4. Testez les boutons de connexion sociale

## Dépannage

- **Erreur 404** : Vérifiez que les URLs Django sont correctes
- **Erreur CORS** : Ajoutez `django-cors-headers` à votre projet
- **OAuth échoue** : Vérifiez les identifiants et URLs de redirection
