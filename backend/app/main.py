from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import products, brands, users, cart, categories, favourites, admins, promo_codes, addresses, orders, reviews
from app.repositories.orders_repo import ensure_orders_status_column
from fastapi.staticfiles import StaticFiles
import os

API_PREFIX = "/api"
app = FastAPI()


@app.on_event("startup")
def _bootstrap_orders_status_column():
    try:
        ensure_orders_status_column()
    except Exception as e:
        print(f"[orders] Could not ensure orders.status column: {e}")

# --- CORS НУЖНО СТАВИТЬ ПЕРВЫМ ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# --- Роуты ---
api_router = APIRouter(prefix=API_PREFIX)
for router in (
    products.router,
    brands.router,
    categories.router,
    users.router,
    cart.router,
    favourites.router,
    admins.router,
    promo_codes.router,
    addresses.router,
    orders.router,
    reviews.router,
):
    api_router.include_router(router)

app.include_router(api_router)

# --- Статические файлы ---
# Получаем абсолютный путь к директории static относительно текущего файла
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# StaticFiles падает, если каталога нет; в образе static может не попасть из git
os.makedirs(STATIC_DIR, exist_ok=True)
print(f"Static files directory: {STATIC_DIR}")

app.mount(f"{API_PREFIX}/static", StaticFiles(directory=STATIC_DIR), name="static")
