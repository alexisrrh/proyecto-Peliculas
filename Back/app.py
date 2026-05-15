from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, User, Pelicula
import os
from dotenv import load_dotenv
from sqlalchemy import select
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")

db.init_app(app)
MIGRATE = Migrate(app, db)
CORS(app)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

@app.route("/")
def home():
    return jsonify({
        "msg": "API funcionando"
    }), 200
#endpoint para pedir informacion de todos los usuarios
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
#endpoint para pedir informacion de todas las peliculas
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

#endpoint para pedir informacion de los favoritos de un usuario
@app.route('/user/<int:user_id>/favoritos', methods=['GET'])
def handle_user_favoritos(user_id):
    # busqueda del usuario en la base de datos para verificar que existe
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify({"msg": "No se encontraron usuarios"}), 404
# si el usuario existe, se obtiene la lista de favoritos del usuario y se serializa cada favorito para incluir los detalles del personaje, vehiculo o planeta asociado
    favoritos = list(map(lambda favorito: favorito.serialize(), user.favoritos))

    response_body = {
        "msg": "ok",
        "result": favoritos
    }
    return jsonify(response_body), 200

#endpoint para pedir iformacion de un usuario por su id
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

#endpoint para pedir iformacion de una pelicula por su id
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

#endpoint para crear un usuario
@app.route('/user', methods=['POST'])
def user_post():
    body = request.json

    if not body:
        return jsonify({"msg": "Missing body"}), 400

    if "nombre" not in body or "apellido" not in body or "email" not in body or "password" not in body:
        return jsonify({"msg": "Campos Faltantes"}), 400

    email = db.session.execute(
        select(User).where(User.email == body["email"])
    ).scalar_one_or_none()

    if email is not None:
        return jsonify({"msg": "Usuario ya existe"}), 400

    usuario_nuevo = User(
        nombre=body["nombre"],
        apellido=body["apellido"],
        email=body["email"],
        password=body["password"]
    )

    db.session.add(usuario_nuevo)
    db.session.commit()

    return jsonify({
        "msg": "usuario creado",
        "user": usuario_nuevo.serialize()
    }), 201

@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

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
        "access_token": access_token
    }), 200

@app.route("/private", methods=["GET"])
@jwt_required()
def private():
    current_user = get_jwt_identity()
    return jsonify(msg="Acceso autorizado", user=current_user), 200


@app.route('/signup', methods=['POST'])

def signup():
    body = request.get_json()

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

   
if __name__ == "__main__":
    app.run(debug=True)