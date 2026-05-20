import React, { useRef } from "react";
import { useAppContext } from "../context/AppContext";
import MovieCard from "./MovieCard";

const PeliculasComedia = () => {
  const { state } = useAppContext();
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

      <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/70 text-white p-4 rounded-full hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:outline-none">
        <i className="fa-solid fa-angles-left"></i>
      </button>

      <div ref={scrollRef} className="flex flex-row overflow-x-auto no-scrollbar gap-7 p-10 pb-20">
        {state.Comedia.map((item) => (
          <MovieCard key={item.id} item={item} />
        ))}
      </div>

      <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/70 text-white p-4 rounded-full hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:outline-none">
        <i className="fa-solid fa-angles-right"></i>
      </button>
    </div>
  );
};

export default PeliculasComedia;