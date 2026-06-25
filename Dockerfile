# --- Étape 1 : Build de l'application ---
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# On définit l'argument pour l'URL de l'API
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build final
RUN npm run build

# --- Étape 2 : Serveur Nginx ---
FROM nginx:alpine
# On copie uniquement les fichiers générés dans le dossier 'dist'
COPY --from=build /app/dist /usr/share/nginx/html
# On copie notre configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Pas besoin de CMD, Nginx démarre tout seul !