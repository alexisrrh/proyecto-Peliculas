import os
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy import select
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

from models import db, User, Pelicula, Favorito


load_dotenv()

app = Flask(__name__)

# Configuraciones de la App
db_url = os.getenv("SQLALCHEMY_DATABASE_URI")

if db_url and db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
# Inicialización de extensiones
db.init_app(app)
MIGRATE = Migrate(app, db)
CORS(app, resources={r"/*": {"origins": "*"}})

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Panel de Administración
admin = Admin(app, name="Peliculas DB")
admin.add_view(ModelView(User, db))
admin.add_view(ModelView(Pelicula, db))
admin.add_view(ModelView(Favorito, db))


@app.route("/")
def home():
    return jsonify({
        "msg": "API funcionando"
    }), 200


# Endpoint para pedir informacion de todos los usuarios
@app.route('/user', methods=['GET'])
def get_user():
    all_users = db.session.execute(select(User)).scalars().all()
    result = list(map(lambda item: item.serialize(), all_users))
    if not result:
        return jsonify({"msg": "No se encontraron usuarios"}), 404

    response_body = {
        "msg": "ok",
        "result": result
    }
    return jsonify(response_body), 200


# Endpoint para pedir informacion de todas las peliculas
@app.route('/peliculas', methods=['GET'])
def get_peliculas():
    all_peliculas = db.session.execute(select(Pelicula)).scalars().all()
    result = list(map(lambda item: item.serialize(), all_peliculas))
    if not result:
        return jsonify({"msg": "No se encontraron peliculas"}), 404

    response_body = {
        "msg": "ok",
        "result": result
    }
    return jsonify(response_body), 200




# Endpoint para pedir informacion de un usuario por su id
@app.route('/user/<int:user_id>', methods=['GET'])
def handle_user(user_id):
    user = db.session.get(User, user_id)
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    response_body = {
        "msg": "ok",
        "result": user.serialize()
    }
    return jsonify(response_body), 200


# Endpoint para pedir informacion de una pelicula por su id
@app.route('/peliculas/<int:pelicula_id>', methods=['GET'])
def handle_pelicula(pelicula_id):
    pelicula = db.session.get(Pelicula, pelicula_id)
    if pelicula is None:
        return jsonify({"msg": "Pelicula no encontrada"}), 404

    response_body = {
        "msg": "ok",
        "result": pelicula.serialize()
    }
    return jsonify(response_body), 200

#agregar peliculas a los modelos
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
        return jsonify({
            "msg": "Película ya existe",
            "pelicula": pelicula_existente.serialize()
        }), 200

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

    return jsonify({
        "msg": "Película creada",
        "pelicula": nueva_pelicula.serialize()
    }), 201
#ENDPOINT PARA CREAR FAVORITOS DEL USUARIO
@app.route('/users/<int:user_id>/favoritos', methods=['POST'])
def create_user_favorito(user_id):

    body = request.get_json()

    if not body:
        return jsonify({"msg": "Missing body"}), 400

    tmdb_id = body.get("tmdb_id")

    if not tmdb_id:
        return jsonify({"msg": "Se requiere tmdb_id"}), 400

    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    pelicula = db.session.execute(
        select(Pelicula).where(Pelicula.tmdb_id == tmdb_id)
    ).scalar_one_or_none()

    if not pelicula:
        return jsonify({"msg": "Película no encontrada"}), 404

    favorito_existente = db.session.execute(
        select(Favorito).where(
            Favorito.user_id == user_id,
            Favorito.pelicula_id == pelicula.id
        )
    ).scalar_one_or_none()

    if favorito_existente:
        return jsonify({"msg": "Esta película ya está en favoritos"}), 400

    nuevo_favorito = Favorito(
        user_id=user_id,
        pelicula_id=pelicula.id
    )

    db.session.add(nuevo_favorito)
    db.session.commit()

    return jsonify({
        "msg": "Favorito creado",
        "favorito": nuevo_favorito.serialize()
    }), 201


# Endpoint de Login con verificación Bcrypt y Token JWT
@app.route("/login", methods=["POST"])
def login():
    body = request.get_json()

    if not body:
        return jsonify({"msg": "Missing body"}), 400

    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "se requieren email y contraseña"}), 400

    user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if user is None:
        return jsonify({"msg": "email o contraseña incorrectos"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"msg": "email o contraseña incorrectos"}), 401

    access_token = create_access_token(identity=email)

    return jsonify({
    "msg": "login exitoso",
    "access_token": access_token,
    "user": user.serialize()
}), 200


# Endpoint Privado protegido por JWT
@app.route("/private", methods=["GET"])
@jwt_required()
def private():
    # 1. Obtenemos el email que viene en el token
    email_usuario = get_jwt_identity()
    
    # 2. Buscamos al usuario en la tabla User
    user = User.query.filter_by(email=email_usuario).first()
    
    if not user:
        return jsonify(msg="Usuario no encontrado"), 404

    # 3. Mandamos todos los datos que quieres ver en el perfil
    return jsonify(
        id=user.id,
        nombre=user.nombre,  # Verifica si en tu tabla se llama 'nombre' o 'username'
        email=user.email,
        msg="Acceso autorizado"
    ), 200


# Endpoint de Registro con encriptación Bcrypt
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

    existing_user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

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

# FAVORITOS
@app.route('/users/<int:user_id>/favoritos', methods=['GET'])
def get_user_favoritos(user_id):
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    favoritos = [f.serialize() for f in user.favoritos]

    return jsonify({"msg": "ok", "result": favoritos}), 200

#ELIMINAR FAVORITOS

@app.route('/favorite/<int:favorito_id>', methods=['DELETE'])
def delete_favorite(favorito_id):
    favorito = db.session.get(Favorito, favorito_id)

    if not favorito:
        return jsonify({"msg": "Favorito not found"}), 404

    db.session.delete(favorito)
    db.session.commit()

    return jsonify({"msg": "Favorito eliminado"}), 200


if __name__ == "__main__":
    app.run(debug=True)
