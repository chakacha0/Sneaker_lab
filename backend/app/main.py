from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import products, brands, users, cart, categories, favourites, admins, promo_codes, addresses, orders, reviews
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# --- CORS НУЖНО СТАВИТЬ ПЕРВЫМ ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# --- Роуты ---
app.include_router(products.router)
app.include_router(brands.router)
app.include_router(categories.router)
app.include_router(users.router)
app.include_router(cart.router)
app.include_router(favourites.router)
app.include_router(admins.router)
app.include_router(promo_codes.router)
app.include_router(addresses.router)
app.include_router(orders.router)
app.include_router(reviews.router)

# --- Статические файлы ---
# Получаем абсолютный путь к директории static относительно текущего файла
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Проверяем существование директории
if not os.path.exists(STATIC_DIR):
    print(f"WARNING: Static directory not found: {STATIC_DIR}")
else:
    print(f"Static files directory: {STATIC_DIR}")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
