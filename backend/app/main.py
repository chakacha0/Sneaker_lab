from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import products, brands, users
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# --- CORS НУЖНО СТАВИТЬ ПЕРВЫМ ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Роуты ---
app.include_router(products.router)
app.include_router(brands.router)
app.include_router(users.router)

# --- Статические файлы ---
app.mount("/static", StaticFiles(directory="static"), name="static")
