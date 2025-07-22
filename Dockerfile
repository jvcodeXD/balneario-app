# Etapa 1: Construcción del frontend
FROM node:20 AS frontend
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# Etapa 2: Backend
FROM node:20 AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .

# Etapa final: Nginx + Node + Supervisord
FROM nginx:stable-alpine

RUN apk add --no-cache nodejs npm supervisor

# Copiar frontend compilado
COPY --from=frontend /frontend/dist /usr/share/nginx/html

# Copiar backend
COPY --from=backend /app/backend /app/backend

# Copiar configuración nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Supervisord
COPY supervisord.conf /etc/supervisord.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /app/backend

EXPOSE 80
EXPOSE 4000
CMD ["/entrypoint.sh"]
