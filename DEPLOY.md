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

## Host Nginx and two domains on :80 / :443

`Frontend/shop/nginx.conf.example` is meant for **Nginx on the host** (not inside the frontend container): one process listens on ports **80** and **443**, and **SNI** selects the certificate by `Host`. SneakerLab is proxied to Docker’s host ports **3002** (UI) and **8002** (API); a second `server_name` block proxies to another upstream (example: `127.0.0.1:8080`). Replace `shop.example.com`, `other.example.com`, and the second app’s `proxy_pass` with your values.

Deploy the snippet:

```bash
sudo cp Frontend/shop/nginx.conf.example /etc/nginx/sites-available/sneakerlab-multi.conf
sudo ln -sf /etc/nginx/sites-available/sneakerlab-multi.conf /etc/nginx/sites-enabled/
# Adjust server_name, ssl paths, and second app proxy_pass inside the file first.
sudo nginx -t && sudo systemctl reload nginx
```

## Let’s Encrypt (Certbot) for SneakerLab’s domain

Prerequisites: DNS **A** (or **AAAA**) for `shop.example.com` points to the server; inbound **80** and **443** allowed; Nginx is installed and serves that name on port 80 (redirect to HTTPS is fine after certs exist; for the very first issuance the HTTP vhost must answer on port 80).

If `nginx -t` fails because `fullchain.pem` does not exist yet, start with a minimal HTTP-only `server` for `shop.example.com` on port 80, run Certbot below, then add the HTTPS blocks (or let `certbot --nginx` insert TLS directives and merge with this template).

Debian/Ubuntu:

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

**Certificate only for the shop (SneakerLab):**

```bash
sudo certbot --nginx -d shop.example.com
```

Certbot will obtain a cert and typically wire `ssl_certificate` paths under `/etc/letsencrypt/live/shop.example.com/`. Ensure the `server_name` and `ssl_certificate` / `ssl_certificate_key` / `ssl_trusted_certificate` lines in your vhost match that name (or edit paths after issuance).

**Optional: one certificate for both hostnames** (shop + second app), if both names point to this server:

```bash
sudo certbot --nginx -d shop.example.com -d other.example.com
```

Then set **the same** `ssl_certificate`, `ssl_certificate_key`, and `ssl_trusted_certificate` paths in **both** HTTPS `server` blocks (the live directory is usually named after the first `-d`).

**Dry-run renewal:**

```bash
sudo certbot renew --dry-run
```

Reload Nginx after renewals if your setup does not do it automatically (Certbot’s nginx plugin often reloads for you).

**Second app on a different machine:** obtain certs on that host instead; this file only applies when both apps terminate TLS on **this** Nginx.
