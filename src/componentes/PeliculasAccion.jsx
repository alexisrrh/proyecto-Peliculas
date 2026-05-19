import React, { useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const PeliculasAccion = () => {
    const { state, dispatch } = useAppContext();
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const amount = 300;
            scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
        }
    };

    return (
        <div className="relative group">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            
            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/70 text-white p-4 rounded-full hover:scale-110 transition-all">
                <i className="fa-solid fa-angles-left"></i>
            </button>

            <div ref={scrollRef} className="flex flex-row overflow-x-auto no-scrollbar gap-7 p-10 pb-5">
                {state.Accion.map((item) => (
                    <div key={item.id} className="max-w-[300px] shrink-0 relative group transform transition-all duration-300 hover:scale-105">
                        <div className="h-100 rounded-2xl overflow-hidden relative">
                            <Link to={`/modal/${item.id}`}>
                                <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} className="h-full w-full object-cover" />
                            </Link>
                            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-black/80 to-transparent">
                                <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
                                <i className={`fa-solid fa-heart cursor-pointer transition ${state.Favoritos.find(f => f.id === item.id) ? "text-red-500" : "text-white"}`}
                                   onClick={() => dispatch({ type: "set_Favoritos", payload: item })}></i>
                            </div>
                        </div>
                        <p className="mt-2 text-white text-sm line-clamp-3 bg-zinc-900 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.overview}
                        </p>
                    </div>
                ))}
            </div>

            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/70 text-white p-4 rounded-full hover:scale-110 transition-all">
                <i className="fa-solid fa-angles-right"></i>
            </button>
        </div>
    );
};

export default PeliculasAccion;