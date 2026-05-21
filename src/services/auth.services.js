
// FUNCION PARA EL INICIO DE SESION DE UN USUARIO
const API_URL = import.meta.env.VITE_API_URL;
export async function login(email, password) {
    const raw = JSON.stringify({
        "email": email,
        "password": password
    });

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: raw,
    };
try {    const response = await fetch(`${API_URL}/login`, requestOptions);
    const data = await response.json();
       if (response.ok) {
            return data;
        } else {
            console.error("fallo:", data);
            return null;
        }

    } catch (error) {
        console.error('Error during login:', error);
          return null;
    }   
}
// FUNCION PARA REGISTRO DE USUARIO
export async function crearUsuario(nombre, apellido, email, password) {
  const raw = JSON.stringify({
    nombre,
    apellido,
    email,
    password,
  });

  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    });

    const text = await response.text();

    console.log("STATUS SIGNUP:", response.status);
    console.log("RESPUESTA SIGNUP:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("El backend no devolvió JSON");
      return null;
    }

    if (response.ok) {
      return data;
    } else {
      console.error("fallo:", data);
      return null;
    }
  } catch (error) {
    console.error("Error during user creation:", error);
    return null;
  }
}

export async function Private() {   
    const token = localStorage.getItem("token");
    if (!token) return null;

    const requestOptions = {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    };

    try {
        const response = await fetch(`${API_URL}/private`, requestOptions);
        
        // 1. Verificamos si la respuesta es exitosa ANTES de hacer .json()
        if (!response.ok) {
            const errorText = await response.text(); // Leemos el error como texto
            console.error("Error del servidor (HTML):", errorText);
            return null;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error de conexión o parseo:', error);
        return null;
    }
}

// AGREGAR FAVORITOS// AGREGAR FAVORITOS
// AGREGAR FAVORITOS
export async function agregarFavorito(userId, pelicula) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/favoritos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tmdb_id: pelicula.id,
        titulo: pelicula.title,
        overview: pelicula.overview,
        poster_path: pelicula.poster_path,
        backdrop_path: pelicula.backdrop_path,
        release_date: pelicula.release_date,
        vote_average: pelicula.vote_average,
      }),
    });

    const text = await response.text();

    console.log("STATUS FAVORITO:", response.status);
    console.log("RESPUESTA FAVORITO:", text);

    if (!response.ok) {
      return null;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error agregando favorito:", error);
    return null;
  }
}

// OBTENER FAVORITOS DE CADA USUARIO // OBTENER FAVORITOS
export async function obtenerFavoritos(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/favoritos`, {
      method: "GET",
    });

    const text = await response.text();

    console.log("STATUS OBTENER FAVORITOS:", response.status);
    console.log("RESPUESTA OBTENER FAVORITOS:", text);

    if (!response.ok) {
      return [];
    }

    const data = JSON.parse(text);
    return data.result;
  } catch (error) {
    console.error("Error obteniendo favoritos:", error);
    return [];
  }
}

// ELIMINAR FAVORITOS DE UN USUARIO // ELIMINAR FAVORITO
export async function eliminarFavorito(favoritoId) {
  try {
    const response = await fetch(`${API_URL}/favorite/${favoritoId}`, {
      method: "DELETE",
    });

    const text = await response.text();

    console.log("STATUS ELIMINAR FAVORITO:", response.status);
    console.log("RESPUESTA ELIMINAR FAVORITO:", text);

    if (!response.ok) {
      return null;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error eliminando favorito:", error);
    return null;
  }
}