from django.core.management.base import BaseCommand
from Transcendance.models import HashMap
import random

class Command(BaseCommand):
    
    def handle(self, *args, **options):
        if not HashMap.objects.exists():
            def Create_Hashing_table():
                key = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                    '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', ':', ';', '\"', '\'', '\\', '|', '`', '~', '<', ',', '>',
                    '.', '?', '/', ' ', 'Â', 'Ã', 'Ä', 'À', 'Á', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ',
                    'Ö', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð',
                    'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ']

                value = list(key)
                random.shuffle(value)
                Hashing_map = dict()
                for i in range(len(key)):
                    Hashing_map[key[i]] = value[i]
                return Hashing_map

            def Save_Hashing_tables():
                for i in range(8):
                    hash_table = Create_Hashing_table()
                    hash_tbl = HashMap(data=hash_table, _id=i+1)
                    hash_tbl.save()
                print("HashMap successfully saved ✅")
            Save_Hashing_tables()
        else:
            print("HashMap already exists 🔥")




