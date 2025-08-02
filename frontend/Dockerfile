# Stage 1: Build the React/Vite application
FROM node:18-alpine AS builder
WORKDIR /app

# --- ADD THIS SECTION ---
# Declare the build arguments passed from docker-compose.yml
ARG VITE_APP_WEDDING_DATE
ARG VITE_APP_VENUE_LAT
ARG VITE_APP_VENUE_LNG
ARG VITE_PARTNER1_ACCOUNT_NAME
ARG VITE_PARTNER1_ACCOUNT_NUMBER
ARG VITE_PARTNER2_ACCOUNT_NAME
ARG VITE_PARTNER2_ACCOUNT_NUMBER
ARG VITE_YOUTUBE_PLAYLIST_URL

# Set them as environment variables for the build process
ENV VITE_APP_WEDDING_DATE=$VITE_APP_WEDDING_DATE
ENV VITE_APP_VENUE_LAT=$VITE_APP_VENUE_LAT
ENV VITE_APP_VENUE_LNG=$VITE_APP_VENUE_LNG
ENV VITE_PARTNER1_ACCOUNT_NAME=$VITE_PARTNER1_ACCOUNT_NAME
ENV VITE_PARTNER1_ACCOUNT_NUMBER=$VITE_PARTNER1_ACCOUNT_NUMBER
ENV VITE_PARTNER2_ACCOUNT_NAME=$VITE_PARTNER2_ACCOUNT_NAME
ENV VITE_PARTNER2_ACCOUNT_NUMBER=$VITE_PARTNER2_ACCOUNT_NUMBER
ENV VITE_YOUTUBE_PLAYLIST_URL=$VITE_YOUTUBE_PLAYLIST_URL
# --- END OF ADDED SECTION ---

COPY package*.json ./
# Use 'npm ci' for faster, more reliable builds if you have package-lock.json
RUN npm ci
COPY . .

# Now, when 'npm run build' runs, Vite will have access to the VITE_* variables
RUN npm run build
RUN ls -l /app/dist # Good for debugging

# Stage 2: Serve the static files with NGINX
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]