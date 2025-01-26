FROM golang:1.23.4-alpine AS build

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64 \
    GIN_MODE=release

WORKDIR /app

RUN apk add --no-cache git make ca-certificates

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN make build

FROM scratch

WORKDIR /app

COPY --from=build /app/bin/main /app/bin/main

COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 8080

CMD ["/app/bin/main"]
