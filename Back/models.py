from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from sqlalchemy import String, Integer, ForeignKey, DateTime, Boolean
from datetime import datetime, timezone, timedelta

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    apellido: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    avatar: Mapped[str] = mapped_column(String(500), nullable=True, default="")

    favoritos: Mapped[List["Favorito"]] = relationship(
        "Favorito",
        back_populates="user"
    )

    arcade_scores: Mapped[List["ArcadeScore"]] = relationship(
        "ArcadeScore",
        back_populates="user"
    )


    def serialize(self):
        default_avatar = "https://i.pinimg.com/736x/c5/77/35/c577359e3223df4b3d92e785bf7464a8.jpg"

        if not self.avatar or self.avatar == "":
            img_final = default_avatar
        else:
            img_final = self.avatar

        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "email": self.email,
            "avatar": img_final
        }


# PELICULA
class Pelicula(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    tmdb_id: Mapped[int] = mapped_column(unique=True, nullable=False)
    titulo: Mapped[str] = mapped_column(String(120), nullable=False)
    overview: Mapped[str] = mapped_column(String(1000), nullable=True)
    poster_path: Mapped[str] = mapped_column(String(255), nullable=True)
    backdrop_path: Mapped[str] = mapped_column(String(255), nullable=True)
    release_date: Mapped[str] = mapped_column(String(50), nullable=True)
    vote_average: Mapped[float] = mapped_column(nullable=True)

    trailer_key: Mapped[str] = mapped_column(String(255), nullable=True)

    favoritos: Mapped[List["Favorito"]] = relationship(
        "Favorito",
        back_populates="pelicula"
    )

    def serialize(self):
        return {
            "id": self.id,
            "tmdb_id": self.tmdb_id,
            "titulo": self.titulo,
            "overview": self.overview,
            "poster_path": self.poster_path,
            "backdrop_path": self.backdrop_path,
            "release_date": self.release_date,
            "vote_average": self.vote_average,
            "trailer_key": self.trailer_key,
        }


# FAVORITOS
class Favorito(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    pelicula_id: Mapped[int] = mapped_column(ForeignKey("pelicula.id"))

    user: Mapped["User"] = relationship("User", back_populates="favoritos")
    pelicula: Mapped["Pelicula"] = relationship("Pelicula", back_populates="favoritos")

    def serialize(self):
        return {
            "favorito_id": self.id,
            "user_id": self.user_id,
            "id": self.pelicula.tmdb_id,
            "title": self.pelicula.titulo,
            "overview": self.pelicula.overview,
            "poster_path": self.pelicula.poster_path,
            "backdrop_path": self.pelicula.backdrop_path,
            "release_date": self.pelicula.release_date,
            "vote_average": self.pelicula.vote_average,
            "trailer_key": self.pelicula.trailer_key,
        }


#Arcade
class ArcadeScore(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    initials: Mapped[str] = mapped_column(String(3), nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="arcade_scores")

    def serialize(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "initials": self.initials,
            "score": self.score,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
    # PASSWORD RESET TOKEN
class PasswordResetToken(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    token: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"),
        nullable=False
    )

    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    used: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship("User")