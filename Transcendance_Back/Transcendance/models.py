from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.contrib.postgres.fields import HStoreField
from django.conf import settings

'''
#!----------------------------------------------------------------------------------------------------------------------------------------------------

    - models.ForeignKey--> C'est un champ de foreign key qui lie le message à l'utilisateur
        qui l'a envoyé.
        
    - on_delete=models.CASCADE indique que si l'utilisateur associé à un message est supprimé,
        tous les messages de cet utilisateur seront également supprimés.

    - TextField() --> Ce champ TextField contient le contenu du message.
        Il peut stocker une quantité importante de texte.

    - timestamp = models.DateTimeField(auto_now_add=True) --> Ce champ DateTimeField stocke 
        la date et l'heure auxquelles le message a été créé.
        Le paramètre auto_now_add=True indique à Django d'ajouter automatiquement
        la date et l'heure actuelles lorsqu'un nouveau message est créé.

#!----------------------------------------------------------------------------------------------------------------------------------------------------
'''

class Conversation(models.Model):
    is_general = models.BooleanField(default=False)
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True, related_name='user1')
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True, related_name='user2')


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE, default=None)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

#! Install Pillow to use ImageField
class User(AbstractUser):
    id_42 = models.IntegerField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default_avatar.jpg', null=True, blank=True)

    status = models.CharField(max_length=200, default='Hors Ligne')
    main_queue_player = models.BooleanField(default=False)

    friends = models.ManyToManyField('self', blank=True)
    friend_request = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    block_list = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    
    

    def is_friend(self, username):
        return self.friends.filter(username=username).exists()
    

class GameStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    total_pong_win = models.IntegerField(default=0)
    total_pong_los = models.IntegerField(default=0)
    total_pong_win_tie = models.IntegerField(default=0)
    total_pong_los_tie = models.IntegerField(default=0)

    total_scissors = models.IntegerField(default=0)
    total_paper = models.IntegerField(default=0)
    total_rock = models.IntegerField(default=0)
    total_spr_win = models.IntegerField(default=0)
    total_spr_los = models.IntegerField(default=0)
    total_spr_win_tie = models.IntegerField(default=0)
    total_spr_los_tie = models.IntegerField(default=0)
    
class PongHistory(models.Model):
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games_as_player1_pong')
    player2 = models.CharField(max_length=200, default='')
    winner = models.BooleanField(default=False)
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    @classmethod
    def get_games_for_user(cls, user):
        return cls.objects.filter(models.Q(player1=user) | models.Q(player2=user)).order_by('-timestamp')
    

class GameHistory(models.Model):
    game_id = models.BigIntegerField(default=0)
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games_as_player1')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games_as_player2')
    round_count = models.IntegerField(default=0)
    player1_moves = ArrayField(models.CharField(max_length=10), default=list)
    player2_moves = ArrayField(models.CharField(max_length=10), default=list)
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    player1_penalties = models.IntegerField(default=0)
    player2_penalties = models.IntegerField(default=0)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='winner', null=True, blank=True)
    loser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loser', null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    p1_has_leave = models.BooleanField(default=False)
    p2_has_leave = models.BooleanField(default=False)

    @classmethod
    def get_games_between(cls, player1, player2):
        return cls.objects.filter(
            models.Q(player1=player1, player2=player2) | models.Q(player1=player2, player2=player1)
            #! Q() permet de faire des requêtes complexes avec des opérateurs logiques (AND, OR, NOT) avec des requêtes sql
        )
    
    @classmethod
    def get_games_for_user(cls, user):
        return cls.objects.filter(models.Q(player1=user) | models.Q(player2=user)).order_by('-timestamp')
    
    def get_player1_username(self):
        return self.player1.username
    
    def get_player2_username(self):
        return self.player2_username
        


class PFC_Game_ID(models.Model):
    game_id = models.BigIntegerField(default=0)
    room_id = models.CharField(max_length=200, default='')
    player1 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='player1_PFC')
    player2 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='player2_PFC')
    

class Matchmaking_Queue(models.Model):
    user_in_queue = models.ManyToManyField(User)
    
    def add_user(self, user):
        self.user_in_queue.add(user)
        self.save()
        
    def remove_user(self, user):
        self.user_in_queue.remove(user)
        self.save()
