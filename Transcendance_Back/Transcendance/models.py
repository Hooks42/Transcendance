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


class Message(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.timestamp}'

#! Install Pillow to use ImageField
class User(AbstractUser):
    id_42 = models.IntegerField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', default='avatars/default_avatar.jpg', null=True, blank=True)
    is_online = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', blank=True)
    friend_request = ArrayField(models.CharField(max_length=200), blank=True, default=list)

    def is_friend(self, username):
        return self.friends.filter(username=username).exists()