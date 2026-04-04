import React, { useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import logo from '../assets/logo1.png'
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: 'Inicio', href: '/', current: true },
  { name: 'Categorías', href: '#', current: false },
  { name: 'Favoritos', href: '/favoritos', current: false },
  { name: 'Perfil', href: '#', current: false },
]

const Navbar = () => {
  const [showCategories, setShowCategories] = useState(false);
const location = useLocation(); // Detecta la ruta actual
  const categories = ["Populares", "Accion", "Terror", "Comedia", "Animadas"];

const isActive = (path) => location.pathname === path;

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 bg-black/70 backdrop-blur-md">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">

          {/* 1. BOTÓN MÓVIL */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white">
              <Bars3Icon className="block size-6 group-data-open:hidden" />
              <XMarkIcon className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* 2. LADO IZQUIERDO: LOGO Y LINKS */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img alt="Ipanema Logo" src={logo} className="h-16 w-auto" />
            </div>

            <div className="hidden sm:ml-10 sm:flex items-center space-x-8">
              {navigation.map((item) => {
                if (item.name === 'Categorías') {
                  return (
                    <div 
                      key={item.name} 
                      className="relative h-full flex items-center"
                      onMouseEnter={() => setShowCategories(true)}
                      onMouseLeave={() => setShowCategories(false)}
                    >
                      <button
                        className={`text-lg font-medium transition-colors ${
                          showCategories || categories.some(c => isActive(`/${c.toLowerCase()}`)) 
                          ? 'text-yellow-400' 
                          : 'text-white hover:text-gray-300'
                        }`}
                      >
                        {item.name}
                      </button>

                      {showCategories && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 min-w-[500px]">
                          <div className="bg-black/95 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl">
                            <div className="flex justify-center space-x-6">
                              {categories.map((cat) => (
                                <Link
                                  key={cat}
                                  to={`/${cat.toLowerCase()}`}
                                  onClick={() => setShowCategories(false)}
                                  className={`text-sm font-medium whitespace-nowrap transition-colors ${
                                    isActive(cat) ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                                  }`}
                                >
                                  {cat}
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-black/90"></div>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link 
                    key={item.name} 
                    to={item.href} 
                    className={`text-lg font-medium transition-colors ${
                      isActive(item.href) ? 'text-yellow-400' : 'text-white hover:text-gray-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. LADO DERECHO: BUSCADOR */}
          <div className="hidden sm:flex items-center ml-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="size-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar películas..."
                className="block w-64 rounded-full border-0 bg-white/10 py-1.5 pl-10 pr-4 text-white ring-1 ring-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-white sm:text-sm"
              />
            </div>
          </div>
        </div> 
      </div> 

      {/* PANEL MÓVIL */}
      <DisclosurePanel className="sm:hidden bg-black/90">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Navbar;