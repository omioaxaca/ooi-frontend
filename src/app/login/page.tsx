"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: false, password: false });
    
    // Basic validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: true }));
      toast.error("Por favor completa todos los campos correctamente");
      return;
    }
    if (!password) {
      setErrors(prev => ({ ...prev, password: true }));
      toast.error("Por favor ingresa tu contraseña");
      return;
    }
    
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Error de inicio de sesión", {
        description: error instanceof Error ? error.message : "Por favor verifica tus credenciales e intenta nuevamente.",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20 min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-ooi-dark-blue">Iniciar Sesión</h1>
              <p className="mt-2 text-ooi-text-dark">
                Accede a tu cuenta de la Olimpiada Oaxaqueña de Informática
              </p>
            </div>
            
            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-ooi-second-blue flex items-center justify-center text-white font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <h2 className="ml-3 text-xl font-semibold text-ooi-dark-blue">Credenciales de Acceso</h2>
                  </div>
                  <Separator className="mb-4" />
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className={errors.email ? "text-red-500 pb-2" : "pb-2"}>
                        Correo Electrónico *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors(prev => ({ ...prev, email: false }));
                        }}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder="tu.correo@ejemplo.com"
                        required
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          Por favor ingresa un correo electrónico válido
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="password" className={errors.password ? "text-red-500 pb-2" : "pb-2"}>
                          Contraseña *
                        </Label>
                        {/* <Link href="/recuperar-contrasena" className="text-sm text-ooi-second-blue hover:underline">
                          ¿Olvidaste tu contraseña?
                        </Link> */}
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrors(prev => ({ ...prev, password: false }));
                        }}
                        className={errors.password ? "border-red-500" : ""}
                        placeholder="••••••••"
                        required
                      />
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500">
                          Por favor ingresa tu contraseña
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-ooi-second-blue hover:bg-ooi-dark-blue text-white font-semibold py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Iniciando sesión...
                      </>
                    ) : "Iniciar Sesión"}
                  </Button>
                </div>
                
                <div className="text-center text-sm text-ooi-text-dark">
                  <p>
                    ¿No tienes una cuenta?{" "}
                    <Link href="/registro" className="text-ooi-second-blue hover:underline">
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white py-6 text-center text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Olimpiada Oaxaqueña de Informática. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
} 