FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine

RUN npm install -g serve@14

WORKDIR /app
COPY --from=build /app/dist ./dist

EXPOSE 80

# SPA: -s = fallback to index.html; listen on all interfaces for docker publish :80
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:80"]
