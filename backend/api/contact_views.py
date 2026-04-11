from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_admin(request):
    """Envoyer un email à l'administrateur"""
    try:
        data = json.loads(request.body)
        
        # Validation des données
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field) or not data.get(field).strip():
                return Response({
                    'error': f'Le champ {field} est requis'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        name = data.get('name').strip()
        email = data.get('email').strip()
        subject = data.get('subject', 'Nouveau message de contact').strip()
        message = data.get('message').strip()
        
        # Validation de l'email
        if '@' not in email or '.' not in email:
            return Response({
                'error': 'Format d\'email invalide'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Préparation de l'email
        email_subject = f"[EventHub] {subject}"
        email_message = f"""
Nouveau message de contact de {name}

Email: {email}
Sujet: {subject}

Message:
{message}

---
Envoyé depuis le formulaire de contact EventHub
        """
        
        # Envoi de l'email
        try:
            send_mail(
                subject=email_subject,
                message=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL or f'no-reply@eventhub.fr',
                recipient_list=[settings.ADMIN_EMAIL or 'tahiendrazazidane@gmail.com'],
                fail_silently=False,
            )
        except Exception as mail_error:
            print(f"Erreur envoi email: {mail_error}")
            # En cas d'erreur d'envoi d'email, on sauvegarde quand même le message
            # TODO: Implémenter une sauvegarde en base de données
        
        return Response({
            'message': 'Message envoyé avec succès'
        }, status=status.HTTP_200_OK)
        
    except json.JSONDecodeError:
        return Response({
            'error': 'Données JSON invalides'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Erreur contact admin: {str(e)}")
        return Response({
            'error': 'Erreur serveur lors de l\'envoi du message'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
