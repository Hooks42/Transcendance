#!/bin/bash

#: "${WEBSOCKET_PORT:=8001}

# Wait for Postgres to be ready
while true; do
    if nc -z -w 2 $POSTGRES_HOST $POSTGRES_PORT; then
        echo "Postgres is up!"
        python manage.py makemigrations
        python manage.py migrate

        break
    else
        echo "Postgres isn't up...waiting..."
        sleep 2
    fi
done

echo "Starting backend"

export $(grep -v '^#' .env | xargs)

echo "
from django.contrib.auth import get_user_model;
User = get_user_model();
if not User.objects.filter(username='$SUPERUSER_NAME').exists():
    User.objects.create_superuser('$SUPERUSER_NAME', '$SUPERUSER_EMAIL', '$SUPERUSER_PASSWORD')
" | python manage.py shell

unset SUPERUSER_NAME
unset SUPERUSER_EMAIL
unset SUPERUSER_PASSWORD

# daphne -e ssl:443:privateKey=/etc/ssl/certs/localhost.crt:certKey=/etc/ssl/certs/localhost.key -b 0.0.0.0 -p 8001 Transcendance_Back.asgi:application & gunicorn Transcendance_Back.wsgi:application --bind 0.0.0.0:8000 --certfile "/etc/ssl/certs/localhost.crt" --keyfile "/etc/ssl/certs/localhost.key" --workers 4 --timeout 300
python manage.py runserver 0.0.0.0:8000