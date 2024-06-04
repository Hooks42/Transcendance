# Generated by Django 4.2.10 on 2024-05-23 09:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Transcendance', '0017_pfc_game_id_player1_pfc_game_id_player2'),
    ]

    operations = [
        migrations.CreateModel(
            name='PongHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player1_score', models.IntegerField(default=0)),
                ('player2_score', models.IntegerField(default=0)),
                ('player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='games_as_player1_pong', to=settings.AUTH_USER_MODEL)),
                ('player2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='games_as_player2_pong', to=settings.AUTH_USER_MODEL)),
                ('winner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='games_as_winner_pong', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]