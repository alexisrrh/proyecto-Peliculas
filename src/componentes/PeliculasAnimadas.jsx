import React, { useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const PeliculasAnimadas = () => {
    const { state, dispatch } = useAppContext();
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
        }
    };

    return (
        <div className="relative group">
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 z-40 bg-black/70 text-white p-4 rounded-full">
                <i className="fa-solid fa-angles-left"></i>
            </button>
            <div ref={scrollRef} className="flex flex-row overflow-x-auto no-scrollbar gap-7 p-10">
                {state.Animadas.map((item) => (
                    <div key={item.id} className="max-w-[300px] shrink-0 relative group hover:scale-105 transition-all">
                        <Link to={`/modal/${item.id}`}>
                            <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} className="rounded-2xl" alt={item.title} />
                        </Link>
                        <i className={`absolute top-4 right-4 fa-solid fa-heart cursor-pointer ${state.Favoritos.find(f => f.id === item.id) ? "text-red-500" : "text-white"}`}
                           onClick={() => dispatch({ type: "set_Favoritos", payload: item })}></i>
                    </div>
                ))}
            </div>
            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 z-40 bg-black/70 text-white p-4 rounded-full">
                <i className="fa-solid fa-angles-right"></i>
            </button>
        </div>
    );
};

export default PeliculasAnimadas;