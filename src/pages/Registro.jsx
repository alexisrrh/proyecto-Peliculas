import useGlobalReducer from "../hooks/useGlobalReducer";
import { useState } from "react";
import { useNavigate } from "react-router-dom/dist/umd/react-router-dom.development";
import { crearUsuario } from "../services/auth.services";
export default function Registro() {
    const { store, dispatch } = useGlobalReducer();
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


     const handleSubmit = async (e) => {
        e.preventDefault();
        let usuario = await crearUsuario(nombre, apellido, email, password);        
       if (!usuario) {
           alert("Error al crear el usuario");
           return;
        } 
        localStorage.setItem("token", usuario.access_token);
        navigate("/login");
        }
      

     


    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">

    <div
        className="card bg-dark text-white p-4 shadow-lg"
        style={{
            width: "350px",
            borderRadius: "20px",
            border: "1px solid #333"
        }}
    >

        <h1 className="text-center mb-4">
            Registro
        </h1>

        <form onSubmit={handleSubmit}>
             <div className="mb-3">
                <input type="text" className="form-control bg-white text-black border-secondary" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div className="mb-3">
                <input type="text" className="form-control bg-white text-black border-secondary" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)}/>
            </div>
            <div className="mb-3">
                <input type="email" className="form-control bg-white text-black  border-secondary" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div className="mb-3">
                <input type="password" className="form-control bg-white text-black border-secondary" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button
                type="submit"
                className="btn btn-warning w-100 fw-bold mb-3"
            >
                Registro
            </button>

          

        </form>

    </div>

</div>
    );
}