import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {login  } from "../services/auth.services";
const LogIn = () => {

  const navigate = useNavigate();

  const[ email, setEmail] = useState("");
  const[password, setPassword]= useState("");
   
  

 

const handleSubmit = async (e) => {
  e.preventDefault();

  const usuario = await login(email, password);

  if (!usuario || usuario.msg !== "login exitoso") {
    alert("usuario o contraseña incorrectos");
    return;
  }

  localStorage.setItem("token", usuario.access_token);
  localStorage.setItem("user", JSON.stringify(usuario.user));

  navigate("/inicio");
  window.location.reload();

};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-mono relative overflow-hidden">
      
      {/* CAPA DE EFECTO CRT/VHS */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,255,0,0.06))] bg-[length:100%_4px,3px_100%]"></div>

      {/* CONTENEDOR DE LA TARJETA DE LOGIN */}
      <div className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-md border-2 border-cyan-500 p-8 shadow-[0_0_30px_rgba(6,182,212,0.3),inset_0_0_15px_rgba(6,182,212,0.2)] group">
        
        {/* Barra superior estilo VHS */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-fuchsia-600 via-cyan-400 to-fuchsia-600"></div>

        {/* Indicadores VHS decorativos */}
        <div className="absolute top-4 right-4 text-[10px] text-red-500 font-bold tracking-widest animate-pulse flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,1)]"></div> REC
        </div>
        <div className="absolute top-4 left-4 text-[10px] text-zinc-500 tracking-widest uppercase">
          SP Mode / Ch. 3
        </div>

        {/* HEADER */}
        <div className="text-center mt-6 mb-10">
          <h2 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">
            VHSFLIX
          </h2>
          <p className="text-cyan-300 text-xs tracking-[0.3em] uppercase mt-2 bg-cyan-900/30 inline-block px-3 py-1 border border-cyan-500/30">
            Terminal de Acceso
          </p>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="relative">
            <label className="block text-fuchsia-400 text-xs font-bold mb-2 uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-user text-[10px]"></i> ID de Socio
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/50 border border-zinc-700 focus:border-cyan-400 text-cyan-50 font-bold tracking-wider p-3 outline-none transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] placeholder-zinc-600"
                placeholder="INGRESA TU CORREO"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-fuchsia-400 text-xs font-bold mb-2 uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-key text-[10px]"></i> Código de Acceso
            </label>
            <input
              type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white/50 border border-zinc-700 focus:border-fuchsia-500 text-fuchsia-50 font-bold tracking-widest p-3 outline-none transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] focus:shadow-[0_0_15px_rgba(217,70,239,0.4)] placeholder-zinc-600"
              placeholder="INGRESA TU CLAVE"
            />
          </div>

          <button
            type="submit"
            className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white uppercase tracking-widest transition-all duration-300 transform -skew-x-12 bg-fuchsia-600 border-b-4 border-r-4 border-cyan-400 hover:bg-cyan-400 hover:border-fuchsia-600 hover:scale-105 active:translate-y-1 active:border-b-0 active:border-r-0 shadow-[0_0_20px_rgba(192,38,211,0.4)] mt-4 cursor-pointer"
          >
            <span className="transform skew-x-12 flex items-center gap-3">
              <i className="fa-solid fa-play"></i>
              Insertar Cinta
            </span>
          
          </button>
          <div className='text-center flex justify-center gap-2'>
            <span className='text-center'>¿no eres miembro? </span>
           <span onClick={()=> navigate('/registro')} className='className="text-zinc-500 hover:text-cyan-400 transition-colors flex items-center gap-2'> Registrate aqui </span>
       </div>
        </form>

        {/* ENLACES EXTRA */}
        <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col items-center gap-4 text-xs tracking-widest">
          <a href="#" className="text-zinc-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation text-[10px]"></i> ¿Cinta atascada? (Recuperar clave)
          </a>
        </div>
      </div>
    </div>
  );
};

export default LogIn;