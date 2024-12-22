
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/library")
