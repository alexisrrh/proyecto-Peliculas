import React, { use, useEffect } from "react";
import PeliculasPopulares from "../componentes/PeliculasPopulares";
import { useAppContext } from "../context/AppContext";
import PeliculasAccion from "../componentes/PeliculasAccion";
import PeliculasComedia from "../componentes/PeliculasComedia";
import PeliculasTerror from "../componentes/PeliculasTerror";
import PeliculasAnimadas from "../componentes/PeliculasAnimadas";

function Home() {
 

const { state, dispatch } = useAppContext();
 
    async function peliculas() {
        
      try { let response = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=1ecf4daf764af90f82ce01b58fd9ecc7",{ method:"GET"});
        if (response.ok) {    
                        
             const data = await response.json();
             console.log(data.results);
   dispatch({type:"set_Populares", payload: data.results });
 
      }
       else{
console.log(response.status)
       }
let responseP= await fetch ("https://api.themoviedb.org/3/discover/movie?api_key=1ecf4daf764af90f82ce01b58fd9ecc7&with_genres=28",{ method:"GET"});
if (responseP.ok) {
  const dataP = await responseP.json();
  console.log(dataP);
  dispatch({type:"set_Accion", payload: dataP.results });
}
else{
  console.log(responseP.status)
}
let responseC= await fetch ("https://api.themoviedb.org/3/discover/movie?api_key=1ecf4daf764af90f82ce01b58fd9ecc7&with_genres=35",{ method:"GET"});
if (responseC.ok) {
  const dataC = await responseC.json();
  console.log(dataC);
  dispatch({type:"set_Comedia", payload: dataC.results });
}
else{
  console.log(responseC.status)
}
let responseT = await fetch("https://api.themoviedb.org/3/discover/movie?api_key=1ecf4daf764af90f82ce01b58fd9ecc7&with_genres=27", { method: "GET" });

if (responseT.ok) {
  const dataT = await responseT.json();
  console.log(dataT);
  
  dispatch({type: "set_Terror", payload: dataT.results});
} else {
  console.log(responseT.status);
}

let responseA = await fetch("https://api.themoviedb.org/3/discover/movie?api_key=1ecf4daf764af90f82ce01b58fd9ecc7&with_genres=16", { method: "GET" });

if (responseA.ok) {
  const dataA = await responseA.json();
  console.log(dataA);
  
  dispatch({type: "set_Animadas", payload: dataA.results});
} else {
  console.log(responseA.status);
}
}
      catch (error) {
      return  console.log("Error:", error);
      }  
    
    }
 
useEffect(() => {
  peliculas();
},[])   
 
 
 
 
 
    return (
        <div>
       <h1 className="text-3xl font-bold text-start text-white ">Películas Populares</h1>
 <PeliculasPopulares /> 
 <h1 className="text-3xl font-bold text-start text-white mb-8">Películas de Acción</h1>
 <PeliculasAccion />
 <h1 className="text-3xl font-bold text-start text-white mb-8">Películas de Comedia</h1>
 <PeliculasComedia />
 <h1 className="text-3xl font-bold text-start text-white mb-8">Películas de Terror</h1>
 <PeliculasTerror />
 <h1 className="text-3xl font-bold text-start text-white mb-8">Películas Animadas</h1>
 <PeliculasAnimadas />
 </div>  
  );
}           


export default Home;