# Use Node.js to build the React app
FROM node:24-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build the React app
COPY . .
RUN npm run build

# Use Nginx to serve the built React app
FROM nginx:alpine

# Copy the built files to Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
