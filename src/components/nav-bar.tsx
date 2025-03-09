"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const isHomePage = pathname === "/";
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  // Function to handle section navigation
  const handleNavigation = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isHomePage) {
      // If already on homepage, just scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to homepage with the section hash
      router.push(`/#${sectionId}`);
    }
    
    // Close mobile menu if open
    if (isMenuOpen) {
      closeMenu();
    }
  };
  
  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle hash navigation when arriving from another page
  useEffect(() => {
    if (isHomePage && window.location.hash) {
      // Wait for page to fully load
      setTimeout(() => {
        const element = document.getElementById(window.location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [isHomePage]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-md" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/logo.png" 
                alt="Olimpiada Oaxaqueña de Informática"
                width={512}
                height={512}
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/#home" 
              onClick={handleNavigation('home')}
              className="font-medium text-ooi-text-dark hover:text-ooi-second-blue transition-colors"
            >
              Inicio
            </Link>
            <Link 
              href="/#what-is" 
              onClick={handleNavigation('what-is')}
              className="font-medium text-ooi-text-dark hover:text-ooi-second-blue transition-colors"
            >
              ¿Qué es?
            </Link>
            <Link
              href="/#benefits" 
              onClick={handleNavigation('benefits')}
              className="font-medium text-ooi-text-dark hover:text-ooi-second-blue transition-colors"
            >
              Beneficios
            </Link>
            <Link
              href="/#convocatoria" 
              onClick={handleNavigation('convocatoria')}
              className="font-medium text-ooi-text-dark hover:text-ooi-second-blue transition-colors"
            >
              Convocatoria
            </Link>
            <Link
              href="/#faq" 
              onClick={handleNavigation('faq')}
              className="font-medium text-ooi-text-dark hover:text-ooi-second-blue transition-colors"
            >
              FAQ
            </Link>
          </div>

          {/* Auth buttons or user menu */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarFallback>
                        {user.firstName?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* <DropdownMenuItem className="cursor-pointer">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Settings
                    </DropdownMenuItem> */}
                    <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Iniciar Sesión</Button>
                </Link>
                <Link href="/registro">
                  <Button className="bg-primary hover:bg-primary-dark text-white">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
          <div className="py-4 px-6 flex flex-col space-y-4">
            <Link 
              href="/#home" 
              onClick={handleNavigation('home')}
              className="hover:text-blue-600 py-2"
            >
              Inicio
            </Link>
            <Link 
              href="/#what-is" 
              onClick={handleNavigation('what-is')}
              className="hover:text-blue-600 py-2"
            >
              ¿Qué es?
            </Link>
            <Link 
              href="/#benefits" 
              onClick={handleNavigation('benefits')}
              className="hover:text-blue-600 py-2"
            >
              Beneficios
            </Link>
            <Link 
              href="/#convocatoria" 
              onClick={handleNavigation('convocatoria')}
              className="hover:text-blue-600 py-2"
            >
              Convocatoria
            </Link>
            <Link 
              href="/#faq" 
              onClick={handleNavigation('faq')}
              className="hover:text-blue-600 py-2"
            >
              FAQ
            </Link>

            <div className="pt-4 border-t">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <Link href="/dashboard" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" className="w-full text-left justify-start" onClick={logout}>
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link href="/login" onClick={closeMenu} className="w-full">
                    <Button variant="outline" className="w-full">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/registro" onClick={closeMenu} className="w-full">
                    <Button className="w-full">Registrarse</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 