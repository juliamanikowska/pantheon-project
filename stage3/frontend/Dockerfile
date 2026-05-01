FROM nginx:alpine

WORKDIR /app

COPY frontend/ /usr/share/nginx/html

COPY stage3/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80