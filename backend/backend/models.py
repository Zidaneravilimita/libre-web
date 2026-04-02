from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """Modèle utilisateur personnalisé"""
    ROLE_CHOICES = [
        ('visitor', 'Visiteur'),
        ('organizer', 'Organisateur'),
    ]
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='visitor')
    avatar_url = models.URLField(max_length=500, blank=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class City(models.Model):
    """Modèle pour les villes"""
    id_ville = models.AutoField(primary_key=True)
    nom_ville = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ville'
        verbose_name = 'Ville'
        verbose_name_plural = 'Villes'

class Category(models.Model):
    """Modèle pour les catégories d'événements"""
    id_category = models.AutoField(primary_key=True)
    nom_category = models.CharField(max_length=100)
    photo = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'category'
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'

class Event(models.Model):
    """Modèle pour les événements"""
    id_event = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=200)
    description = models.TextField()
    date_event = models.DateTimeField()
    lieu_detail = models.CharField(max_length=500)
    image_url = models.URLField(max_length=500, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_participants = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Relations
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events_organized')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='events')
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, related_name='events')
    
    class Meta:
        db_table = 'events'
        verbose_name = 'Événement'
        verbose_name_plural = 'Événements'

class EventParticipant(models.Model):
    """Modèle pour les participants aux événements"""
    id_participant = models.AutoField(primary_key=True)
    registration_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='registered')
    
    # Relations
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events_participated')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participants')
    
    class Meta:
        db_table = 'event_participants'
        verbose_name = 'Participant'
        verbose_name_plural = 'Participants'
        unique_together = ['user', 'event']

class FavoriteEvent(models.Model):
    """Modèle pour les événements favoris"""
    id_favorite = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Relations
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_events')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='favorited_by')
    
    class Meta:
        db_table = 'favorite_events'
        verbose_name = 'Événement favori'
        verbose_name_plural = 'Événements favoris'
        unique_together = ['user', 'event']
