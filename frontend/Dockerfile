FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

# Copiamo la build dal container di build alla directory di Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Esporre la porta 80, la porta di default per Nginx
EXPOSE 80

# Comando di avvio di Nginx
CMD ["nginx", "-g", "daemon off;"]
