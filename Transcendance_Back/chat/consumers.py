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
    async def connect(self):  # Méthode appelée lorsqu'un §client se connecte
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

        command = None
        original_user = None
        user_to_add = None
        friend_to_delete = None
        current_user = self.scope['user']

        if not current_user.is_authenticated:
            return

        if "command" in json_text:
            command = json_text["command"]

        if "original_user" in json_text:
            original_user = json_text["original_user"]
            original_user = await self.get_user(original_user)
    
        if "user_to_add" in json_text:
            user_to_add = json_text["user_to_add"]
            user_to_add = await self.get_user(user_to_add)

        if "friend_to_delete" in json_text:
            friend_to_delete = json_text["friend_to_delete"]
            friend_to_delete = await self.get_user(friend_to_delete)

        

    
        if original_user is not None and user_to_add is not None or "get" in command or friend_to_delete is not None:
            await self.command_handler(command, original_user, user_to_add, current_user, friend_to_delete)
    
    async def command_handler(self, command, original_user, user_to_add, current_user, friend_to_delete):
        if command == 'add_friend':
            if current_user == original_user:
                add_friend = await self.add_friend_request(original_user, user_to_add)
                if add_friend:
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "add_friend",
                                'original_user': original_user.username,
                                'user_to_add': user_to_add.username
                            }
                        }
                    )
                print(f'✅ add_friend : {original_user} -> {user_to_add}')

        if command == 'accept_friend':
            if current_user == user_to_add:
                await self.accept_friend_request(original_user, user_to_add)
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "friend_accepted",
                                'user_to_add': user_to_add.username,
                                'original_user': original_user.username
                            }
                        }
                    )


        if command == 'reject_friend':
            if current_user == user_to_add:
                await self.reject_friend_request(original_user, user_to_add)
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "friend_rejected",
                                'user_to_add': user_to_add.username,
                                'original_user': original_user.username
                            }
                        }
                    )
            
        if command == 'delete_friend':
            if current_user == original_user:
                await self.delete_friend_request(friend_to_delete, original_user)
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "friend_deleted",
                                'friend_to_delete': friend_to_delete.username,
                                'original_user': original_user.username
                            }
                        }
                    )
    
        if command == 'get_friends_infos':
            if current_user == user_to_add:
                friends_infos = await self.get_friends_infos_request(user_to_add)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "system_message",
                        'message': friends_infos
                    }
                )

#! add_friend : original_user, user_to_add
#! accept_friend : original_user, user_to_add
#! reject_friend : original_user, user_to_add
    async def system_message(self, event):
        # Extract the message from the event
        message = event['message']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def get_user(self, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        return user

    @database_sync_to_async
    def add_friend_request(self, original_user, user_to_add):
        if not user_to_add.friends.filter(username=original_user.username).exists() and user_to_add.friend_request.filter(username=original_user.username).exists():
            user_to_add.friend_request.append(original_user.username)
            user_to_add.save()
            return True
        return False

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
    def delete_friend_request(self, friend_to_delete, original_user):
        original_user.friends.remove(friend_to_delete)
        original_user.save()

    @database_sync_to_async
    def get_friends_infos_request(self, user):
        data = {
            'command': 'get_friends_infos',
            'user_to_add': user.username,
            'original_user': 'None',
            'friends': [friend.username for friend in user.friends.all()],
            'friend_request': list(user.friend_request)
        }
        return data



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