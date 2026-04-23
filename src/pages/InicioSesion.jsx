import React from 'react';

const InicioSesion = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono relative overflow-hidden">
      
      {/* CAPA DE EFECTO CRT/VHS (SCANLINES) */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,255,0,0.06))] bg-[length:100%_4px,3px_100%]"></div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="relative z-10 w-full max-w-md p-8 bg-zinc-900 border-4 border-fuchsia-600 shadow-[0_0_20px_rgba(192,38,211,0.6),inset_0_0_10px_rgba(192,38,211,0.4)]">
        
        {/* LOGO ESTILO VHS */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-black italic tracking-tighter text-cyan-400 drop-shadow-[3px_3px_0px_rgba(217,70,239,1)] mb-2">
            VHSFLIX
          </h1>
          <div className="flex justify-between text-[10px] text-fuchsia-500 uppercase tracking-widest px-2">
            <span>SP Mode</span>
            <span className="animate-pulse">● Rec</span>
            <span>Oct 26 1985</span>
          </div>
        </header>

        {/* FORMULARIO */}
        <form className="space-y-6">
          <div className="relative">
            <label className="block text-emerald-400 text-xs mb-1 uppercase tracking-tighter">User_ID:</label>
            <input 
              type="text" 
              className="w-full bg-black border border-emerald-500 text-emerald-400 p-2 outline-none focus:ring-1 focus:ring-emerald-300 placeholder-emerald-900"
              placeholder="NOMBRE_USUARIO"
            />
          </div>

          <div className="relative">
            <label className="block text-emerald-400 text-xs mb-1 uppercase tracking-tighter">Access_Code:</label>
            <input 
              type="password" 
              className="w-full bg-black border border-emerald-500 text-emerald-400 p-2 outline-none focus:ring-1 focus:ring-emerald-300 placeholder-emerald-900"
              placeholder="********"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-fuchsia-600 text-white font-bold py-3 px-4 border-b-4 border-r-4 border-cyan-500 hover:bg-cyan-500 hover:border-fuchsia-600 active:translate-y-1 active:border-b-0 transition-all uppercase italic"
          >
            Play Tape ►
          </button>
        </form>

        {/* FOOTER RETRO */}
        <footer className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-[9px] text-zinc-500 uppercase">
          <p>Tracking: Auto</p>
          <p className="animate-bounce">Insert Coin</p>
          <p>Hi-Fi Stereo</p>
        </footer>
      </div>

      {/* RUIDO VISUAL DE FONDO (OPCIONAL) */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>
    </div>
  );
};

export default VHSLogin;
