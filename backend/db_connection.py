# backend/db.py
import psycopg2
from psycopg2.extras import RealDictCursor

def get_connection():
    return psycopg2.connect(
        host="localhost",
        user="postgres",
        password="postgre",
        database="shoeses_shop",
        cursor_factory=RealDictCursor,  # чтобы получать dict вместо tuple
    )
