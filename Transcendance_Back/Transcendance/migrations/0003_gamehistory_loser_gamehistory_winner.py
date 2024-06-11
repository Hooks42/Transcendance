# Generated by Django 4.2.10 on 2024-06-10 16:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Transcendance', '0002_gamehistory_p1_has_leave_gamehistory_p2_has_leave'),
    ]

    operations = [
        migrations.AddField(
            model_name='gamehistory',
            name='loser',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='loser', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='gamehistory',
            name='winner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='winner', to=settings.AUTH_USER_MODEL),
        ),
    ]