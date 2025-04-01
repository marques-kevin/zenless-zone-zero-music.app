FROM nginx:alpine

# Copy static files
COPY musics /usr/share/nginx/html/musics

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80 