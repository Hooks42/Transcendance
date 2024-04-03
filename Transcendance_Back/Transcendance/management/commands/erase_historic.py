from django.core.management.base import BaseCommand
from Transcendance.models import GameHistory, PFC_Game_ID
from django.core.exceptions import ObjectDoesNotExist



class Command(BaseCommand):
    help = 'Erase gamehistory and pfc_game_id from id' 

    def add_arguments(self, parser):
        parser.add_argument('id', type=str, help='id of the game')

    def handle(self, *args, **options):
        id = options['id']
        try:
            game = GameHistory.objects.get(game_id=id)
            game.delete()
        except game.DoesNotExist:
            print(f"La game {id} n'existe pas 🔥")
            return
        
        try:
            game_id = PFC_Game_ID.objects.get(game_id=id)
            game_id.delete()
        except game_id.DoesNotExist:
            print(f"La game_id {id} n'existe pas dans PFC_game_id 🔥")
            return

        print(f"Tous les historiques ont ete delete ✅")