# --- Étape 1 : Build de l'application ---
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build de l'application
RUN npm run build

# --- Étape 2 : Serveur Nginx ---
FROM nginx:alpine
# Suppression de la configuration par défaut de Nginx pour éviter les conflits
RUN rm /etc/nginx/conf.d/default.conf

# On copie votre configuration spécifique
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

# On copie les fichiers de build
COPY --from=build /app/dist /usr/share/nginx/html

# Exposition du port
EXPOSE 80

# Démarrage forcé de Nginx
CMD ["nginx", "-g", "daemon off;"]