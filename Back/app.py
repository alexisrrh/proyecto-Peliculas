import os
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy import select, desc
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

import requests
import secrets
from models import db, User, Pelicula, Favorito, ArcadeScore, PasswordResetToken, Comentario
from datetime import datetime, timezone, timedelta
load_dotenv()

app = Flask(__name__)

db_url = os.getenv("SQLALCHEMY_DATABASE_URI")
if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")


db.init_app(app)
MIGRATE = Migrate(app, db)
CORS(
    app,
    resources={r"/*": {"origins": [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://vhsflix.vercel.app"
    ]}},
    supports_credentials=False,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

admin = Admin(app, name="Peliculas DB")
admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Pelicula, db.session))
admin.add_view(ModelView(Favorito, db.session))
admin.add_view(ModelView(ArcadeScore, db.session)) 


@app.route("/")
def home():
    return jsonify({"msg": "API funcionando"}), 200

@app.route("/movies/<int:tmdb_id>/comments", methods=["GET"])
def get_movie_comments(tmdb_id):
    comentarios = db.session.execute(
        select(Comentario)
        .where(Comentario.tmdb_id == tmdb_id)
        .order_by(desc(Comentario.created_at))
    ).scalars().all()

    return jsonify({
        "msg": "ok",
        "comments": [comentario.serialize() for comentario in comentarios]
    }), 200


@app.route("/movies/<int:tmdb_id>/comments", methods=["POST"])
@jwt_required()
def create_movie_comment(tmdb_id):
    email = get_jwt_identity()

    user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    body = request.get_json()
    texto = body.get("texto")

    if not texto or not texto.strip():
        return jsonify({"msg": "El comentario no puede estar vacío"}), 400

    nuevo_comentario = Comentario(
        user_id=user.id,
        tmdb_id=tmdb_id,
        texto=texto.strip()
    )

    db.session.add(nuevo_comentario)
    db.session.commit()

    return jsonify({
        "msg": "Comentario creado",
        "comment": nuevo_comentario.serialize()
    }), 201

@app.route("/youtube/comments/<video_id>", methods=["GET"])
def get_youtube_comments(video_id):
    api_key = os.getenv("YOUTUBE_API_KEY")

    if not api_key:
        return jsonify({"msg": "Falta YOUTUBE_API_KEY"}), 500

    url = "https://www.googleapis.com/youtube/v3/commentThreads"

    params = {
        "part": "snippet",
        "videoId": video_id,
        "maxResults": 10,
        "order": "relevance",
        "textFormat": "plainText",
        "key": api_key
    }

    response = requests.get(url, params=params)

    data = response.json()

    if response.status_code != 200:
        return jsonify({
            "msg": "No se pudieron cargar los comentarios",
            "error": data
        }), response.status_code

    comments = []

    for item in data.get("items", []):
        comment = item["snippet"]["topLevelComment"]["snippet"]

        comments.append({
            "author": comment.get("authorDisplayName"),
            "avatar": comment.get("authorProfileImageUrl"),
            "text": comment.get("textDisplay"),
            "likes": comment.get("likeCount"),
            "publishedAt": comment.get("publishedAt")
        })

    return jsonify({
        "msg": "ok",
        "comments": comments
    }), 200


@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    body = request.get_json()
    email = body.get("email")

    if not email:
        return jsonify({"msg": "Email requerido"}), 400

    user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if not user:
        return jsonify({
            "msg": "Si el correo existe, enviaremos instrucciones"
        }), 200

    token = secrets.token_urlsafe(32)

    reset_token = PasswordResetToken(
        token=token,
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=30),
        used=False
    )

    db.session.add(reset_token)
    db.session.commit()

    reset_link = f"https://vhsflix.vercel.app/reset-password/{token}"

    email_data = {
        "from": "VHSFLIX <onboarding@resend.dev>",
        "to": [email],
        "subject": "Recuperar clave VHSFLIX",
        "text": f"""
Hola {user.nombre},

Haz clic en este enlace para recuperar tu clave:

{reset_link}

Este enlace caduca en 30 minutos.

Si no solicitaste esto, ignora este correo.
"""
    }

    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {os.getenv('RESEND_API_KEY')}",
                "Content-Type": "application/json"
            },
            json=email_data
        )

        if response.status_code >= 400:
            return jsonify({
                "msg": "No se pudo enviar el correo",
                "error": response.text
            }), 500

    except Exception as e:
        return jsonify({
            "msg": "Error enviando correo",
            "error": str(e)
        }), 500

    return jsonify({
        "msg": "Correo de recuperación enviado"
    }), 200


@app.route('/user', methods=['GET'])
def get_user():
    all_users = db.session.execute(select(User)).scalars().all()
    result = list(map(lambda item: item.serialize(), all_users))
    if not result:
        return jsonify({"msg": "No se encontraron usuarios"}), 404
    return jsonify({"msg": "ok", "result": result}), 200

@app.route('/peliculas', methods=['GET'])
def get_peliculas():
    all_peliculas = db.session.execute(select(Pelicula)).scalars().all()
    result = list(map(lambda item: item.serialize(), all_peliculas))
    if not result:
        return jsonify({"msg": "No se encontraron peliculas"}), 404
    return jsonify({"msg": "ok", "result": result}), 200

@app.route('/user/<int:user_id>', methods=['GET'])
def handle_user(user_id):
    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    return jsonify({"msg": "ok", "result": user.serialize()}), 200

@app.route('/peliculas/<int:pelicula_id>', methods=['GET'])
def handle_pelicula(pelicula_id):
    pelicula = db.session.get(Pelicula, pelicula_id)
    if pelicula is None:
        return jsonify({"msg": "Pelicula no encontrada"}), 404
    return jsonify({"msg": "ok", "result": pelicula.serialize()}), 200

@app.route("/peliculas", methods=["POST"])
def create_pelicula():
    body = request.get_json()
    tmdb_id = body.get("tmdb_id")
    titulo = body.get("titulo")
    overview = body.get("overview")
    poster_path = body.get("poster_path")

    if not tmdb_id or not titulo:
        return jsonify({"msg": "tmdb_id y titulo son requeridos"}), 400

    pelicula_existente = db.session.execute(
        select(Pelicula).where(Pelicula.tmdb_id == tmdb_id)
    ).scalar_one_or_none()

    if pelicula_existente:
        return jsonify({"msg": "Película ya existe", "pelicula": pelicula_existente.serialize()}), 200

    nueva_pelicula = Pelicula(
        tmdb_id=tmdb_id,
        titulo=titulo,
        overview=overview,
        poster_path=poster_path,
        backdrop_path=body.get("backdrop_path"),
        release_date=body.get("release_date"),
        vote_average=body.get("vote_average"),
        trailer_key=body.get("trailer_key")
    )

    db.session.add(nueva_pelicula)
    db.session.commit()

    return jsonify({"msg": "Película creada", "pelicula": nueva_pelicula.serialize()}), 201

@app.route("/reset-password", methods=["POST"])
def reset_password():
    body = request.get_json()

    token = body.get("token")
    password = body.get("password")

    if not token or not password:
        return jsonify({"msg": "Token y contraseña requeridos"}), 400

    if len(password) < 6:
        return jsonify({"msg": "La contraseña debe tener mínimo 6 caracteres"}), 400

    reset_token = db.session.execute(
        select(PasswordResetToken).where(
            PasswordResetToken.token == token
        )
    ).scalar_one_or_none()

    if not reset_token:
        return jsonify({"msg": "Token inválido"}), 400

    if reset_token.used:
        return jsonify({"msg": "Este enlace ya fue usado"}), 400

    now = datetime.now(timezone.utc)

    expires_at = reset_token.expires_at

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < now:
        return jsonify({"msg": "El enlace ha caducado"}), 400

    user = db.session.get(User, reset_token.user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    user.password = hashed_password

    reset_token.used = True

    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada correctamente"}), 200

@app.route('/users/<int:user_id>/favoritos', methods=['POST'])
def create_user_favorito(user_id):
    body = request.get_json()
    if not body:
        return jsonify({"msg": "Missing body"}), 400

    tmdb_id = body.get("tmdb_id")
    titulo = body.get("titulo")

    if not tmdb_id or not titulo:
        return jsonify({"msg": "Se requiere tmdb_id y titulo"}), 400

    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    pelicula = db.session.execute(select(Pelicula).where(Pelicula.tmdb_id == tmdb_id)).scalar_one_or_none()

    if not pelicula:
        pelicula = Pelicula(
            tmdb_id=tmdb_id,
            titulo=titulo,
            overview=body.get("overview"),
            poster_path=body.get("poster_path"),
            backdrop_path=body.get("backdrop_path"),
            release_date=body.get("release_date"),
            vote_average=body.get("vote_average"),
            trailer_key=body.get("trailer_key")
        )
        db.session.add(pelicula)
        db.session.commit()

    favorito_existente = db.session.execute(
        select(Favorito).where(Favorito.user_id == user_id, Favorito.pelicula_id == pelicula.id)
    ).scalar_one_or_none()

    if favorito_existente:
        return jsonify({"msg": "Esta película ya está en favoritos"}), 400

    nuevo_favorito = Favorito(user_id=user_id, pelicula_id=pelicula.id)
    db.session.add(nuevo_favorito)
    db.session.commit()

    return jsonify({"msg": "Favorito creado", "favorito": nuevo_favorito.serialize()}), 201

@app.route("/login", methods=["POST"])
def login():
    body = request.get_json()
    if not body:
        return jsonify({"msg": "Missing body"}), 400

    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "se requieren email y contraseña"}), 400

    user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "email o contraseña incorrectos"}), 401

    access_token = create_access_token(identity=email)

    return jsonify({
        "msg": "login exitoso",
        "access_token": access_token,
        "user": user.serialize()
    }), 200

@app.route("/private", methods=["GET"])
@jwt_required()
def private():
    email = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
        
    return jsonify(user.serialize()), 200

@app.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    if not body:
        return jsonify({"msg": "Missing body"}), 400

    nombre = body.get("nombre")
    apellido = body.get("apellido")
    email = body.get("email")
    password = body.get("password")

    if not nombre or not apellido or not email or not password:
        return jsonify({"msg": "se requieren nombre, apellido, email y contraseña"}), 400

    existing_user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if existing_user:
        return jsonify({"msg": "Usuario ya existe"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        nombre=nombre,
        apellido=apellido,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "usuario creado"}), 201

@app.route('/users/<int:user_id>/favoritos', methods=['GET'])
def get_user_favoritos(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    favoritos = [f.serialize() for f in user.favoritos]
    return jsonify({"msg": "ok", "result": favoritos}), 200

@app.route('/favorite/<int:favorito_id>', methods=['DELETE'])
def delete_favorite(favorito_id):
    favorito = db.session.get(Favorito, favorito_id)
    if not favorito:
        return jsonify({"msg": "Favorito not found"}), 404

    db.session.delete(favorito)
    db.session.commit()
    return jsonify({"msg": "Favorito eliminado"}), 200

@app.route("/update-avatar", methods=["PUT"])
@jwt_required()
def update_avatar():
    try:
        email = get_jwt_identity()
        user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        data = request.get_json()
        nueva_url = data.get("avatar")

        if not nueva_url:
            return jsonify({"msg": "Falta la URL del avatar"}), 400

        user.avatar = nueva_url
        db.session.commit()
        return jsonify({"msg": "Avatar actualizado", "avatar": user.avatar}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error interno", "error": str(e)}), 500

# ENDPOINTS ARCADE SCORES (RELAX MODE)

@app.route("/scores", methods=["GET"])
def get_scores():
    try:
        stmt = select(ArcadeScore).order_by(desc(ArcadeScore.score)).limit(10)
        top_scores = db.session.execute(stmt).scalars().all()
        return jsonify([score.serialize() for score in top_scores]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/scores", methods=["POST"])
@jwt_required()
def save_score():
    try:
        email = get_jwt_identity()
        user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        body = request.get_json()
        initials = body.get("initials")
        score = body.get("score")

        if not initials or score is None:
            return jsonify({"msg": "Las iniciales y la puntuacion son requeridas"}), 400

        new_score = ArcadeScore(
            usuario_id=user.id,
            initials=initials.upper()[:3],
            score=int(score)
        )
        
        db.session.add(new_score)
        db.session.commit()

        return jsonify({"msg": "Puntuacion guardada", "score": new_score.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)