# Generated by Django 4.2.10 on 2024-05-23 10:02

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('Transcendance', '0018_ponghistory'),
    ]

    operations = [
        migrations.AddField(
            model_name='ponghistory',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
