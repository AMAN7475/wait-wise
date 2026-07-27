import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import pooling

# Load variables from the .env file into the environment,
# so os.environ.get(...) below can find them.
load_dotenv()

# A connection pool: a small set of ready-to-use MySQL connections,
# opened once when the server starts, and reused across requests
# instead of opening a brand-new connection every single time.
connection_pool = pooling.MySQLConnectionPool(
    pool_name="waitwise_pool",
    pool_size=5,
    host=os.environ.get("DB_HOST"),
    user=os.environ.get("DB_USER"),
    password=os.environ.get("DB_PASSWORD"),
    database=os.environ.get("DB_NAME")
)


def get_connection():
    """
    Borrow one connection from the pool.
    Every function that needs to talk to MySQL will call this,
    use it, and then close it (which actually just returns it
    to the pool, ready for reuse).
    """
    return connection_pool.get_connection()