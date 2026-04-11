from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User as DjangoUser
from backend.models import User, City, Category, Event, EventParticipant, FavoriteEvent
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.db import connection
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Inscription d'un nouvel utilisateur"""
    try:
        data = json.loads(request.body)
        
        # Validation des données
        required_fields = ['username', 'email', 'password', 'role']
        for field in required_fields:
            if not data.get(field):
                return Response({
                    'error': f'Le champ {field} est requis'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validation de l'email
        try:
            validate_email(data['email'])
        except ValidationError:
            return Response({
                'error': 'Format d\'email invalide'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérification si l'email existe déjà
        if User.objects.filter(email=data['email']).exists():
            return Response({
                'error': 'Cet email est déjà utilisé'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérification si le username existe déjà
        if User.objects.filter(username=data['username']).exists():
            return Response({
                'error': 'Ce nom d\'utilisateur est déjà utilisé'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Création de l'utilisateur
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            role=data.get('role', 'visitor'),
            avatar_url=data.get('avatar_url', 'https://i.ibb.co/2n9H0hZ/default-avatar.png'),
            bio=data.get('bio', '')
        )
        
        # Génération des tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        return Response({
            'message': 'Inscription réussie',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'avatar_url': user.avatar_url
            },
            'token': access_token,
            'refresh': refresh_token
        }, status=status.HTTP_201_CREATED)
        
    except json.JSONDecodeError:
        return Response({
            'error': 'Données JSON invalides'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'Erreur serveur: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Connexion d'un utilisateur"""
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Email et mot de passe requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Authentification
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            
            # Génération des tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            return Response({
                'message': 'Connexion réussie',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'avatar_url': user.avatar_url,
                    'bio': user.bio
                },
                'token': access_token,
                'refresh': refresh_token
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Email ou mot de passe incorrect'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except json.JSONDecodeError:
        return Response({
            'error': 'Données JSON invalides'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'Erreur serveur: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_cities(request):
    """Obtenir la liste des villes"""
    try:
        cities = City.objects.all().order_by('nom_ville')
        cities_data = []
        
        for city in cities:
            cities_data.append({
                'id': city.id_ville,
                'name': city.nom_ville
            })
        
        return Response(cities_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Erreur serveur: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_categories(request):
    """Obtenir la liste des catégories"""
    try:
        categories = Category.objects.all().order_by('nom_category')
        categories_data = []
        
        for category in categories:
            categories_data.append({
                'id_category': category.id_category,
                'nom_category': category.nom_category,
                'photo': category.photo
            })
        
        return Response({
            'categories': categories_data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Erreur serveur: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
