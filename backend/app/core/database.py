from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.app.core.settings import Settings

# Buat engine SQLAlchemy menggunakan URL dari settings
# Tidak ada fallback ke SQLite di sini.
settings = Settings()
engine = create_engine(settings.DATABASE_URL)

# Buat SessionLocal class untuk sesi database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Buat Base class untuk model-model deklaratif kita
Base = declarative_base()

# Dependency untuk mendapatkan sesi database di setiap request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()