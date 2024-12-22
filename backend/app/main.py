# Importation des modules nécessaires
from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from typing import Optional

# Initialisation de l'application FastAPI
app = FastAPI()

# Configuration du middleware CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration de la base de données
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Déclaration de la base pour les modèles
Base = declarative_base()

class Book(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    author = Column(String(100), nullable=False)
    year = Column(Integer)

Base.metadata.create_all(bind=engine)

# Route POST pour ajouter un livre
@app.post("/books/")
async def create_book(
    title: str = Form(...),
    author: str = Form(...),
    year: int = Form(...)
):
    try:
        db = SessionLocal()
        book = Book(title=title, author=author, year=year)
        db.add(book)
        db.commit()
        db.refresh(book)
        return book
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

# Route GET pour récupérer tous les livres
@app.get("/books/")
async def get_books():
    try:
        db = SessionLocal()
        books = db.query(Book).all()
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.put("/books/{book_id}")
async def update_book(
    book_id: int,
    title: str = Form(...),
    author: str = Form(...),
    year: int = Form(...)
):
    try:
        db = SessionLocal()
        book = db.query(Book).filter(Book.id == book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
            
        book.title = title
        book.author = author
        book.year = year
        
        db.commit()
        db.refresh(book)
        return book
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


# Route DELETE pour supprimer un livre
@app.delete("/books/{book_id}")
async def delete_book(book_id: int):
    try:
        db = SessionLocal()
        book = db.query(Book).filter(Book.id == book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        db.delete(book)
        db.commit()
        return {"message": "Book deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close() # Fermeture de la session