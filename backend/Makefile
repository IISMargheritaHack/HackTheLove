RESET := \033[0m
BOLD := \033[1m
GREEN := \033[32m
YELLOW := \033[33m
BLUE := \033[34m
RED := \033[31m

all: build test

build:
	@echo -e "\n${BOLD}${BLUE}🔨 Building the application...${RESET}"
	@go build -o ./bin/main cmd/api/main.go
	@echo -e -e "${GREEN}✅ Build completed successfully!${RESET}\n"

# Run the application
run:
	@echo -e "\n${BOLD}${YELLOW}🚀 Running the application...${RESET}"
	@go run cmd/api/main.go

# Create DB container
docker-run:
	@echo -e "\n${BOLD}${BLUE}🐳 Starting Docker containers...${RESET}"
	@if docker compose up --build 2>/dev/null; then \
		: ; \
	else \
		echo "${RED}⚠️  Falling back to Docker Compose V1...${RESET}"; \
		docker-compose up --build; \
	fi

# Shutdown DB container
docker-down:
	@echo -e "\n${BOLD}${YELLOW}📦 Stopping Docker containers...${RESET}"
	@if docker compose down 2>/dev/null; then \
		: ; \
	else \
		echo "${RED}⚠️  Falling back to Docker Compose V1...${RESET}"; \
		docker-compose down; \
	fi

# Test the application
test:
	@echo -e "\n${BOLD}${BLUE}🧪 Running tests...${RESET}"
	@go test ./... -v
	@echo -e "${GREEN}✅ All tests completed!${RESET}\n"

# Integration Tests for the application
itest:
	@echo -e "\n${BOLD}${BLUE}🔍 Running integration tests...${RESET}"
	@go test ./internal/database -v
	@echo -e "${GREEN}✅ Integration tests completed!${RESET}\n"

# Clean the binary
clean:
	@echo -e "\n${BOLD}${YELLOW}🧹 Cleaning up...${RESET}"
	@rm -f ./bin/main
	@echo -e "${GREEN}✅ Cleanup complete!${RESET}\n"

# Live Reload
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

help:
	@echo -e "\n${BOLD}${YELLOW}📖 Usage: make [target]${RESET}"
	@echo -e "\nTargets:"
	@echo -e "  ${BLUE}🔨 build       ${RESET}Build the application"
	@echo -e "  ${YELLOW}🚀 run         ${RESET}Run the application"
	@echo -e "  ${BLUE}🧪 test        ${RESET}Test the application"
	@echo -e "  ${YELLOW}🧹 clean       ${RESET}Clean the binary"
	@echo -e "  ${BLUE}👀 watch       ${RESET}Live reload"
	@echo -e "  ${YELLOW}🐳 docker-run  ${RESET}Create DB container"
	@echo -e "  ${BLUE}📦 docker-down ${RESET}Shutdown DB container"
	@echo -e "  ${YELLOW}🔍 itest       ${RESET}Run integration tests"
	@echo -e "  ${BLUE}📖 help        ${RESET}Display this help message"

.PHONY: all build run test clean watch docker-run docker-down itest
