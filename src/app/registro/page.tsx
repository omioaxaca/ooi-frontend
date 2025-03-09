"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { NewUser, useAuth } from "@/contexts/auth-context";

export default function Registro() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  
  // Account Details
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Personal Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  
  // School Details
  const [schoolName, setSchoolName] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [schoolGrade, setSchoolGrade] = useState("");

  // Form validation state
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
    phoneNumber: false,
    birthDate: false,
    schoolName: false,
    schoolLevel: false,
    schoolGrade: false
  });

  // Modified to handle the relationship between school level and grade
  const getGradeOptions = (level: string) => {
    switch(level) {
      case "PRIMARIA":
        return [
          { value: "PRIMERO", label: "1° Primaria" },
          { value: "SEGUNDO", label: "2° Primaria" },
          { value: "TERCERO", label: "3° Primaria" },
          { value: "CUARTO", label: "4° Primaria" },
          { value: "QUINTO", label: "5° Primaria" },
          { value: "SEXTO", label: "6° Primaria" },
        ];
      case "SECUNDARIA":
        return [
          { value: "PRIMERO", label: "1° Secundaria" },
          { value: "SEGUNDO", label: "2° Secundaria" },
          { value: "TERCERO", label: "3° Secundaria" },
        ];
      case "PREPARATORIA":
        return [
          { value: "PRIMERO", label: "1° Preparatoria" },
          { value: "SEGUNDO", label: "2° Preparatoria" },
          { value: "TERCERO", label: "3° Preparatoria" },
          { value: "CUARTO", label: "4° Preparatoria" },
          { value: "QUINTO", label: "5° Preparatoria" },
          { value: "SEXTO", label: "6° Preparatoria" },
        ];
      default:
        return [];
    }
  };
  
  // Reset grade when level changes
  const handleSchoolLevelChange = (value: string) => {
    setSchoolLevel(value);
    setSchoolGrade("");  // Reset the grade when level changes
  };

  // Add real-time validation for password matching
  useEffect(() => {
    if (confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: password !== confirmPassword
      }));
    }
  }, [password, confirmPassword]);
  
  // Add handlers to clear errors when fields are modified
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear password error when user types
    setErrors(prev => ({
      ...prev,
      password: false
    }));
  };
  
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    // The confirmPassword error will be handled by the useEffect above
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    const newErrors = {
      email: false,
      password: false,
      confirmPassword: false,
      firstName: false,
      lastName: false,
      phoneNumber: false,
      birthDate: false,
      schoolName: false,
      schoolLevel: false,
      schoolGrade: false
    };
    
    // Basic validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = true;
    if (!password || password.length < 6) newErrors.password = true;
    if (password !== confirmPassword) newErrors.confirmPassword = true;
    if (!firstName) newErrors.firstName = true;
    if (!lastName) newErrors.lastName = true;
    if (!phoneNumber) newErrors.phoneNumber = true;
    if (!birthDate) newErrors.birthDate = true;
    if (!schoolName) newErrors.schoolName = true;
    if (!schoolLevel) newErrors.schoolLevel = true;
    if (!schoolGrade) newErrors.schoolGrade = true;
    
    // If any errors, update state and return
    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors);
      toast.error("Por favor completa todos los campos requeridos correctamente");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format data EXACTLY as required by Strapi
      const userData: NewUser = {
        username: email,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        birthDate: birthDate,
        schoolName: schoolName,
        schoolLevel: schoolLevel,
        schoolGrade: schoolGrade
      };
      
      console.log("Sending user data:", userData); // For debugging
      
      // Make the API request to Strapi
      const newUser = await signup(userData);

      console.log("Response from API:", newUser); // For debugging
      
      toast.success("¡Registro exitoso!", {
        description: "Tu cuenta ha sido creada correctamente."
      });
      
      // Redirect to homepage or login
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Error en el registro", {
        description: error instanceof Error ? error.message : "Por favor intenta nuevamente más tarde."
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
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-ooi-dark-blue">Registro para la OOI 2025</h1>
              <p className="mt-2 text-ooi-text-dark">
                Completa el formulario para participar en la Olimpiada Oaxaqueña de Informática
            </p>
          </div>

            <motion.div 
              className="bg-white rounded-lg shadow-md p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Account Details Section */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-ooi-second-blue flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <h2 className="ml-3 text-xl font-semibold text-ooi-dark-blue">Detalles de la Cuenta</h2>
            </div>
                  <Separator className="mb-4" />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
                        Correo Electrónico *
                      </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder="ejemplo@correo.com"
                required
              />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          Por favor ingresa un correo electrónico válido
                        </p>
                      )}
            </div>

                    <div>
                      <Label htmlFor="password" className={errors.password ? "text-red-500" : ""}>
                        Contraseña *
                      </Label>
              <Input
                id="password"
                type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className={errors.password ? "border-red-500" : ""}
                placeholder="••••••••"
                required
                minLength={6}
              />
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500">
                          La contraseña debe tener al menos 6 caracteres
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword" className={errors.confirmPassword ? "text-red-500" : ""}>
                        Confirmar Contraseña *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                        placeholder="••••••••"
                        required
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">
                          Las contraseñas no coinciden
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Personal Details Section */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-ooi-purple flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <h2 className="ml-3 text-xl font-semibold text-ooi-dark-blue">Información Personal</h2>
                  </div>
                  <Separator className="mb-4" />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className={errors.firstName ? "text-red-500" : ""}>
                        Nombre(s) *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={errors.firstName ? "border-red-500" : ""}
                        placeholder="Juan"
                        required
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-xs text-red-500">
                          Por favor ingresa tu nombre
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName" className={errors.lastName ? "text-red-500" : ""}>
                        Apellido(s) *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={errors.lastName ? "border-red-500" : ""}
                        placeholder="Pérez"
                        required
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-xs text-red-500">
                          Por favor ingresa tus apellidos
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phoneNumber" className={errors.phoneNumber ? "text-red-500" : ""}>
                        Número de Teléfono *
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={errors.phoneNumber ? "border-red-500" : ""}
                        placeholder="9511234567"
                        required
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-xs text-red-500">
                          Por favor ingresa un número de teléfono válido
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="birthDate" className={errors.birthDate ? "text-red-500" : ""}>
                        Fecha de Nacimiento *
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className={errors.birthDate ? "border-red-500" : ""}
                        required
                      />
                      {errors.birthDate && (
                        <p className="mt-1 text-xs text-red-500">
                          Por favor selecciona tu fecha de nacimiento
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* School Details Section */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-ooi-light-blue flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <h2 className="ml-3 text-xl font-semibold text-ooi-dark-blue">Información Escolar</h2>
                  </div>
                  <Separator className="mb-4" />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="schoolName" className={errors.schoolName ? "text-red-500" : ""}>
                        Nombre de la Escuela *
                      </Label>
                      <Input
                        id="schoolName"
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className={errors.schoolName ? "border-red-500" : ""}
                        placeholder="Escuela Secundaria / Preparatoria..."
                        required
                      />
                      {errors.schoolName && (
                        <p className="mt-1 text-xs text-red-500">
                          Por favor ingresa el nombre de tu escuela
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="schoolLevel" className={errors.schoolLevel ? "text-red-500" : ""}>
                        Nivel Educativo *
                      </Label>
                      <Select
                        value={schoolLevel}
                        onValueChange={handleSchoolLevelChange}
                      >
                        <SelectTrigger className={errors.schoolLevel ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecciona tu nivel educativo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRIMARIA">Primaria</SelectItem>
                          <SelectItem value="SECUNDARIA">Secundaria</SelectItem>
                          <SelectItem value="PREPARATORIA">Preparatoria / Bachillerato</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.schoolLevel && (
                        <p className="mt-1 text-xs text-red-500">
                          Por favor selecciona tu nivel educativo
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="schoolGrade" className={errors.schoolGrade ? "text-red-500" : ""}>
                        Grado Escolar *
                      </Label>
                      <Select
                        value={schoolGrade}
                        onValueChange={setSchoolGrade}
                        disabled={!schoolLevel} // Disable if no level is selected
                      >
                        <SelectTrigger className={errors.schoolGrade ? "border-red-500" : ""}>
                          <SelectValue placeholder={schoolLevel ? "Selecciona tu grado" : "Primero selecciona nivel"} />
                        </SelectTrigger>
                        <SelectContent>
                          {getGradeOptions(schoolLevel).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.schoolGrade && (
                        <p className="mt-1 text-xs text-red-500">
                          Por favor selecciona tu grado escolar
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
                        Procesando...
                      </>
                    ) : "Completar Registro"}
            </Button>
                </div>
                
                <div className="text-center text-sm text-ooi-text-dark">
                  <p>
                    Al registrarte, aceptas nuestros{" "}
                    <Link href="/terminos-y-condiciones" className="text-ooi-second-blue hover:underline">
                      Términos y Condiciones
                    </Link>{" "}
                    y{" "}
                    <Link href="/politica-de-privacidad" className="text-ooi-second-blue hover:underline">
                      Política de Privacidad
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