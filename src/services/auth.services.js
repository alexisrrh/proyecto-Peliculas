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
try {    const response = await fetch('https://psychic-space-garbanzo-wrpjgrxr6xvqf94pw-3000.app.github.dev/login', requestOptions);
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
        const response = await fetch("https://psychic-space-garbanzo-wrpjgrxr6xvqf94pw-3000.app.github.dev/signup", requestOptions);
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
        const response = await fetch('https://psychic-space-garbanzo-wrpjgrxr6xvqf94pw-3000.app.github.dev/private', requestOptions);
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

