import React from "react";
import { Link } from "react-router-dom";
import PeliculasPopulares from "../componentes/PeliculasPopulares";
import PeliculasAccion from "../componentes/PeliculasAccion";
import PeliculasComedia from "../componentes/PeliculasComedia";
import PeliculasTerror from "../componentes/PeliculasTerror";
import PeliculasAnimadas from "../componentes/PeliculasAnimadas";
import Portada from "../componentes/Portada";

function Home() {
  return (
    <div className="relative">
      
      {/* VISTA PREVIA RELAX (ESQUINA SUPERIOR DERECHA) */}
      <Link 
        to="/relax"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 group hover:scale-105 transition-all duration-300"
      >
        <div className="relative bg-black/60 backdrop-blur-md border-2 border-fuchsia-500 p-2 sm:p-3 rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.5)] flex items-center gap-3 overflow-hidden cursor-pointer">
          
          {/* Efecto Scanline Retro de fondo */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,255,0,0.06))] bg-[length:100%_4px,3px_100%]"></div>
          
          <div className="bg-fuchsia-900/50 p-2 rounded-lg border border-fuchsia-500/50 group-hover:bg-cyan-900/50 group-hover:border-cyan-400 transition-colors">
            <i className="fa-solid fa-gamepad text-xl sm:text-2xl text-cyan-400 group-hover:text-fuchsia-400 drop-shadow-[0_0_8px_currentColor] group-hover:animate-bounce"></i>
          </div>
          
          <div className="hidden sm:block text-left font-mono pr-2">
            <h3 className="text-fuchsia-400 group-hover:text-cyan-400 font-bold text-xs sm:text-sm tracking-widest leading-none mb-1 transition-colors">
              ARCADE
            </h3>
            <p className="text-white text-[9px] sm:text-[10px] tracking-widest animate-pulse">
              PLAY RELAX
            </p>
          </div>
        </div>
      </Link>
      {/* ============================================== */}

      <div className="relative w-full lg:h-[130vh]">
        <Portada />

        <div className="w-full px-4 mt-4 lg:absolute lg:bottom-6 lg:left-0 lg:z-30 lg:px-6">
          <p className="text-center text-2xl md:text-3xl lg:text-4xl text-white font-bold drop-shadow-lg mb-4">
            Películas Populares
          </p>

          <PeliculasPopulares />
        </div>
      </div>

      <p className="text-center text-2xl md:text-3xl lg:text-4xl text-white mt-10 font-bold drop-shadow-lg">
        Películas de Acción
      </p>
      <PeliculasAccion />

      <p className="text-center text-2xl md:text-3xl lg:text-4xl text-white mt-10 font-bold drop-shadow-lg">
        Películas de Comedia
      </p>
      <PeliculasComedia />

      <p className="text-center text-2xl md:text-3xl lg:text-4xl text-white mt-10 font-bold drop-shadow-lg">
        Películas de Terror
      </p>
      <PeliculasTerror />

      <p className="text-center text-2xl md:text-3xl lg:text-4xl text-white mt-10 font-bold drop-shadow-lg">
        Películas Animadas
      </p>
      <PeliculasAnimadas />
    </div>
  );
}

export default Home;