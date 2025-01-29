RESET := \033[0m
BOLD := \033[1m
GREEN := \033[32m
YELLOW := \033[33m
BLUE := \033[34m
RED := \033[31m

all: build test

# Build per ambiente di sviluppo
build:
	@echo -e "\n${BOLD}${BLUE}🔨 Building the application...${RESET}"
	@mkdir -p bin
	@go build -o ./bin/main cmd/api/main.go
	@echo -e "${GREEN}✅ Build completed successfully!${RESET}\n"

# Build per la produzione (binario ottimizzato)
production:
	@echo -e "\n${BOLD}${BLUE}🚀 Building for production...${RESET}"
	@mkdir -p bin
	@GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o ./bin/main cmd/api/main.go
	@echo -e "${GREEN}✅ Production build completed successfully!${RESET}\n"

# Run the application
run:
	@echo -e "\n${BOLD}${YELLOW}🚀 Running the application...${RESET}"
	@go run cmd/api/main.go

# Test the application
test:
	@echo -e "\n${BOLD}${BLUE}🧪 Running tests...${RESET}"
	@go test ./... -v
	@echo -e "${GREEN}✅ All tests completed!${RESET}\n"

# Integration Tests
itest:
	@echo -e "\n${BOLD}${BLUE}🔍 Running integration tests...${RESET}"
	@go test ./internal/database -v
	@echo -e "${GREEN}✅ Integration tests completed!${RESET}\n"

# Clean the binary
clean:
	@echo -e "\n${BOLD}${YELLOW}🧹 Cleaning up...${RESET}"
	@rm -rf ./bin/
	@echo -e "${GREEN}✅ Cleanup complete!${RESET}\n"

# Live Reload (dev mode)
watch:
	@echo -e "\n${BOLD}${BLUE}👀 Starting live reload...${RESET}"
	@if command -v air > /dev/null; then \
		air; \
	else \
		read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
		if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
			echo "${YELLOW}Installing 'air'...${RESET}"; \
			go install github.com/air-verse/air@latest; \
			echo "${GREEN}✅ 'air' installed successfully!${RESET}"; \
			air; \
		else \
			echo "${RED}❌ You chose not to install 'air'. Exiting...${RESET}"; \
			exit 1; \
		fi; \
	fi

# Docker commands
# docker-build:
# 	@echo -e "\n${BOLD}${BLUE}🐳 Building Docker image...${RESET}"
# 	@docker build -t hackthelove-backend .
# 	@echo -e "${GREEN}✅ Docker image built successfully!${RESET}\n"

# docker-run:
# 	@echo -e "\n${BOLD}${BLUE}🐳 Starting Docker containers...${RESET}"
# 	@if docker compose up --build 2>/dev/null; then \
# 		: ; \
# 	else \
# 		echo "${RED}⚠️  Falling back to Docker Compose V1...${RESET}"; \
# 		docker-compose up --build; \
# 	fi

# docker-down:
# 	@echo -e "\n${BOLD}${YELLOW}📦 Stopping Docker containers...${RESET}"
# 	@if docker compose down 2>/dev/null; then \
# 		: ; \
# 	else \
# 		echo "${RED}⚠️  Falling back to Docker Compose V1...${RESET}"; \
# 		docker-compose down; \
# 	fi

# docker-push:
# 	@echo -e "\n${BOLD}${BLUE}📤 Pushing Docker image to registry...${RESET}"
# 	@docker tag hackthelove-backend your-registry/hackthelove-backend:latest
# 	@docker push your-registry/hackthelove-backend:latest
# 	@echo -e "${GREEN}✅ Docker image pushed successfully!${RESET}\n"

# Deployment command
# deploy:
# 	@echo -e "\n${BOLD}${BLUE}🚀 Deploying to production...${RESET}"
# 	@ssh user@yourserver "cd /path/to/app && git pull && docker compose up --build -d"
# 	@echo -e "${GREEN}✅ Deployment completed successfully!${RESET}\n"

help:
	@echo -e "\n${BOLD}${YELLOW}📖 Usage: make [target]${RESET}"
	@echo -e "\nTargets:"
	@echo -e "  ${BLUE}🔨 build         ${RESET}Build the application"
	@echo -e "  ${YELLOW}🚀 production    ${RESET}Build for production"
	@echo -e "  ${BLUE}🧪 test          ${RESET}Run tests"
	@echo -e "  ${YELLOW}🧹 clean         ${RESET}Clean the binary"
	@echo -e "  ${BLUE}👀 watch         ${RESET}Live reload"
	@echo -e "  ${YELLOW}🐳 docker-build  ${RESET}Build Docker image"
	@echo -e "  ${BLUE}📦 docker-run    ${RESET}Start Docker containers"
	@echo -e "  ${YELLOW}📦 docker-down   ${RESET}Stop Docker containers"
	@echo -e "  ${BLUE}📤 docker-push   ${RESET}Push Docker image"
	@echo -e "  ${YELLOW}🚀 deploy        ${RESET}Deploy to production"
	@echo -e "  ${BLUE}📖 help          ${RESET}Display this help message"

.PHONY: all build production run test clean watch docker-build docker-run docker-down docker-push deploy
