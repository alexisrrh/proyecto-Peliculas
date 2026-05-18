
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
export async function agregarFavorito(userId, tmdbId) {
  const raw = JSON.stringify({
    tmdb_id: tmdbId,
  });

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw,
  };

  try {
    const response = await fetch(
      `${API_URL}/users/${userId}/favoritos`,
      requestOptions
    );

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      console.error("fallo:", data);
      return null;
    }
  } catch (error) {
    console.error("Error agregando favorito:", error);
    return null;
  }
}