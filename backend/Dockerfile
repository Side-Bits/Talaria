# Use an official Golang runtime as a parent image
FROM golang:1.25.3-alpine
RUN apk add --no-cache git make musl-dev go

# Install air for hot-reloading
RUN go install github.com/air-verse/air@latest

# Instrall swagger for docs
RUN go install github.com/swaggo/swag/cmd/swag@latest

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the rest of the application code to the container
COPY . .

# Generate Swag docs
RUN /go/bin/swag init -g cmd/main.go -o docs/

# Expose port 8080
EXPOSE 8080
# Start the application with air for live reloading
CMD ["air"]
