import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RecuperarContraseña() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 
const API_URL = import.meta.env.VITE_API_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "No se pudo enviar el correo");
        return;
      }

      setMensaje(data.msg || "Te enviamos un enlace para cambiar tu contraseña.");
    } catch (error) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,255,0,0.06))] bg-[length:100%_4px,3px_100%]"></div>

      <div className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-md border-2 border-cyan-500 p-8 shadow-[0_0_30px_rgba(6,182,212,0.3),inset_0_0_15px_rgba(6,182,212,0.2)]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-fuchsia-600 via-cyan-400 to-fuchsia-600"></div>

        <div className="text-center mt-6 mb-10">
          <h2 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
            VHSFLIX
          </h2>

          <p className="text-cyan-300 text-xs tracking-[0.3em] uppercase mt-2 bg-cyan-900/30 inline-block px-3 py-1 border border-cyan-500/30">
            Recuperar clave
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-fuchsia-400 text-xs font-bold mb-2 uppercase tracking-widest">
              Correo electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 border border-zinc-700 focus:border-cyan-400 text-cyan-50 font-bold tracking-wider p-3 outline-none"
              placeholder="INGRESA TU CORREO"
            />
          </div>

          {mensaje && <p className="text-green-400 text-sm">{mensaje}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white uppercase tracking-widest transition-all duration-300 transform -skew-x-12 bg-fuchsia-600 border-b-4 border-r-4 border-cyan-400 hover:bg-cyan-400 hover:border-fuchsia-600 hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            <span className="transform skew-x-12">
              {loading ? "Enviando..." : "Enviar enlace"}
            </span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-zinc-500 hover:text-cyan-400 text-xs tracking-widest"
          >
            Volver al login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecuperarContraseña;