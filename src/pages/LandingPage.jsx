import React from 'react';
import { Link } from 'react-router-dom';
import miLogo from '../assets/logo1.png'; // Asegúrate de que el nombre sea correcto

const LandingPage = () => {
  return (
    <div className="relative h-screen w-full font-mono overflow-hidden bg-black">
      
      {/* FONDO ATARDECER SYNTHWAVE */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('https://raw.githubusercontent.com/rainner/codepen-assets/master/images/pinkish_sunset.jpg')", backgroundSize: "170vh", backgroundPosition: "center top" }}
      ></div>

      {/* CUADRÍCULA 3D ANIMADA (Suelo de Neón) */}
      <style>
        {`
          .synthwave-grid {
            position: absolute;
            bottom: 0; left: -50%; width: 200%; height: 50vh;
            background-image: 
              linear-gradient(transparent 65%, rgba(217, 70, 239, 0.8) 75%, transparent 75%),
              linear-gradient(90deg, transparent 65%, rgba(6, 182, 212, 0.8) 75%, transparent 75%);
            background-size: 40px 40px;
            transform: perspective(600px) rotateX(70deg) translateY(50px) translateZ(-200px);
            animation: moveGrid 1.5s linear infinite;
            z-index: 10;
          }
          @keyframes moveGrid {
            0% { background-position: 0 0; }
            100% { background-position: 0 40px; }
          }
        `}
      </style>
      <div className="synthwave-grid"></div>
      
      {/* CAPA DE EFECTO CRT/VHS */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-15 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,255,0,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      
      {/* CONTENEDOR CENTRAL */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 drop-shadow-2xl mt-[-5vh]">
        
        {/* LOGO */}
        <img 
          src={miLogo} 
          alt="Logo de VHSFLIX" 
          className="w-64 sm:w-80 md:w-96 lg:w-[450px] mb-2 hover:scale-105 transition-transform duration-500 drop-shadow-[0_0_20px_rgba(217,70,239,0.8)] object-contain" 
        />
        
        {/* SUBTÍTULO */}
        <h2 className="text-cyan-300 text-sm sm:text-base md:text-xl tracking-[0.4em] uppercase font-bold mb-16 drop-shadow-[0_0_10px_rgba(6,182,212,1)] text-center px-4 bg-black/30 py-1 rounded">
          El Videoclub Del Futuro
        </h2>

        {/* BOTÓN DE ENTRADA Y BOTÓN RELAX */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Link 
            to="/inicio" 
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white uppercase tracking-widest transition-all duration-300 transform -skew-x-12 bg-fuchsia-600 border-b-4 border-r-4 border-cyan-400 hover:bg-cyan-400 hover:border-fuchsia-600 hover:scale-110 active:translate-y-1 active:border-b-0 active:border-r-0 shadow-[0_0_20px_rgba(192,38,211,0.6)]"
          >
            <span className="transform skew-x-12 flex items-center gap-3">
              <i className="fa-solid fa-ticket"></i>
              Insertar Cinta
            </span>
          </Link>

          <Link 
            to="/relax" 
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white uppercase tracking-widest transition-all duration-300 transform -skew-x-12 bg-zinc-800 border-b-4 border-r-4 border-purple-500 hover:bg-purple-500 hover:border-zinc-800 hover:scale-110 active:translate-y-1 active:border-b-0 active:border-r-0 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            <span className="transform skew-x-12 flex items-center gap-3">
              <i className="fa-solid fa-gamepad"></i>
              Modo Relax
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;