
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
        "nombre": nombre,
        "apellido": apellido,
        "email": email,
        "password": password,
       
    });

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: raw,
    };

    try {
        const response = await fetch(`${API_URL}/signup`, requestOptions);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error("fallo:", data);
            return null;
        }
    } catch (error) {
        console.error('Error during user creation:', error);
        return null;
    }
}

export async function Private() {   
    const token = localStorage.getItem("token");
    const requestOptions = {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    };

    try {
        const response = await fetch(`${API_URL}/private`, requestOptions);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error("fallo:", data);
            return null;
        }
    } catch (error) {
        console.error('Error during private endpoint access:', error);
        return null;
    }
}
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
        poster: pelicula.poster_path,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("fallo:", data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error agregando favorito:", error);
    return null;
  }
}

// OBTENER FAVORITOS DE CADA USUARIO 
export async function obtenerFavoritos(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/favoritos`, {
      method: "GET",
    });

    const data = await response.json();

    if (response.ok) {
      return data.result;
    } else {
      console.error("fallo obteniendo favoritos:", data);
      return [];
    }
  } catch (error) {
    console.error("Error obteniendo favoritos:", error);
    return [];
  }
}

// ELIMINAR FAVORITOS DE UN USUARIO 
export async function eliminarFavorito(favoritoId) {
  try {
    const response = await fetch(`${API_URL}/favorite/${favoritoId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      console.error("fallo eliminando favorito:", data);
      return null;
    }
  } catch (error) {
    console.error("Error eliminando favorito:", error);
    return null;
  }
}