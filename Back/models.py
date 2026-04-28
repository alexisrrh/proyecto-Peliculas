from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

db = SQLAlchemy()

# USER
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)

    favoritos: Mapped[List["Favorito"]] = relationship("Favorito", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email
        }


# PELICULA
class Pelicula(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    titulo: Mapped[str] = mapped_column(String(120), nullable=False)

    favoritos: Mapped[List["Favorito"]] = relationship("Favorito", back_populates="pelicula")

    def serialize(self):
        return {
            "id": self.id,
            "titulo": self.titulo
        }


# -------------------
# FAVORITOS
# -------------------
class Favorito(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    pelicula_id: Mapped[int] = mapped_column(ForeignKey("pelicula.id"))

    user: Mapped["User"] = relationship("User", back_populates="favoritos")
    pelicula: Mapped["Pelicula"] = relationship("Pelicula", back_populates="favoritos")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "pelicula": self.pelicula.serialize() if self.pelicula else None
        }