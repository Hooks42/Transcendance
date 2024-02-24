from django.core.management.base import BaseCommand
from Transcendance.models import Message

class Command(BaseCommand):
    def handle(self, *args, **options):
        Message.objects.all().delete()
        print("Toutes les données de la table Message ont été supprimées avec succès ✅")