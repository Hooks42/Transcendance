# Utiliser une image de base Nginx
FROM nginx

# Supprimer le fichier de configuration par défaut de Nginx
RUN rm /etc/nginx/nginx.conf

# Copier votre fichier de configuration personnalisé Nginx dans le conteneur
COPY nginx.conf /etc/nginx/nginx.conf

# Générer une clé privée lors de la construction de l'image
RUN openssl genrsa -out /usr/lib/ssl/cert.key 2048
# RUN openssl req -x509 -nodes -days 365 \
#     -newkey rsa:4096 -sha256 \
#     -out usr/lib/ssl/cert.key;

# Exposer le port 80 pour le serveur Nginx
EXPOSE 80

# Commande par défaut pour démarrer Nginx
# CMD ["nginx", "-g", "daemon off;"]
