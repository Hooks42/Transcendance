FROM nginx

RUN apt-get update && \
    apt-get install -y netcat-traditional dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/localhost.key -out /etc/nginx/ssl/localhost.crt -subj "/C=AT/ST=W/L=W/O=42/OU=42k/CN=trans/UID=trans"

RUN rm /etc/nginx/nginx.conf

COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

