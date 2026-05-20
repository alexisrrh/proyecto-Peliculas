import React, { useState, useEffect } from 'react';

export const PerfilUsuario = () => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarActual, setAvatarActual] = useState("https://pinimg.com");
    const [editando, setEditando] = useState(false);

    const opcionesAvatares = [
        "https://pinimg.com",
        "https://pinimg.com",
        "https://pinimg.com",
        "https://pinimg.com"
    ];

    useEffect(() => {
        const cargarDatosPrivados = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // URL exacta de tu API en Render
                const response = await fetch(`https://proyecto-peliculas-1-iiml.onrender.com/private`, {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Datos del servidor:", data);
                    setUsuario(data);
                } else {
                    console.error("Error al obtener datos:", response.status);
                }
            } catch (error) {
                console.error('Error de conexión:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarDatosPrivados();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
            <span className="animate-pulse">[ ACCEDIENDO AL EXPEDIENTE... ]</span>
        </div>
    );

    if (!usuario) return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-4">
            <div className="border-2 border-red-500 p-8 text-center shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                <h1 className="text-red-500 text-2xl font-black mb-4">ACCESO DENEGADO</h1>
                <button onClick={() => window.location.href = "/login"} className="bg-red-600 text-white px-6 py-2 transform -skew-x-12 font-bold uppercase">
                    Ir al Login
                </button>
            </div>
        </div>
    );

    return (
        <div className="text-white font-mono p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full max-w-md flex flex-col items-center z-10">
                
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] text-center uppercase">
                    Expediente
                </h1>

                <div className="w-full border-2 border-purple-500 p-6 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.2),_8px_8px_0px_0px_rgba(236,72,153,1)] relative backdrop-blur-sm bg-black/30">
                    
                    {/* Código de barras decorativo */}
                    <div className="absolute top-3 right-4 opacity-30 flex h-5 gap-[2px]">
                        {[2, 4, 1, 3, 2, 5].map((w, i) => (
                            <span key={i} className="bg-white h-full" style={{ width: `${w}px` }}></span>
                        ))}
                    </div>

                    <div className="flex flex-col items-center pt-4">
                        <div className="w-32 h-32 md:w-36 md:h-36 border-4 border-purple-500 rounded-none overflow-hidden relative mb-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                            <img
                                src={avatarActual}
                                alt="Avatar"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>

                        {/* DATOS DINÁMICOS DEL BACKEND */}
                        <h2 className="text-2xl font-black text-pink-500 uppercase tracking-widest text-center">
                            {usuario.nombre || usuario.username || "SOCIO SIN NOMBRE"}
                        </h2>
                        
                        <p className="text-xs text-zinc-400 font-bold mt-1 tracking-widest">
                            MEMBERSHIP ID: <span className="text-white">#{usuario.id || "000"}</span>
                        </p>

                        {!editando ? (
                            <div className="mt-6 w-full border border-zinc-700 p-4 rounded-lg text-sm space-y-3 font-semibold bg-black/40">
                                <div className="flex justify-between border-b border-zinc-800 pb-2">
                                    <span className="text-purple-400 uppercase">EMAIL:</span>
                                    <span className="text-zinc-300">{usuario.email}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-purple-400 uppercase">ESTADO:</span>
                                    <span className="text-emerald-400 tracking-wider">● ACTIVO</span>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 w-full border border-dashed border-pink-500 p-4 rounded-lg text-center">
                                <p className="text-xs font-bold text-pink-400 mb-3 uppercase">Selecciona Avatar:</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {opcionesAvatares.map((img, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => { setAvatarActual(img); setEditando(false); }}
                                            className={`border-2 ${avatarActual === img ? 'border-pink-500 scale-105' : 'border-zinc-700'}`}
                                        >
                                            <img src={img} className="w-full aspect-square object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-4 mt-8">
                    <button 
                        onClick={() => setEditando(!editando)}
                        className="bg-purple-600 hover:bg-purple-500 text-white py-3 transform -skew-x-12 font-black uppercase text-sm border-r-4 border-b-4 border-purple-900 active:translate-y-1 transition-all"
                    >
                        {editando ? "CANCELAR" : "EDITAR"}
                    </button>
                    <button 
                        onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
                        className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white py-3 transform -skew-x-12 font-black uppercase text-sm active:translate-y-1 transition-all"
                    >
                        LOGOUT
                    </button>
                </div>
            </div>
        </div>
    );
};
