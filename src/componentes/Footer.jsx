import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="bg-black/70 text-white/70 py-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo o Nombre */}
        <div className="text-xl font-serif tracking-widest text-white">
          VHSFlix <span className="text-xs block text-center md:text-left text-orange-300">DESDE 2026</span>
        </div>

        {/* Copyright */}
        <div className="text-sm">
          © {new Date().getFullYear()} VHSFlix. Todos los derechos reservados.

        </div>

        <div className="flex flex-row gap-8 sm:gap-12">
          {/* Bloque Persona 1 */}
          <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div className="text-xs font-medium sm:text-sm">
                Alexis Rafael Rodriguez Haddad
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <a href="https://instagram.com/alexisrrh" className="hover:text-orange-300 transition-transform hover:scale-125">
                  {/* Iconos responsivos usando clases de Tailwind */}
                  <FaInstagram className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
                </a>
                <a href="https://wa.me/34674516605?text=Hola%20quiero%20información" className="hover:text-orange-300 transition-transform hover:scale-125">
                  <FaWhatsapp className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
                </a>
                <a href="https://github.com/alexisrrh" className="hover:text-orange-300 transition-transform hover:scale-125">
                  <i className="text-base sm:text-lg fa-brands fa-github"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Persona 2 */}
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <div className="text-xs font-medium sm:text-sm">
              Daniel David Díaz Flores
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="https://instagram.com/danieldaviddf" className="hover:text-orange-300 transition-transform hover:scale-125">
                {/* Iconos: tamaño 18px en móvil, 22px en pantallas sm+ */}
                <FaInstagram className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
              </a>
              <a href="https://wa.me/34643804335?text=Hola%20quiero%20información" className="hover:text-orange-300 transition-transform hover:scale-125">
                <FaWhatsapp className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
              </a>
              <a href="https://github.com/Danieldaviddf" className="hover:text-orange-300 transition-transform hover:scale-125">
                {/* GitHub: text-base en móvil, text-lg en pantallas sm+ */}
                <i className="text-base sm:text-lg fa-brands fa-github"></i>
              </a>
            </div>
          </div>
        </div>
    </footer>
  );
};

export default Footer;