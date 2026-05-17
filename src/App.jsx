import { BrowserRouter, useLocation } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Footer from "./componentes/Footer";
import StarBackground from "./componentes/StarBackground"; 
import { AppRoutes } from "./routes/appRoutes";

function Layout() {
  const location = useLocation();
  
  // 👇 Se añadió "/login" para no mostrar Navbar/Footer aquí tampoco
  const isFullScreenPage = location.pathname === "/" || location.pathname === "/relax" || location.pathname === "/login" || location.pathname === "/registro" ;

  return (
    <div className="flex flex-col min-h-screen relative text-white">
      
      {/* 1. EL FONDO (Siempre detrás) */}
      <StarBackground />
    
      {/* 2. EL CONTENIDO (Navbar y Footer se ocultan en Landing, Relax y Login) */}
      {!isFullScreenPage && <Navbar />}
    
      <main className="flex-grow relative z-10">
        <AppRoutes />
      </main>

      {!isFullScreenPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;