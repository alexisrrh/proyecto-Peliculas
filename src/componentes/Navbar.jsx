import react from 'react'
import { Link } from "react-router-dom";
const Navbar = () => {
  const [showCategories, setShowCategories] = useState(false);
  const categories = ["Populares", "Acción", "Terror", "Comedia", "Animadas"];

  return (
    <nav className="w-full bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div className="text-lg font-semibold">
          LOGO
        </div>

        {/* LINKS */}
        <div className="hidden md:flex gap-6">
          <Link to="/" className="px-3 py-2 rounded-md bg-gray-900">
            Inicio
          </Link>
          <Link to="/categorias" className="px-3 py-2 rounded-md hover:bg-white/10">
           Categorias
          </Link>
          <Link to="/favoritos" className="px-3 py-2 rounded-md hover:bg-white/10">
            Favoritos
          </Link>
        </div>

        {/* BOTÓN MÓVIL */}
        <button className="md:hidden text-xl">
          ☰
        </button>

      </div>

      <DisclosurePanel className="bg-black/90 sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

    export default Navbar;  
