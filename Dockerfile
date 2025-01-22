# Stage 1: Backend
FROM umitcansaran/shopping-land-backend:latest as backend

# Stage 2: Frontend
FROM umitcansaran/shopping-land-frontend:latest as frontend

# Stage 3: Nginx
FROM nginx:latest

# Copy the frontend build to Nginx's web directory
COPY --from=frontend /frontend/build /usr/share/nginx/html

# Add Nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Set environment variables for the backend (optional, but should match .env)
ENV BACKEND_API_URL=http://localhost:8000

# Expose the web port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
