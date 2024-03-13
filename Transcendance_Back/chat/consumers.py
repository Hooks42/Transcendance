import json  # Importe le module json pour manipuler les données JSON
from channels.db import database_sync_to_async  # Importe l'utilitaire pour exécuter du code synchrone dans un contexte asynchrone
from channels.generic.websocket import AsyncWebsocketConsumer  # Importe la classe de base pour les consommateurs WebSocket asynchrones
from Transcendance.models import Message, User  # Importe le modèle Message de votre application
from datetime import datetime

#! ATTENTION A L'HORODATAGE CE N'EST PAS LE BON FUSEAU HORAIRE


'''
#!-------------------------------------------------------------------------------------------------------
    async --> permet de définir une fonction asynchrone

    await --> permet de suspendre l'exécution de la coroutine jusqu'à ce que le résultat soit prêt

    @database_sync_to_async --> permet d'exécuter une fonction asynchrone dans un contexte synchrone
#!-------------------------------------------------------------------------------------------------------
'''

class SystemConsumer(AsyncWebsocketConsumer):  # Définit une nouvelle classe de consommateur WebSocket
    async def connect(self):  # Méthode appelée lorsqu'un client se connecte
        self.room_name = 'system_room'  # Définit le nom de la salle
        self.room_group_name = self.room_name # Utilise le nom de la salle comme nom du groupe
        await self.channel_layer.group_add(  # Ajoute le canal du client au groupe
            self.room_group_name, self.channel_name
        )
        await self.accept()  # Accepte la connexion WebSocket
    
    async def disconnect(self, code):  # Méthode appelée lorsqu'un client se déconnecte
        await self.channel_layer.group_discard(  # Retire le canal du client du groupe
            self.room_group_name, self.channel_name
        )

    async def receive(self, text_data):  # Méthode appelée lorsqu'un message est reçu du client
        json_text = json.loads(text_data)  # Convertit le texte en JSON
        command = json_text["command"]  # Récupère le message du JSON
        original_user = json_text["original_user"]
        user_to_add = json_text["user_to_add"]
        original_user = await self.get_user(original_user)  # Récupère l'utilisateur qui veut effectuer la commande
        user_to_add = await self.get_user(user_to_add)
        await self.command_handler(command, original_user, user_to_add)
    
    async def command_handler(self, command, original_user, user_to_add):
        if command == 'add_friend':
            print(f'🔱 command --> {command}\n 🔱 current_user --> {original_user}\n 🔱 user_to_add --> {user_to_add}')
            # await self.add_friend_request(original_user, user_to_add)
            # self.channel_layer.group_send(
            #     self.room_group_name,
            #     {
            #         "type": "system_message",
            #         'message': json.dumps({
            #             'username': user_to_add.username,
            #             'command': 'add_friend'
            #         })
            #     }
            # )
        if command == 'accept_friend':
            await self.accept_friend_request(original_user, user_to_add)
        if command == 'reject_friend':
            await self.reject_friend_request(original_user, user_to_add)


#! add_friend : original_user, user_to_add
#! accept_friend : original_user, user_to_add
#! reject_friend : original_user, user_to_add
            
    @database_sync_to_async
    def accept_friend_request(self, original_user, user_to_add):
        original_user.friends.add(user_to_add)
        user_to_add.friend_request.remove(original_user.username)
        original_user.save()
        user_to_add.save()

    @database_sync_to_async
    def reject_friend_request(self, original_user, user_to_add):
        user_to_add.friend_request.remove(original_user.username)
        user_to_add.save()
    
    @database_sync_to_async
    def add_friend_request(self, original_user, user_to_add):
        user_to_add.friend_request.append(original_user.username)
        user_to_add.save()

    @database_sync_to_async
    def get_user(self, username):
        return User.objects.get(username=username)



class ChatConsumer(AsyncWebsocketConsumer):  # Définit une nouvelle classe de consommateur WebSocket
    async def connect(self):  # Méthode appelée lorsqu'un client se connecte
        self.room_name = 'public_room'  # Définit le nom de la salle
        self.room_group_name = self.room_name  # Utilise le nom de la salle comme nom du groupe
        await self.channel_layer.group_add(  # Ajoute le canal du client au groupe
            self.room_group_name, self.channel_name
        )

        self.user = self.scope["user"]  # Récupère l'utilisateur de la portée

        await self.accept()  # Accepte la connexion WebSocket

    async def disconnect(self, code):  # Méthode appelée lorsqu'un client se déconnecte
        await self.channel_layer.group_discard(  # Retire le canal du client du groupe
            self.room_group_name, self.channel_name
        )

    async def receive(self, text_data):  # Méthode appelée lorsqu'un message est reçu du client
        json_text = json.loads(text_data)  # Convertit le texte en JSON
        message = json_text["message"].strip()  # Récupère le message du JSON and remove leading/trailing whitespaces

        if not message: # Si le message est vide, ne rien faire
            return
        
        user = self.scope['user']  # Récupère l'utilisateur de la portée
        username = user.username if user.is_authenticated else "Anonyme"  # Récupère le nom d'utilisateur de l'utilisateur ou "Anonyme" si l'utilisateur n'est pas authentifié

        new_message = Message(user=user, content=message)  # Crée un nouveau message
        await self.save_message(new_message)  # Sauvegarde le message dans la base de données

        timestamp = datetime.now()  # Récupère le timestamp actuel
        formatted_timestamp = timestamp.strftime('%b. %d, %Y, %I:%M %p')  # Format the timestamp
        formatted_timestamp = formatted_timestamp.replace("AM", "a.m.").replace("PM", "p.m.")  # Change AM/PM to a.m./p.m.
        await self.channel_layer.group_send(  # Envoie le message à tous les clients du groupe
            self.room_group_name, 
            {
                "type": "chat_message", 
                "message": message,
                "username": username,
                "timestamp": formatted_timestamp
            }
        )
    
    async def chat_message(self, event):  # Méthode appelée lorsqu'un message de chat est reçu du groupe
        message = event['message']  # Récupère le message de l'événement
        timestamp = event.get("timestamp", "")  # Récupère le timestamp de l'événement
        username = event.get("username", "Anonyme")  # Récupère le nom d'utilisateur de l'événement
        await self.send(text_data=json.dumps({"message": message, "username" : username, "timestamp" : timestamp}))  # Envoie le message au client

    @database_sync_to_async
    def save_message(self, message):  # Méthode pour sauvegarder un message dans la base de données
        message.save()  # Sauvegarde le message