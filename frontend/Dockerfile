FROM oven/bun:latest AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

FROM oven/bun:alpine

RUN apk add --no-cache nginx

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/bun.lock /app/bun.lock

RUN bun install --production

COPY nginx.conf /etc/nginx/nginx.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 4000

ENTRYPOINT ["/entrypoint.sh"]
