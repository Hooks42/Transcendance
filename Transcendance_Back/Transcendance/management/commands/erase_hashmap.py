from django.core.management.base import BaseCommand
from Transcendance.models import HashMap

class Command(BaseCommand):
    def handle(self, *args, **options):
        HashMap.objects.all().delete()
        print("Toutes les données de la table HashMap ont été supprimées avec succès ✅")