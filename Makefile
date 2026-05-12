COMPOSE ?= docker compose

.PHONY: help build up down restart logs ps shell-backend shell-db migrate clean

help:
	@echo "SneakerLab deployment commands"
	@echo "  make build          Build Docker images"
	@echo "  make up             Start the stack"
	@echo "  make down           Stop the stack"
	@echo "  make restart        Restart the stack"
	@echo "  make logs           Follow all logs"
	@echo "  make ps             Show container status"
	@echo "  make shell-backend  Open a shell in the backend container"
	@echo "  make shell-db       Open psql in the database container"
	@echo "  make migrate        Apply SQL migrations"
	@echo "  make clean          Stop stack and remove volumes"

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) down
	$(COMPOSE) up -d --build

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

shell-backend:
	$(COMPOSE) exec backend sh

shell-db:
	$(COMPOSE) exec db psql -U postgres -d shoeses_shop -p 5434

migrate:
	$(COMPOSE) exec -T db psql -U postgres -d shoeses_shop -p 5434 < backend/migration_add_order_status.sql

clean:
	$(COMPOSE) down -v
