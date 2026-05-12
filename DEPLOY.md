# SneakerLab Docker Deployment

## Services

- Frontend: http://localhost:3002
- Backend API: http://localhost:8002
- PostgreSQL: localhost:5434

## Quick Start

```bash
make build
make up
make logs
```

Stop the stack:

```bash
make down
```

Remove containers and volumes:

```bash
make clean
```

## Environment

The backend container reads `backend/.env` through `docker-compose.yml`.
Do not commit real API keys, SMTP passwords, or database credentials to git.

Required for the AI helper:

```env
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free
```

## Notes

The current backend database connection uses local constants in `backend/app/database.py`.
To avoid changing application code, Docker Compose runs the backend in the database service network namespace,
so `localhost:5432` from the backend container reaches PostgreSQL.

For a production deployment, the cleaner next step is to switch `backend/app/database.py` back to environment-based
settings and remove `network_mode: "service:db"`.
