import React, { createContext, useContext, useReducer, useEffect } from "react";
import { appReducer, initialState } from "./appReducer";
import { obtenerFavoritos } from "../services/auth.services";

const AppContext = createContext();
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_URL = import.meta.env.VITE_TMDB_DISCOVER_URL;

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  async function peliculas() {
    console.log("TMDB_BASE_URL:", TMDB_BASE_URL);
console.log("TMDB_URL:", TMDB_URL);
console.log("TMDB_KEY:", TMDB_KEY);
    try {
      let response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_KEY}`,
        { method: "GET" },
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data.results);
        dispatch({ type: "set_Populares", payload: data.results });
      } else {
        console.log(response.status);
      }
      let responseP = await fetch(
        `${TMDB_URL}?api_key=${TMDB_KEY}&with_genres=28`,
        { method: "GET" },
      );
      if (responseP.ok) {
        const dataP = await responseP.json();
        console.log(dataP);
        dispatch({ type: "set_Accion", payload: dataP.results });
      } else {
        console.log(responseP.status);
      }
      let responseC = await fetch(
        `${TMDB_URL}?api_key=${TMDB_KEY}&with_genres=35`,
        { method: "GET" },
      );
      if (responseC.ok) {
        const dataC = await responseC.json();
        console.log(dataC);
        dispatch({ type: "set_Comedia", payload: dataC.results });
      } else {
        console.log(responseC.status);
      }
      let responseT = await fetch(
        `${TMDB_URL}?api_key=${TMDB_KEY}&with_genres=27`,
        { method: "GET" },
      );

      if (responseT.ok) {
        const dataT = await responseT.json();
        console.log(dataT);

        dispatch({ type: "set_Terror", payload: dataT.results });
      } else {
        console.log(responseT.status);
      }

      let responseA = await fetch(
       `${TMDB_URL}?api_key=${TMDB_KEY}&with_genres=16`,
        { method: "GET" },
      );

      if (responseA.ok) {
        const dataA = await responseA.json();
        console.log(dataA);

        dispatch({ type: "set_Animadas", payload: dataA.results });
      } else {
        console.log(responseA.status);
      }
    

    } catch (error) {
      return console.log("Error:", error);
    }
  }

  useEffect(() => {
    peliculas();
  }, []);

  // CARGA DE FAVORITOS DE CADA USUARIO

useEffect(() => {
  async function cargarFavoritos() {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      dispatch({ type: "clear_Favoritos" });
      return;
    }

    const favoritos = await obtenerFavoritos(userId);

    dispatch({
      type: "set_Favoritos_DB",
      payload: favoritos,
    });
  }

  cargarFavoritos();
}, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
