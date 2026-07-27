import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import pooling

# Read the .env file and load its key-value pairs into the environment
# variables, so they can be accessed anywhere below using os.environ.
load_dotenv()

# Instead of opening a new MySQL connection on every request (slow and
# wasteful), we set up a pool of 5 pre-established connections here once,
# when the server starts. Requests borrow a connection, use it, and
# return it -- similar to a shared set of phone lines in an office.
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
    Hands out one available connection from the pool.

    Any route in main.py that needs to run a MySQL query calls this
    first. Once it's done, it should call conn.close() -- which doesn't
    actually destroy the connection, it just returns it to the pool so
    another request can reuse it.
    """
    return connection_pool.get_connection()