import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Favoritos from "../pages/Favoritos";
import Modal from "../componentes/Modal";
import Search from "../pages/Busqueda";
import Categorias from "../pages/Categorias";
import { PerfilUsuario } from "../pages/Perfil";
import LandingPage from "../pages/LandingPage";
import Relax from "../pages/Relax"; 
// 1. Importar el componente
import LogIn from "../componentes/LogIn"; 
import Registro from "../componentes/Registro";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/inicio" element={<Home />} />
      
      <Route path="/login" element={<LogIn />} />
      
      <Route path="/relax" element={<Relax />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/populares" element={<Categorias />} />
      <Route path="/accion" element={<Categorias />} />
      <Route path="/terror" element={<Categorias />} />
      <Route path="/comedia" element={<Categorias />} />
      <Route path="/animadas" element={<Categorias />} />
      <Route path="/modal/:id" element={<Modal/>} />
      <Route path="/search/:texto?" element={<Search />} />
      <Route path="/usuario/:id" element={<PerfilUsuario/>} />
      <Route path="/registro"  element={<Registro/>}/>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};