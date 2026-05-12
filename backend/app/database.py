import psycopg2
from psycopg2.extras import RealDictCursor
from .config import settings

hostt = "localhost"
userr = "postgres"
passwordd = "postgre"
db_name = "shoeses_shop"


def get_connection():
    return psycopg2.connect(
        host=settings.DB_HOST or hostt,
        port=settings.DB_PORT or 5434,
        database=settings.DB_NAME or db_name,
        user=settings.DB_USER or userr,
        password=settings.DB_PASSWORD or passwordd,
        cursor_factory=RealDictCursor,
    )
