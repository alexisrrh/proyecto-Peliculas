import { Routes, Route } from "react-router-dom";
import  Home  from "../pages/Home";
import Categorias from "../pages/Categorias";
import Favoritos from "../pages/Favoritos";
import Animadas from "../pages/05-Animadas";
import Populares from "../pages/01-Populares";
import Accion from "../pages/02-Accion";
import Terror from "../pages/03-Terror";
import Comedia from "../pages/04-Comedia";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categorias" element={<Categorias />} />
       <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/populares" element={<Populares />} />
      <Route path="/categorias/acción" element={<Accion />} />
      <Route path="/categorias/terror" element={<Terror />} />
      <Route path="/categorias/comedia" element={<Comedia />} />
      <Route path="/categorias/animadas" element={<Animadas />} />
    </Routes>
  );
};