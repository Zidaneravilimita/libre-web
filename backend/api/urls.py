from django.urls import path
from . import views

urlpatterns = [
    # Authentification
    path('auth/register/', views.register_user, name='register_user'),
    path('auth/login/', views.login_user, name='login_user'),
    
    # Données de référence
    path('cities/', views.get_cities, name='get_cities'),
    path('categories/', views.get_categories, name='get_categories'),
]
