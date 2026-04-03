import { Routes, Route } from "react-router-dom";
import  Home  from "../pages/Home";
import Categorias from "../pages/Categorias";
import Favoritos from "../pages/Favoritos";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categorias" element={<Categorias />} />
       <Route path="/favoritos" element={<Favoritos />} />
       <Route path="/agregarFavoritos/:id" element={<Favoritos />} />
    </Routes>
  );
};