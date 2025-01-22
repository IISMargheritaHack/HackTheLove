FROM golang:1.23.4-alpine

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64 \
    GIN_MODE=release

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git \
    && apk add --no-cache make

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN make build

EXPOSE 8080

CMD ["/app/bin/main"]
