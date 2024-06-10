import json  # Importe le module json pour manipuler les données JSON
from channels.db import database_sync_to_async  # Importe l'utilitaire pour exécuter du code synchrone dans un contexte asynchrone
from channels.generic.websocket import AsyncWebsocketConsumer  # Importe la classe de base pour les consommateurs WebSocket asynchrones
from Transcendance.models import Message, User, Conversation, GameHistory, GameStats, PFC_Game_ID, PongHistory, Matchmaking_Queue  # Importe le modèle Message de votre application
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist
from Transcendance.serializers import GameHistorySerializer
import random

#! ATTENTION A L'HORODATAGE CE N'EST PAS LE BON FUSEAU HORAIRE


'''
#!-------------------------------------------------------------------------------------------------------
    async --> permet de définir une fonction asynchrone

    await --> permet de suspendre l'exécution de la coroutine jusqu'à ce que le résultat soit prêt

    @database_sync_to_async --> permet d'exécuter une fonction asynchrone dans un contexte synchrone
#!-------------------------------------------------------------------------------------------------------
'''



class PrivateChatConsumer(AsyncWebsocketConsumer):  # Définit une nouvelle classe de consommateur WebSocket
    async def connect(self):  # Méthode appelée lorsqu'un client se connecte
        self.room_name = self.scope['url_route']['kwargs']['room_name']  # Récupère le nom de la salle à partir des paramètres de l'URL
        self.room_group_name = f'private_{self.room_name}'  # Utilise le nom de la salle comme nom du groupe
        
        self.user1 = await self.get_user(self.room_name.split('_')[0])
        self.user2 = await self.get_user(self.room_name.split('_')[1])
        
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
        
        message = None
        command = json_text.get("command", None)
        user_to_edit = json_text.get("user_to_edit", None)
        new_username = json_text.get("new_username", None)
        
        user = self.scope['user']  # Récupère l'utilisateur de la portée
        
        print (f"❤️‍🔥 command --> {command} || user_to_edit --> {user_to_edit} || new_username --> {new_username} ❤️‍🔥")
        if command == "edit_profile" and user_to_edit is not None and new_username is not None:
            if user.username == user_to_edit:
                self.scope['user'] = await self.get_user(new_username)
                if self.user1.username == user_to_edit:
                    self.user1 = await self.get_user(new_username)
                elif self.user2.username == user_to_edit:
                    self.user2 = await self.get_user(new_username)
        else:
            message = json_text["message"].strip()
                
        if not message: # Si le message est vide, ne rien faire
            return
        
        user = self.scope['user']  # Récupère l'utilisateur de la portée
        username = user.username if user.is_authenticated else "Anonyme"  # Récupère le nom d'utilisateur de l'utilisateur ou "Anonyme" si l'utilisateur n'est pas authentifié
        if username == self.user1.username or username == self.user2.username:
            profile_picture = await self.get_user_profile_picture(self.user1)
        
            profile_picture = await self.get_user_profile_picture(user)
            print(f"🔥🔥🔥 profile_picture --> {profile_picture} || 🌿🌿🌿 user --> {user}")

            timestamp = datetime.now()  # Récupère le timestamp actuel
            formatted_timestamp = timestamp.strftime('%b. %d, %Y, %I:%M %p')  # Format the timestamp
            formatted_timestamp = formatted_timestamp.replace("AM", "a.m.").replace("PM", "p.m.")  # Change AM/PM to a.m./p.m.
            
            await self.save_message(user, message, timestamp)  # Sauvegarde le message dans la base de données
            await self.channel_layer.group_send(  # Envoie le message à tous les clients du groupe
                self.room_group_name, 
                {
                    "type": "chat_message", 
                    "message": message,
                    "username": username,
                    "timestamp": formatted_timestamp,
                    "profile_picture": profile_picture
                }
            )
    
    async def chat_message(self, event):  # Méthode appelée lorsqu'un message de chat est reçu du groupe
        message = event['message']  # Récupère le message de l'événement
        timestamp = event.get("timestamp", "")  # Récupère le timestamp de l'événement
        username = event.get("username", "Anonyme")  # Récupère le nom d'utilisateur de l'événement
        profile_picture = event.get("profile_picture", None)
        await self.send(text_data=json.dumps({"message": message, "username" : username, "timestamp" : timestamp, "profile_picture" : profile_picture}))  # Envoie le message au client
    
    @database_sync_to_async
    def save_message(self, user, message, timestamp):  # Méthode pour sauvegarder un message dans la base de données
        try:
            conversation = Conversation.objects.get(user1=self.user1, user2=self.user2)  # Récupère la conversation générale
        except Conversation.DoesNotExist:
            conversation = Conversation()
            conversation.user1 = self.user1
            conversation.user2 = self.user2
            conversation.save()
        new_message = Message(conversation=conversation, user=user, content=message, timestamp=timestamp)  # Crée un nouveau message
        new_message.save()  # Sauvegarde le message
        
    @database_sync_to_async
    def get_user(self, username):
        try:
            user = User.objects.get(username=username)  # Récupère l'utilisateur par nom d'utilisateur
        except User.DoesNotExist:
            return None
        return user

    @database_sync_to_async
    def get_user_profile_picture(self, user):
        try:
            user = User.objects.get(username=user.username)
        except User.DoesNotExist:
            return None
        return user.avatar.url

class SystemConsumer(AsyncWebsocketConsumer):  # Définit une nouvelle classe de consommateur WebSocket
    async def connect(self):  # Méthode appelée lorsqu'un §client se connecte
        self.room_name = 'system_room'  # Définit le nom de la salle
        self.room_group_name = self.room_name # Utilise le nom de la salle comme nom du groupe
        await self.channel_layer.group_add(  # Ajoute le canal du client au groupe
            self.room_group_name, self.channel_name
        )
        await self.accept()  # Accepte la connexion WebSocket
    
    async def disconnect(self, code):  # Méthode appelée lorsqu'un client se déconnecte
        
        current_user = self.scope['user']
        player_to_disconnect = []
        player_to_disconnect.append(current_user)
        await self.disconnect_player_in_queue(current_user)
        await self.assign_main_queue(player_to_disconnect)
        
        await self.channel_layer.group_discard(  # Retire le canal du client du groupe
            self.room_group_name, self.channel_name
        )

    async def receive(self, text_data):  # Méthode appelée lorsqu'un message est reçu du client
        json_text = json.loads(text_data)  # Convertit le texte en JSON

        command = None
        original_user = None
        user_to_add = None
        friend_to_delete = None
        user_to_edit = None
        new_username = None
        new_avatar = None
        player_to_add_in_queue = None
        players_to_kick = None

        current_user = self.scope['user']

        if not current_user.is_authenticated:
            return

        if "command" in json_text:
            command = json_text["command"]
            print(f"🔱 command : {command}")

        if "original_user" in json_text:
            original_user = json_text["original_user"]
            original_user = await self.get_user(original_user)
            print(f"🔱 original_user : {original_user}")
    
        if "user_to_add" in json_text:
            user_to_add = json_text["user_to_add"]
            user_to_add = await self.get_user(user_to_add)
            print(f"🔱 user_to_add : {user_to_add}")

        if "friend_to_delete" in json_text:
            friend_to_delete = json_text["friend_to_delete"]
            friend_to_delete = await self.get_user(friend_to_delete)
            print(f"🔱 friend_to_delete : {friend_to_delete}")
            
        if "user_to_edit" in json_text:
            user_to_edit = json_text["user_to_edit"]
            print(f"🔱 user_to_edit : {user_to_edit}")
        
        if "new_username" in json_text:
            new_username = json_text["new_username"]
            print(f"🔱 new_username : {new_username}")
        
        if "new_avatar" in json_text:
            new_avatar = json_text["new_avatar"]
            print(f"🔱 new_avatar : {new_avatar}")
        
        if "player_to_add_in_queue" in json_text:
            player_to_add_in_queue = json_text["player_to_add_in_queue"]
            player_to_add_in_queue = await self.get_user(player_to_add_in_queue)
            print(f"🔱 player_to_add_in_queue : {player_to_add_in_queue}")
        
        if "players_to_kick" in json_text:
            players_to_kick = json_text["players_to_kick"]
            players_to_kick = [await self.get_user(player) for player in players_to_kick]
            print(f"🔱 players_to_kick : {players_to_kick}")

        print('\n')
    
        if original_user is not None and user_to_add is not None or "get" in command or friend_to_delete is not None or user_to_edit is not None and new_username is not None or new_avatar is not None or player_to_add_in_queue is not None or players_to_kick is not None and len(players_to_kick) >= 1 or "find_match" in command:
            await self.command_handler(command, original_user, user_to_add, current_user, friend_to_delete, user_to_edit, new_username, new_avatar, player_to_add_in_queue, players_to_kick)
        else:
            print(f"❌ {current_user.username} tried to cheat ❌ due to these parameters : {original_user} - {user_to_add} - {friend_to_delete} - {user_to_edit} - {new_username} - {new_avatar} - {player_to_add_in_queue} - {players_to_kick}")
    async def command_handler(self, command, original_user, user_to_add, current_user, friend_to_delete, user_to_edit, new_username, new_avatar, player_to_add_in_queue, players_to_kick):
        if command == 'add_friend':
            if current_user == original_user and user_to_add not in current_user.block_list and current_user.username not in user_to_add.block_list:
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
            if current_user == user_to_add and not original_user in current_user.block_list:
                await self.accept_friend_request(original_user, user_to_add)
                infos = await self.get_original_and_user_to_add_infos(original_user, user_to_add)
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "friend_accepted",
                                'user_to_add': infos['user_to_add'],
                                'user_to_add_status': infos['user_to_add_status'],
                                'user_to_add_avatar': infos['user_to_add_avatar'],
                                'original_user': infos['original_user'],
                                'original_user_status': infos['original_user_status'],
                                'original_user_avatar': infos['original_user_avatar'],
                            }
                        }
                    )


        if command == 'reject_friend':
            if current_user == user_to_add and not original_user in current_user.block_list:
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
            if current_user == original_user and not friend_to_delete in current_user.block_list:
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
        
        if command == 'block_friend':
            if current_user == original_user and not user_to_add in current_user.block_list:
                await self.block_friend_request(original_user, user_to_add)
                infos = await self.get_original_and_user_to_add_infos(original_user, user_to_add)
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "friend_blocked",
                                'user_to_add': user_to_add.username,
                                'user_to_add_status': infos['user_to_add_status'],
                                'user_to_add_avatar': infos['user_to_add_avatar'],
                                'original_user': original_user.username,
                                'original_user_status': infos['original_user_status'],
                                'original_user_avatar': infos['original_user_avatar'],
                            }
                        }
                    )
                
        if command == 'unblock_friend':
            if current_user == original_user:
                await self.unblock_friend_request(original_user, user_to_add)
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "friend_unblocked",
                                'user_to_add': user_to_add.username,
                                'original_user': original_user.username
                            }
                        }
                    )
        
        if command == 'pfc_request':
            if current_user == original_user:
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "pfc_asked",
                                'user_to_add': user_to_add.username,
                                'original_user': original_user.username
                            }
                        }
                    )
                
        if command == 'pfc_accepted':
            if current_user == user_to_add:
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "pfc_accepted",
                                'user_to_add': user_to_add.username,
                                'original_user': original_user.username
                            }
                        }
                    )
        
        if command == 'pfc_rejected':
            if current_user == user_to_add:
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "pfc_rejected",
                                'user_to_add': user_to_add.username,
                                'original_user': original_user.username
                            }
                        }
                    )
                
        if command == 'edit_profile':
            print(f"🌿 current_user --> {current_user.username} || user_to_edit --> {user_to_edit} 🌿")
            if current_user.username == user_to_edit:
                self.scope['user'] = await self.get_user(new_username)
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "profile_edited",
                                'user_to_edit': user_to_edit,
                                'new_username': new_username,
                                'new_avatar': new_avatar
                            }
                        }
                    )
                
        if command == 'update_friend_request_and_block_list':
            if current_user != user_to_edit:
                is_updated = False if await self.update_friend_request_and_block_list_request(user_to_edit, new_username) is None else True
                await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': "friend_request_and_block_list_updated",
                                'is_updated': is_updated,
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

        if command == 'get_user_infos':
            user_infos = await self.get_user_infos_request(original_user)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "system_message",
                    'message': user_infos
                }
            )

        if command == 'get_user_history':
            history = await self.get_user_history_request(original_user)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "system_message",
                    'message': history
                }
            )

        if command == 'get_actual_games':
            if current_user == original_user:
                opponent = await self.get_actual_games_request(original_user)
                if opponent is not None:
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': 'game_found',
                                'original_user': original_user.username,
                                'user_to_add': opponent
                            }
                        }
                    )
                    
        
        if command == 'join_queue':
            if current_user == player_to_add_in_queue:
                await self.add_to_queue(player_to_add_in_queue)
                print(f"🔱 {player_to_add_in_queue.username} joined the queue 🔱 with main_queue --> {player_to_add_in_queue.main_queue_player}")
        
        if command == 'kick_queue':
            if current_user in players_to_kick:
                await self.kick_to_queue(players_to_kick)
                await self.assign_main_queue(players_to_kick)
                
        if command == 'find_match':
            if await self.check_if_main_queue(current_user) == True:
                print (f"🌿 resultat du check --> True pour {current_user}")
                match_tab = []
                match_tab = await self.find_match()
                print (f"🌿 match_tab --> {match_tab}")
                if match_tab is not None and len(match_tab) >= 1:
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            "type": "system_message",
                            'message': {
                                'command': 'match_found',
                                'match_tab': match_tab,
                            }
                        }
                    )
                else:
                    print(f"🔱 No match found 🔱")
            else:
                print (f"🌿 resultat du check --> False pour {current_user}")
            
            
            

    async def system_message(self, event):
        # Extract the message from the event
        message = event['message']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))



    @database_sync_to_async
    def disconnect_player_in_queue(self, current_user):
        queue = Matchmaking_Queue.objects.first()
        if current_user in queue.user_in_queue.all():
            queue.remove_user(current_user)
            print(f"🔱 {current_user.username} left the queue 🔱 with main_queue --> {current_user.main_queue_player}")
        
    @database_sync_to_async
    def check_if_main_queue(self, current_user):
        update_current_user = User.objects.get(username=current_user.username)
        return update_current_user.main_queue_player
        

    @database_sync_to_async
    def assign_main_queue(self, players_to_kick):
        if len(players_to_kick) == 1:
            player = User.objects.get(username=players_to_kick[0])
            if player.main_queue_player == True:
                player.main_queue_player = False
                player.save()
            print(f"🔱 {player.username} kicked from the queue 🔱 with main_queue --> {player.main_queue_player}")
        first_queue = Matchmaking_Queue.objects.first()
        if first_queue is not None:
            existing_token_user = first_queue.user_in_queue.filter(main_queue_player=True).first()
            user_in_queue = first_queue.user_in_queue.first()
            if user_in_queue is not None and existing_token_user is None:
                user_in_queue.main_queue_player = True
                user_in_queue.save()
                print(f"🔱 {user_in_queue.username} is now the main player in the queue --> {user_in_queue.main_queue_player} 🔱")
                
        
    @database_sync_to_async
    def add_to_queue(self, player_to_add_in_queue):
        if player_to_add_in_queue is not None:
            queue,_ = Matchmaking_Queue.objects.get_or_create()
            queue.add_user(player_to_add_in_queue)
            len_queue = queue.user_in_queue.count()
            if len_queue == 1:
                player_to_add_in_queue.main_queue_player = True
                player_to_add_in_queue.save()
            
    
    @database_sync_to_async
    def kick_to_queue(self, players_to_kick):
        if players_to_kick is not None and len(players_to_kick) >= 1:
            queue = Matchmaking_Queue.objects.first()
            if queue is not None and queue.user_in_queue.count() >= 1:
                for player in players_to_kick:
                    queue.remove_user(player)
    
    @database_sync_to_async
    def find_match(self):
        queue = Matchmaking_Queue.objects.first()
        match_tab = []
        if queue is not None and queue.user_in_queue.count() >= 2:
            users_in_queue = list(queue.user_in_queue.all())
            while len(users_in_queue) > 1:
                dict_match = {}
                player1 = random.choice(users_in_queue)
                users_in_queue.remove(player1)
                queue.remove_user(player1)
                player2 = random.choice(users_in_queue)
                users_in_queue.remove(player2)
                queue.remove_user(player2)
                dict_match["player1"] = player1.username
                dict_match["player2"] = player2.username
                match_tab.append(dict_match)
            return match_tab
        else:
            return None
        
    
    @database_sync_to_async
    def update_friend_request_and_block_list_request(self, user_to_edit, new_username):
        try:
            all_user = User.objects.all()
        except User.DoesNotExist:
            return None
        
        print(f"🔱 all_user --> {all_user}")
        
        for user in all_user:
            print(f"🔱 {user.username} --> {user.friend_request}")
            if user_to_edit in user.friend_request:
                user.friend_request.remove(user_to_edit)
                user.friend_request.append(new_username)
                user.save()
        
        for user in all_user:
            print(f"✅ {user.username} --> {user.friend_request}")
        
        for user in all_user:
            if user_to_edit in user.block_list:
                user.block_list.remove(user_to_edit)
                user.block_list.append(new_username)
                user.save()
        
        user.save()
        return True;
        

    @database_sync_to_async
    def get_user(self, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        return user

    @database_sync_to_async
    def add_friend_request(self, original_user, user_to_add):
        if not user_to_add.friends.filter(username=original_user.username).exists() and not original_user.username in user_to_add.friend_request:
            user_to_add.friend_request.append(original_user.username)
            user_to_add.save()
            return True
        return False

    @database_sync_to_async
    def accept_friend_request(self, original_user, user_to_add):
        if not original_user.friends.filter(username=user_to_add.username).exists():
            original_user.friends.add(user_to_add)
            original_user.save()
            if original_user.username in user_to_add.friend_request:
                user_to_add.friend_request.remove(original_user.username)
                user_to_add.save()
            

    @database_sync_to_async
    def reject_friend_request(self, original_user, user_to_add):
        if original_user.username in user_to_add.friend_request:
            user_to_add.friend_request.remove(original_user.username)
            user_to_add.save()


    @database_sync_to_async
    def delete_friend_request(self, friend_to_delete, original_user):
        if original_user.friends.filter(username=friend_to_delete.username).exists():
            original_user.friends.remove(friend_to_delete)
            original_user.save()

    
    @database_sync_to_async
    def block_friend_request(self, original_user, user_to_add):
        if user_to_add.username in original_user.friend_request:
            original_user.friend_request.remove(user_to_add.username)
        
        if original_user.friends.filter(username=user_to_add.username).exists():
            original_user.friends.remove(user_to_add)

        if user_to_add.username not in original_user.block_list:
            original_user.block_list.append(user_to_add.username)
        
        original_user.save()

    @database_sync_to_async
    def unblock_friend_request(self, original_user, user_to_add):
        if user_to_add.username in original_user.block_list:
            original_user.block_list.remove(user_to_add.username)
            original_user.save()

    @database_sync_to_async
    def get_original_and_user_to_add_infos(self, original_user, user_to_add):
        data = {
            'original_user': original_user.username,
            'original_user_status': original_user.is_online,
            'original_user_avatar': original_user.avatar.url,
            'user_to_add': user_to_add.username,
            'user_to_add_status': user_to_add.is_online,
            'user_to_add_avatar': user_to_add.avatar.url
        }
        return data
            

    @database_sync_to_async
    def get_friends_infos_request(self, user):
        data = {
            'command': 'get_friends_infos',
            'user_to_add': user.username,
            'original_user': 'None',
            'friends': [friend.username for friend in user.friends.all()],
            'friend_request': list(user.friend_request),
            'block_list': list(user.block_list),
            'original_user': user.is_online,
            'avatar': user.avatar.url,
        }
        return data


    @database_sync_to_async
    def get_user_infos_request(self, user):
        try:
            user_stats = GameStats.objects.get(user=user)
            data = {
                'command': 'user_infos_sent',
                'total_pong_win': user_stats.total_pong_win,
                'total_pong_los': user_stats.total_pong_los,
                'total_pong_win_tie': user_stats.total_pong_win_tie,
                'total_pong_los_tie': user_stats.total_pong_los_tie,
                'total_scissors': user_stats.total_scissors,
                'total_paper': user_stats.total_paper,
                'total_rock': user_stats.total_rock,
                'total_spr_win': user_stats.total_spr_win,
                'total_spr_los': user_stats.total_spr_los,
                'total_spr_win_tie': user_stats.total_spr_win_tie,
                'total_spr_los_tie': user_stats.total_spr_los_tie,
                'username' : user.username
            }
        except GameStats.DoesNotExist:
            data = {
                'command': 'user_not_found',
            }
        return data
        
    @database_sync_to_async
    def get_user_history_request(self, user):
        try:
            game_history = GameHistory.get_games_for_user(user)
            serializer = GameHistorySerializer(game_history, many=True)
            data = {
                'command': 'user_history_sent',
                'game_history': serializer.data
            }
        except GameHistory.DoesNotExist:
            data = {
                'command': 'user_history_not_found',
            }
        return data

    @database_sync_to_async
    def get_actual_games_request(self, user):
        player = None
        opponent = None
        try:
            player = PFC_Game_ID.objects.get(player1=user)
        except PFC_Game_ID.DoesNotExist:
            try:
                player = PFC_Game_ID.objects.get(player2=user)
            except PFC_Game_ID.DoesNotExist:
                return opponent
        
        if player.player1.username == user.username:
            opponent = player.player2.username
        else:
            opponent = player.player1.username
        return opponent
        



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
        
        message = None
        command = json_text.get("command", None)
        user_to_edit = json_text.get("user_to_edit", None)
        new_username = json_text.get("new_username", None)
        
        user = self.scope['user']  # Récupère l'utilisateur de la portée
        
        print (f"❤️‍🔥 command --> {command} || user_to_edit --> {user_to_edit} || new_username --> {new_username} ❤️‍🔥")
        if command == "edit_profile" and user_to_edit is not None and new_username is not None:
            if user.username == user_to_edit:
                print("❤️‍🔥 Je passe ici mon reuf")
                self.scope['user'] = await self.get_user(new_username)
        else:
            message = json_text["message"].strip()
                
        if not message: # Si le message est vide, ne rien faire
            return
        
        user = self.scope['user']  # Récupère l'utilisateur de la portée
        username = user.username if user.is_authenticated else "Anonyme"  # Récupère le nom d'utilisateur de l'utilisateur ou "Anonyme" si l'utilisateur n'est pas authentifié
        
        profile_picture = await self.get_user_profile_picture(user)
        print(f"🔥🔥🔥 profile_picture --> {profile_picture} || 🌿🌿🌿 user --> {user}")

        timestamp = datetime.now()  # Récupère le timestamp actuel
        formatted_timestamp = timestamp.strftime('%b. %d, %Y, %I:%M %p')  # Format the timestamp
        formatted_timestamp = formatted_timestamp.replace("AM", "a.m.").replace("PM", "p.m.")  # Change AM/PM to a.m./p.m.
        
        await self.save_message(user, message, timestamp)  # Sauvegarde le message dans la base de données

        await self.channel_layer.group_send(  # Envoie le message à tous les clients du groupe
            self.room_group_name, 
            {
                "type": "chat_message", 
                "message": message,
                "username": username,
                "timestamp": formatted_timestamp,
                "profile_picture": profile_picture
            }
        )
    
    async def chat_message(self, event):  # Méthode appelée lorsqu'un message de chat est reçu du groupe
        message = event['message']  # Récupère le message de l'événement
        timestamp = event.get("timestamp", "")  # Récupère le timestamp de l'événement
        username = event.get("username", "Anonyme")  # Récupère le nom d'utilisateur de l'événement
        profile_picture = event.get("profile_picture", None)
        await self.send(text_data=json.dumps({"message": message, "username" : username, "timestamp" : timestamp, "profile_picture" : profile_picture}))  # Envoie le message au client

    @database_sync_to_async
    def save_message(self, user, message, timestamp):  # Méthode pour sauvegarder un message dans la base de données
        try:
            conversation = Conversation.objects.get(is_general=True)  # Récupère la conversation générale
        except Conversation.DoesNotExist:
            conversation = Conversation()
            conversation.is_general = True
            conversation.save()
        new_message = Message(conversation=conversation, user=user, content=message, timestamp=timestamp)  # Crée un nouveau message
        new_message.save()  # Sauvegarde le message
        
    @database_sync_to_async
    def get_user_profile_picture(self, user):
        try:
            user = User.objects.get(username=user.username)
        except User.DoesNotExist:
            return None
        return user.avatar.url
    
    @database_sync_to_async
    def get_user(self, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        return user

class PFCConsumer(AsyncWebsocketConsumer): # Définit une nouvelle classe de consommateur WebSocket

    async def connect(self):  # Méthode appelée lorsqu'un client se connecte
        self.room_name = self.scope['url_route']['kwargs']['room_name']  # Récupère le nom de la salle à partir des paramètres de l'URL
        self.room_group_name = f'pfc_{self.room_name}'  # Utilise le nom de la salle comme nom du groupe
        await self.channel_layer.group_add(  # Ajoute le canal du client au groupe
            self.room_group_name, self.channel_name
        )
        await self.accept()  # Accepte la connexion WebSocket
        self.current_user = self.scope['user']
        self.players = self.room_name.split('_')
        self.player1 = self.players[0]
        self.player2 = self.players[1]
        self.game_id = None


    async def disconnect(self, code):  # Méthode appelée lorsqu'un client se déconnecte
        if self.game_id is not None and await self.check_if_game_is_finished() is None:
            print("🌿 Je passe dans le if game is not finished 🌿")
            await self.fill_has_leave(self.current_user.username)
        await self.clear_pfc_game_id()

        
        
        


    async def receive(self, text_data):  # Méthode appelée lorsqu'un message est reçu du client
        json_text = json.loads(text_data)

        command = None
        action = None
        player = None
        current_user = self.scope['user']

        if "command" in json_text:
            command = json_text["command"]
            print(f"🔱 command : {command}")

        if "action" in json_text:
            action = json_text["action"]
            print(f"🔱 action : {action}")

        if "player" in json_text:
            player = json_text["player"]
            print(f"🔱 player : {player}")
        print('\n')

        if (command is not None and player is not None) and (player in self.players) and (current_user.username == player) or (command == "have_played" and player is not None and action is not None and current_user.username == player):
            await self.commandHandler(command, action, player)
        else:
            print(f"❌ {current_user.username} tried to cheat ❌")
            return
        
        print(f'✅ game_id : {self.game_id}')
        print('\n')

    



    async def commandHandler(self, command, action, player):
        
        if command == "have_played":
            if self.game_id is not None and player == self.current_user.username:
                await self.add_action(player, action)
                if await self.attribute_point():
                    updated_game = await self.get_updated_game()
                    print(f"💬 SCORE --> {updated_game.player1_score} - {updated_game.player2_score}")
                    print(f"💬 PENALTIES --> {updated_game.player1_penalties} - {updated_game.player2_penalties}")
                    print(f"💬 ROUND --> {updated_game.round_count}")
                    print('\n')
                    winner = await self.check_if_game_is_finished()
                    if winner is not None:
                        await self.update_user_pfc_stats(winner)
                        await self.channel_layer.group_send(
                            self.room_group_name,
                            {
                                "type": "PFC_message",
                                'message': {
                                    'command': "game_finished",
                                    'winner': winner
                                }
                            }
                        )
                    else:
                        await self.channel_layer.group_send(
                            self.room_group_name,
                            {
                                "type": "PFC_message",
                                'message': {
                                    'command': "round_finished",
                                    'player1_score': updated_game.player1_score,
                                    'player2_score': updated_game.player2_score,
                                    'round_count': updated_game.round_count,
                                    'player1_penalties': updated_game.player1_penalties,
                                    'player2_penalties': updated_game.player2_penalties
                                }
                            }
                        )
            
        if command == "generate_game_id":
            if self.game_id is None and self.player1 == self.current_user.username:
                await self.generate_game_id()
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "PFC_message",
                        'message': {
                            'command': "game_id_generated",
                            'player_to_inform': self.player2,
                        }
                    }
                )
        
        if command == "get_game_id":
            if self.game_id is None and self.player2 == self.current_user.username:
                await self.get_game_id()
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "PFC_message",
                        'message': {
                            'command': "start_game",
                        }
                    }
                )

        if command == "stop_game":
            if self.game_id is not None and self.player1 == self.current_user.username or self.player2 == self.current_user.username:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "PFC_message",
                        'message': {
                            'command': "game_stopped",
                        }
                    }
                )

    async def PFC_message(self, event):
        # Extract the message from the event
        message = event['message']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


    @database_sync_to_async
    def generate_game_id(self):
        game_id_generated = random.randint(10000000000, 99999999999)
        game_id = PFC_Game_ID()
        game_id.game_id = game_id_generated
        game_id.room_id = self.room_name
        game_id.player1 = User.objects.get(username=self.player1)
        game_id.player2 = User.objects.get(username=self.player2)
        self.game_id = game_id_generated
        game_id.save()
        print(f"🔱 PFC_Game_ID() saved")
        
        game_history = GameHistory()
        game_history.game_id = game_id_generated
        game_history.player1 = User.objects.get(username=self.player1)
        game_history.player2 = User.objects.get(username=self.player2)
        game_history.save()
        print(f"🔱 GameHistory() saved")

    
    @database_sync_to_async
    def get_game_id(self):
        try:
            game_id_object = PFC_Game_ID.objects.get(room_id=self.room_name)
        except PFC_Game_ID.DoesNotExist:
            return None
        self.game_id = game_id_object.game_id


    @database_sync_to_async
    def add_action(self, player, action):
        game = GameHistory.objects.get(game_id=self.game_id)
        if player == self.player1:
            game.player1_moves.append(action)
        if player == self.player2:
            game.player2_moves.append(action)
        game.save()

    
    @database_sync_to_async
    def attribute_point(self):
        game = GameHistory.objects.get(game_id=self.game_id)
        if len(game.player1_moves) != len(game.player2_moves):
            return False
        else:
            p1 = game.player1_moves[-1]
            p2 = game.player2_moves[-1]

            if p1 == "rock" and p2 == "scissors":
                game.player1_score += 1
            if p1 == "rock" and p2 == "paper":
                game.player2_score += 1

            if p1 == "scissors" and p2 == "rock":
                game.player2_score += 1
            if p1 == "scissors" and p2 == "paper":
                game.player1_score += 1

            if p1 == "paper" and p2 == "rock":
                game.player1_score += 1
            if p1 == "paper" and p2 == "scissors":
                game.player2_score += 1
            
            if p1 == "timeout":
                game.player1_penalties += 1
            if p2 == "timeout":
                game.player2_penalties += 1
            
            game.round_count += 1
            game.save()
        return True

    @database_sync_to_async
    def check_if_game_is_finished(self):
        try:
            game = GameHistory.objects.get(game_id=self.game_id)
        except GameHistory.DoesNotExist:
            print("🔥 game not found 🔥")
            return None

        try:
            player1_instance = User.objects.get(username=self.player1)
        except User.DoesNotExist:
            print("🔥 player1_instance not found 🔥")
            return None
        try:
            player2_instance = User.objects.get(username=self.player2)
        except User.DoesNotExist:
            print("🔥 player2_instance not found 🔥")
            return None
        
        if game.p1_has_leave == True and game.p2_has_leave == False:
            print(f"🌿 Je fill bien le winner et le loser winner --> {game.winner} || loser --> {game.loser} || player1_instance --> {player1_instance} || player2_instance --> {player2_instance} || self.player1 --> {self.player1} || self.player2 --> {self.player2} 🌿")
            game.winner = player2_instance
            game.loser = player1_instance 
            game.save()
            return self.player2
        elif game.p2_has_leave == True and game.p1_has_leave == False:
            print(f"🌿 Je fill bien le winner et le loser winner --> {game.winner} || loser --> {game.loser} || player1_instance --> {player1_instance} || player2_instance --> {player2_instance} || self.player1 --> {self.player1} || self.player2 --> {self.player2} 🌿")
            game.winner = player1_instance
            game.loser = player2_instance
            game.save()
            return self.player1
        if game.player1_penalties == 3 and game.player2_penalties == 3:
            print(f"🌿 Je fill bien le winner et le loser winner --> {game.winner} || loser --> {game.loser} || player1_instance --> {player1_instance} || player2_instance --> {player2_instance} || self.player1 --> {self.player1} || self.player2 --> {self.player2} 🌿")
            return "null match"
        if game.player1_penalties == 3:
            print(f"🌿 Je fill bien le winner et le loser winner --> {game.winner} || loser --> {game.loser} || player1_instance --> {player1_instance} || player2_instance --> {player2_instance} || self.player1 --> {self.player1} || self.player2 --> {self.player2} 🌿")
            game.winner = player2_instance
            game.loser = player1_instance
            game.save()
            return self.player2
        if game.player2_penalties == 3:
            print(f"🌿 Je fill bien le winner et le loser winner --> {game.winner} || loser --> {game.loser} || player1_instance --> {player1_instance} || player2_instance --> {player2_instance} || self.player1 --> {self.player1} || self.player2 --> {self.player2} 🌿")
            game.winner = player1_instance
            game.loser = player2_instance
            game.save()
            return self.player1
        
        if game.player1_score == 7:
            print(f"🌿 Je fill bien le winner et le loser winner --> {game.winner} || loser --> {game.loser} || player1_instance --> {player1_instance} || player2_instance --> {player2_instance} || self.player1 --> {self.player1} || self.player2 --> {self.player2} 🌿")
            game.winner = player1_instance
            game.loser = player2_instance
            game.save()
            return self.player1
        if game.player2_score == 7:
            print(f"🌿 Je fill bien le winner et le loser winner --> {game.winner} || loser --> {game.loser} || player1_instance --> {player1_instance} || player2_instance --> {player2_instance} || self.player1 --> {self.player1} || self.player2 --> {self.player2} 🌿")
            game.winner = player2_instance
            game.loser = player1_instance
            game.save()
            return self.player2
        print(f"Je suis passe dans aucun if")
        return None

    @database_sync_to_async
    def get_updated_game(self):
        game = GameHistory.objects.get(game_id=self.game_id)
        return game
        
    @database_sync_to_async
    def update_user_pfc_stats(self, winner):
        game = GameHistory.objects.get(game_id=self.game_id)

        if winner == self.player1:
            winner = User.objects.get(username=winner)
            #! get or create renvoie 2 valeur, le premier est l'objet et le deuxième est un booléen qui indique si l'objet a été créé ou non
            #! Je fais , _ pour ne pas stocker le booléen car je n'en ai pas besoin
            winner_stats, _ = GameStats.objects.get_or_create(user=winner)
            winner_stats.total_spr_win += 1
            winner_stats.total_spr_win_tie += game.player1_score
            winner_stats.total_spr_los_tie += game.player2_score
            winner_stats.total_rock += game.player1_moves.count("rock")
            winner_stats.total_paper += game.player1_moves.count("paper")
            winner_stats.total_scissors += game.player1_moves.count("scissors")
            winner_stats.save()

            loser = User.objects.get(username=self.player2)
            loser_stats, _ = GameStats.objects.get_or_create(user=loser)
            loser_stats.total_rock += game.player2_moves.count("rock")
            loser_stats.total_paper += game.player2_moves.count("paper")
            loser_stats.total_scissors += game.player2_moves.count("scissors")
            loser_stats.total_spr_los += 1
            loser_stats.total_spr_win_tie += game.player2_score
            loser_stats.total_spr_los_tie += game.player1_score
            loser_stats.save()

        elif winner == self.player2:
            winner = User.objects.get(username=winner)
            winner_stats, _ = GameStats.objects.get_or_create(user=winner)
            winner_stats.total_spr_win += 1
            winner_stats.total_spr_win_tie += game.player2_score
            winner_stats.total_spr_los_tie += game.player1_score
            winner_stats.total_rock += game.player2_moves.count("rock")
            winner_stats.total_paper += game.player2_moves.count("paper")
            winner_stats.total_scissors += game.player2_moves.count("scissors")
            winner_stats.save()

            loser = User.objects.get(username=self.player1)
            loser_stats, _ = GameStats.objects.get_or_create(user=loser)
            loser_stats.total_rock += game.player1_moves.count("rock")
            loser_stats.total_paper += game.player1_moves.count("paper")
            loser_stats.total_scissors += game.player1_moves.count("scissors")
            loser_stats.total_spr_los += 1
            loser_stats.total_spr_win_tie += game.player1_score
            loser_stats.total_spr_los_tie += game.player2_score
            loser_stats.save()        

    @database_sync_to_async
    def add_penality_request(self, current_user):
        game = GameHistory.objects.get(game_id=self.game_id)

        if current_user.username == game.player1.username:
            if game.player2_penalties < 3 and game.player1_penalties < 3:
                game.player1_penalties += 1
        else:
            if game.player1_penalties < 3 and game.player2_penalties < 3:
                game.player2_penalties += 1
        game.save()
        
    
    @database_sync_to_async
    def fill_has_leave(self, current_user):
        game, has_create = GameHistory.objects.get_or_create(game_id=self.game_id)
        if has_create == True:
            game.player1 = User.objects.get(username=self.player1)
            game.player2 = User.objects.get(username=self.player2)
        if current_user == self.player1 and game.p2_has_leave == False:
            game.p1_has_leave = True
            game.winner = User.objects.get(username=self.player2)
            game.loser = User.objects.get(username=self.player1)
        elif current_user == self.player2 and game.p1_has_leave == False:
            game.p2_has_leave = True
            game.winner = User.objects.get(username=self.player1)
            game.loser = User.objects.get(username=self.player2)
        game.save()
    
    @database_sync_to_async
    def clear_pfc_game_id(self):
        try:
            game = GameHistory.objects.get(game_id=self.game_id)
        except GameHistory.DoesNotExist:
            return None
        if self.current_user.username == self.player1 and game.p2_has_leave == True:
            print(f"🔥 current_user --> {self.current_user.username} || self.player1 --> {self.player1} || self.player2 --> {self.player2} || game.p1_has_leave --> {game.p1_has_leave} || game.p2_has_leave --> {game.p2_has_leave}")
            try:
                stats, _ = GameStats.objects.get_or_create(user=self.current_user)
                stats.total_spr_win += 1
                stats.save()
            except GameStats.DoesNotExist:
                pass
        elif self.current_user.username == self.player2 and game.p1_has_leave == True:
            print(f"🔥 current_user --> {self.current_user.username} || self.player1 --> {self.player1} || self.player2 --> {self.player2} || game.p1_has_leave --> {game.p1_has_leave} || game.p2_has_leave --> {game.p2_has_leave}")
            try:
                stats, _ = GameStats.objects.get_or_create(user=self.current_user)
                stats.total_spr_win += 1
                stats.save()
            except GameStats.DoesNotExist:
                pass
        else:
            try:
                stats, _ = GameStats.objects.get_or_create(user=self.current_user)
                stats.total_spr_los += 1
                stats.save()
            except GameStats.DoesNotExist:
                pass
            
            
        try:
            game = PFC_Game_ID.objects.get(game_id=self.game_id)
            print(f"🔥 game ==> {game} 🔥")
            game.delete()
        except PFC_Game_ID.DoesNotExist:
            return None
                
class PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):  # Méthode appelée lorsqu'un §client se connecte
        self.room_name = 'pong_room'  # Définit le nom de la salle
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
        player1 = None
        player2 = None
        winner = None
        player1_score = None
        player2_score = None

        current_user = self.scope['user']

        if not current_user.is_authenticated:
            return
        
        current_user = current_user.username
        print(f"🌿 current_user --> {current_user}")

        if "command" in json_text:
            command = json_text["command"]
            print(f"🔱 command : {command}")
        
        if "player1" in json_text:
            player1 = json_text["player1"]
            print(f"🔱 player1 : {player1}")
        
        if "player2" in json_text:
            player2 = json_text["player2"]
            print(f"🔱 player2 : {player2}")
        
        if "winner" in json_text:
            winner = json_text["winner"]
            print(f"🔱 winner : {winner}")
        
        if "player1Score" in json_text:
            player1_score = json_text["player1Score"]
            print(f"🔱 player1_score : {player1_score}")
            
        if "player2Score" in json_text:
            player2_score = json_text["player2Score"]
            print(f"🔱 player2_score : {player2_score}")
            
        
        print('\n')
    
        if command is not None and player1 is not None and player2 is not None and winner is not None and player1_score is not None and player2_score is not None:
            await self.command_handler(command, current_user, player1, player2, winner, player1_score, player2_score)
        else:
            print(f"❌ {current_user} tried to cheat ❌ due to these parameters : {command} - {player1} - {player2} - {winner} - {player1_score} - {player2_score}")
        
    async def command_handler(self, command, current_user, player1, player2, winner, player1_score, player2_score):
        if command == 'pong_finished':
            await self.save_pong_game(player1, player2, winner, player1_score, player2_score, current_user)
            await self.update_pong_stats(player1, player2, winner, player1_score, player2_score)
                    
                    
    async def Pong_message(self, event):
        # Extract the message from the event
        message = event['message']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
                
                
                
                
    
    @database_sync_to_async
    def save_pong_game(self, player1, player2, winner, player1_score, player2_score, current_user):
        game = PongHistory()
        player1_instance = None
        player2_instance = None
        try:
            player1_instance = User.objects.get(username=player1)
        except User.DoesNotExist:
            print(f"🔥 player1 not found {player1}")
            try:
                player2_instance = User.objects.get(username=player2)
            except User.DoesNotExist:
                print(f"🔥 player2 not found {player2}")
                return None
        print(f"🔥 player1_instance --> {player1_instance} || player2_instance --> {player2_instance}")
        current_player = None
        other_player = None
        
        if player1_instance is not None and player1_instance.username == current_user:
            current_player = player1_instance
            other_player = player2

        elif player2_instance is not None and player2_instance.username == current_user:
            current_player = player2_instance
            other_player = player1

        if winner == True:
            print(f"✅ J'ai gagné")
        else:
            print(f"❌ J'ai perdu")
        game.player1 = current_player
        game.player2 = other_player
        game.player1_score = player1_score
        game.player2_score = player2_score
        game.winner = winner
        timestamp = datetime.now()  # Récupère le timestamp actuel
        formatted_timestamp = timestamp.strftime('%b. %d, %Y, %I:%M %p')  # Format the timestamp
        formatted_timestamp = formatted_timestamp.replace("AM", "a.m.").replace("PM", "p.m.")
        game.timestamp = formatted_timestamp
        game.save()
        
    @database_sync_to_async
    def update_pong_stats(self, player1, player2, winner, player1_score, player2_score):
        current_player = None
        try:
            current_player = User.objects.get(username=player1)
        except User.DoesNotExist:
            try:
                current_player = User.objects.get(username=player2)
            except User.DoesNotExist:
                return None 
        try:
            stats = GameStats.objects.get(user=current_player)
        except GameStats.DoesNotExist:
                stats = GameStats()
        stats.user = current_player
        print(f"🔥 winner --> {winner}")
        if winner == True:
            stats.total_pong_win += 1
        else:
            stats.total_pong_los += 1
        stats.total_pong_win_tie += player1_score
        stats.total_pong_los_tie += player2_score
        stats.save()
