from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import products, brands, users
from fastapi.staticfiles import StaticFiles


app = FastAPI()

app.include_router(products.router)
app.include_router(brands.router)
# app.include_router(users.router)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Пока можно так
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# # Разрешаем React обращаться к API
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # позже укажешь точный домен
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/api")
# def read_root():
#     return {"message": "Backend работает!"}
