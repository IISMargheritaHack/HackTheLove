FROM oven/bun:latest AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .
RUN bun run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
