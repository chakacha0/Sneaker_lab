import psycopg2
from psycopg2.extras import RealDictCursor
from .config import settings
hostt = "localhost"
userr = "postgres"
passwordd = "postgre"
db_name = "shoeses_shop"

def get_connection():
    # print("DB_PASSWORD =", settings.DB_PASSWORD)  # DEBUG

    return psycopg2.connect(
        # host=settings.DB_HOST,
        host=hostt,
        port=settings.DB_PORT,
        # database=settings.DB_NAME,
        database = db_name,
        # user=settings.DB_USER,
        user = userr,
        # password=settings.DB_PASSWORD,
        password = passwordd,
        cursor_factory=RealDictCursor,
    )
