
import React, { useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";


const PeliculasAnimadas = () => {


  const { state, dispatch } = useAppContext();

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 300;

      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
   <div className="relative mx-auto ">
         <button
           onClick={() => scroll("left")}
           className="cursor-pointer  hover:scale-120 transition-all duration-300 absolute left-0 top-3/8 m-5 -translate-y-1/2 z-50 bg-black/70 text-white px-4 py-4 rounded-full outline-none focus:outline-none">
           <i className="fa-solid fa-angles-left"></i>
         </button>
   
         <div ref={scrollRef} className=" flex flex-row justify-start  overflow-hidden gap-7 p-10 ">
           {state.Animadas.map((item) => (
             <div
               key={item.id} className="max-w-[300px] group relative shrink-0  shadow-lg transform transition-all duration-300 hover:z-20 hover:-translate-y-4 hover:scale-105 hover:shadow-2xl hover:ring-red-500/50">
           
                 <div className=" h-100 rounded-2xl  ">
                       <Link to={`/modal/${item.id}`} >
                   <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} className="h-full rounded-2xl w-full hover:rotate-2 object-cover transition duration-500 hover:grayscale-100" />
                </Link>
                <div className="flex top-0 items-start justify-between gap-3 p-2 group-hover:opacity-100 md:opacity-0  transition-all duration-500 absolute">
                 <h3 className="text-2xl font-semibold text-white">
                   {item.title}
                 </h3>
   
                 <i className={`fa-solid fa-heart cursor-pointer transition transform pt-2 hover:scale-150 ${state.Favoritos.find((fav) => fav.id === item.id) ? "text-red-500 scale-110" : "text-white"}`}
                   onClick={() => { dispatch({ type: "set_Favoritos", payload: item }); }}></i>
                   </div>
                 </div>
             
              
               <div>
                 <p className="overflow-hidden rounded-2xl  bg-zinc-900 mt-3 text-sm leading-6 text-white font-bold text-justify line-clamp-4 px-4 py-1 group-hover:translate-y-0 md:opacity-0 group-hover:opacity-100  md:-translate-y-100 transition-all duration-300">
                   {item.overview}
                 </p>
               </div>
             </div>
           ))}
         </div>
   
         <button
           onClick={() => scroll("right")}
           className="cursor-pointer hover:scale-120 transition-all duration-300 absolute right-0 top-3/8 m-5 -translate-y-1/2 z-50 bg-black/70 text-white px-4 py-4 rounded-full"
         >
           <i className="fa-solid fa-angles-right"></i>
         </button>
       </div>
  );
}

export default PeliculasAnimadas;