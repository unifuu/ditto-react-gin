# Go
FROM golang:latest AS go_builder
ADD . /app
WORKDIR /app/server
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o /main .

# React
FROM node:alpine AS node_builder
COPY --from=go_builder /app/client ./
RUN npm install
RUN npm run build

# Production
FROM alpine:latest
RUN apk --no-cache add ca-certificates
ADD server/config ./config
ADD server/assets ./assets
COPY --from=go_builder /main ./
COPY --from=node_builder /build ../client/build
RUN chmod +x ./main
EXPOSE 8080
CMD ./main

#$ docker build -t ditto-react-gin .
#$ docker run -p 80:8080 -d ditto-react-gin
#$ docker-compose up -d --no-deps --build