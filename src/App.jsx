import { BrowserRouter, useLocation } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Footer from "./componentes/Footer";
import StarBackground from "./componentes/StarBackground"; 
import { AppRoutes } from "./routes/appRoutes";

function Layout() {
  const location = useLocation();
  const isFullScreenPage = location.pathname === "/relax" || location.pathname === "/login" || location.pathname === "/registro" || location.pathname === "/recuperarContraseña";

  return (
    <div className="flex flex-col min-h-screen relative text-white">
      <StarBackground />
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