# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build the application
RUN npx nx build app-shell --configuration=production

# Production image
FROM nginx:alpine
# In modern Angular, the build output is usually in dist/apps/app-shell/browser
COPY --from=build /app/dist/apps/app-shell/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
