"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, useInView, useAnimation, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClientOnly } from "@/components/client-only"

export default function Home() {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Counter animation
  const Counter = ({ 
    from = 0, 
    to, 
    duration = 2, 
    className = "" 
  }: { 
    from?: number; 
    to: number; 
    duration?: number; 
    className?: string 
  }) => {
    const [count, setCount] = useState(from);
    const nodeRef = useRef(null);
    const isInView = useInView(nodeRef, { once: true, amount: 0.5 });
    
    useEffect(() => {
      if (isInView) {
        let start = from;
        const step = to / (duration * 60);
        
        const timer = setInterval(() => {
          start += step;
          if (start >= to) {
            setCount(to);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 1000/60);
        
        return () => clearInterval(timer);
      }
    }, [isInView, from, to, duration]);
    
    return <span ref={nodeRef} className={className}>{count}+</span>;
  };

  // Add this state to track which convocatoria is currently being viewed
  const [selectedConvo, setSelectedConvo] = useState<number | null>(null);

  return (
    <>
      <ClientOnly>
        <Navbar />
      </ClientOnly>
      <div className="pt-16 md:pt-20">
        {/* Enhanced Hero Section */}
        <section id="home" className="py-32 md:py-40 relative overflow-hidden">
          {/* Background gradient with primary and purple */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-[#09468b] via-[#1e77ba] to-[#6b3c8c] opacity-90"></div> */}
          
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 opacity-90"></div>

          {/* Optional decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-ooi-purple/20 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left side - Text content */}
              <div className="text-white text-left">
                <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 transition-all text-base px-4 py-2 font-medium">
                  Selección 2025
                </Badge>
                <h1 className="text-secondary text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Olimpiada Oaxaqueña de Informática
                </h1>
                <p className="text-xl md:text-2xl mb-6 font-light text-white/90 max-w-xl">
                  ¡Vuélvete el/la mejor programador(a) del estado de Oaxaca!
                </p>
                {/* <p className="text-lg mb-10 font-semibold bg-white/10 inline-block px-4 py-2 rounded-lg">
                  Inicio de clases: <span className="text-ooi-yellow">7 de Abril 2025</span>
                </p> */}
                <div className="flex flex-wrap gap-4 mt-8">
                  {/* <Link href="/registro">
                    <Button size="lg" className="bg-ooi-yellow text-ooi-text-dark hover:bg-ooi-light-blue/90 border-2 hover:scale-105 transition-all duration-300 font-bold">
                      Registrarme Ahora
                    </Button>
                  </Link> */}
                  <Link href="https://discord.gg/VjHmAqKfwh" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="bg-ooi-purple flex items-center gap-2 border-2 border-white text-ooi-text-white hover:bg-ooi-light-blue/90 hover:scale-105 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                      Unirse a Discord
                  </Button>
                </Link>
                </div>
              </div>
              
              {/* Right side - Space for 3D image - now visible on mobile */}
              <div className="h-[300px] md:h-[600px] relative mt-6 md:mt-0">
                <div className="absolute inset-0">
                  <Image
                    src="/images/hero-header.png"
                    alt="OOI 3D Visual"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Diagonal divider - more inclined and inverted */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 60" preserveAspectRatio="none" className="w-full h-24">
              <polygon points="0,60 1200,0 1200,60 0,60" fill="#ffffff"></polygon>
            </svg>
          </div>
        </section>

        {/* What is? Section with Animation */}
        <section id="what-is" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-ooi-dark-blue"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              ¿Qué es la Olimpiada Oaxaqueña de Informática?
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-12">
              {/* What the organization is */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-t-ooi-second-blue">
                  <CardHeader className="bg-gradient-to-r from-ooi-light-blue/20 to-transparent">
                    <CardTitle className="text-xl text-ooi-second-blue">¿Qué es la OOI?</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pt-6">
                    <div className="mb-4 rounded-lg overflow-hidden h-60 relative">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                      >
                        <Image 
                          src="/images/group-questions.png" 
                          alt="Organización" 
                          fill 
                          className="object-contain transition-all"
                        />
                      </motion.div>
                    </div>
                    <p className="text-ooi-text-dark">
                    La OOI es una competencia diseñada para jóvenes apasionados por la resolución de problemas mediante la programación y la lógica computacional. A través de entrenamientos y desafíos progresivos, buscamos descubrir y formar a los mejores talentos de Oaxaca, quienes representarán al estado en la Olimpiada Mexicana de Informática 2025.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Steps */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-t-ooi-purple">
                  <CardHeader className="bg-gradient-to-r from-ooi-purple/10 to-transparent">
                    <CardTitle className="text-xl text-ooi-purple">¿Cuáles son las etapas?</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pt-6">
                    <div className="mb-4 rounded-lg overflow-hidden h-60 relative">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                      >
                        <Image 
                          src="/images/phases.png" 
                          alt="Etapas" 
                          fill 
                          className="object-contain transition-all"
                        />
                      </motion.div>
                    </div>
                    <motion.ol 
                      className="list-decimal pl-5 space-y-2 text-ooi-text-dark"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                        hidden: {}
                      }}
                    >
                      {["Inscripción: Regístrate llenando el formulario y asegúrate de cumplir los requisitos.",
                      "Entrenamiento: Durante un periodo aproximadamente de 5 meses se te impartirán clases de programación, algoritmos y lógica para resolución de problemas. Las clases son de hora y media de forma virtual.",
                      "Selección: Presentarás exámenes para demostrar tus habilidades y formar parte del equipo que representará a Oaxaca a nivel nacional."
                      ].map((item, index) => (
                        <motion.li 
                          key={index}
                          variants={{
                            visible: { opacity: 1, x: 0 },
                            hidden: { opacity: 0, x: -20 }
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ol>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-t-4 border-t-ooi-yellow">
                  <CardHeader className="bg-gradient-to-r from-ooi-yellow/10 to-transparent">
                    <CardTitle className="text-xl text-ooi-text-dark">¿Cuáles son los requisitos?</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pt-6">
                    <div className="mb-4 rounded-lg overflow-hidden h-60 relative">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                      >
                        <Image 
                          src="/images/requirements.png" 
                          alt="Requisitos" 
                          fill 
                          className="object-contain transition-all"
                        />
                      </motion.div>
                    </div>
                    <motion.ul 
                      className="list-disc pl-5 space-y-2 text-ooi-text-dark"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        visible: { transition: { staggerChildren: 0.1 } },
                        hidden: {}
                      }}
                    >
                      {[
                      "Haber nacido en el estado de Oaxaca.",
                      "Tener entre 10 y 18 años.",
                      "Estar inscrito(a) en una escuela del estado.",
                      "Cursar primaria, secundaria o hasta el 4to semestre de preparatoria.",
                      "Tener ganas de aprender (no es necesario saber programar antes de empezar)."
                      ].map((item, index) => (
                        <motion.li 
                          key={index}
                          variants={{
                            visible: { opacity: 1, x: 0 },
                            hidden: { opacity: 0, x: -20 }
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Updated Background Only */}
        <section id="benefits" className="py-16 bg-gradient-to-tr from-ooi-light-blue/20 via-ooi-yellow/10 to-ooi-purple/15">
          
          <div className="container mx-auto px-4 relative">
            <motion.h2 
              className="text-3xl font-bold mb-16 text-center text-ooi-dark-blue"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              ¿Qué beneficios obtengo?
            </motion.h2>
            
            <div className="space-y-16">
              {/* Benefit 1 - Conocimiento */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image container */}
                  <div className="md:w-2/5 p-6 flex items-center justify-center bg-gradient-to-br from-ooi-light-blue/30 to-white">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative h-56 w-56"
                    >
                      <Image 
                        src="/images/knowledge.png" 
                        alt="Conocimiento" 
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Content container */}
                  <div className="md:w-3/5 p-8 md:border-l border-gray-100">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <h3 className="text-2xl font-semibold mb-4 text-ooi-second-blue">Conocimiento</h3>
                      <p className="text-ooi-text-dark text-lg mb-4">
                      El súper poder más valioso que vas a obtener es el conocimiento adquirido para resolver y programar diferentes problemas que te ayudarán en tu carrera profesional para tu futuro, dominando este conocimiento puedes llegar a trabajar en las empresas de tecnología más importantes del mundo: ej. Google, Facebook, Microsoft, Tiktok.
                      </p>
                      <ul className="space-y-2 text-ooi-text-dark">
                        <motion.li 
                          className="flex items-center"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          <span className="mr-2 text-ooi-second-blue">✓</span> Aprende lenguajes como C++.
                        </motion.li>
                        <motion.li 
                          className="flex items-center"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <span className="mr-2 text-ooi-second-blue">✓</span> Domina estructuras de datos y algoritmos.
                        </motion.li>
                        <motion.li 
                          className="flex items-center"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                        >
                          <span className="mr-2 text-ooi-second-blue">✓</span> Desarrolla pensamiento lógico matemático.
                        </motion.li>
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Benefit 2 - Reconocimiento (Reversed layout) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto"
              >
                <div className="flex flex-col md:flex-row-reverse">
                  {/* Image container */}
                  <div className="md:w-2/5 p-6 flex items-center justify-center bg-gradient-to-br from-ooi-purple/20 to-white">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative h-56 w-56"
                    >
                      <Image 
                        src="/images/awards.png" 
                        alt="Reconocimiento" 
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Content container */}
                  <div className="md:w-3/5 p-8 md:border-r border-gray-100">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <h3 className="text-2xl font-semibold mb-4 text-ooi-purple">Reconocimiento</h3>
                      <p className="text-ooi-text-dark text-lg mb-4">
                      La posibilidad de poder representar a todo el estado de Oaxaca en la etapa nacional compitiendo contra otros estados. La posibilidad de ganar un lugar en la etapa internacional.
                      </p>
                      <ul className="space-y-2 text-ooi-text-dark">
                        <motion.li 
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          <span className="mr-2 text-ooi-purple">✓</span> Compite a nivel estatal, nacional e internacional.
                        </motion.li>
                        <motion.li 
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <span className="mr-2 text-ooi-purple">✓</span> Obtén experiencia, diplomas y medallas.
                        </motion.li>
                        <motion.li 
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                        >
                          <span className="mr-2 text-ooi-purple">✓</span> Medallas y becas en universidades para los mejores competidores.
                        </motion.li>
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Benefit 3 - Experiencia */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image container */}
                  <div className="md:w-2/5 p-6 flex items-center justify-center bg-gradient-to-br from-ooi-yellow/20 to-white">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative h-56 w-56"
                    >
                      <Image 
                        src="/images/experience.png" 
                        alt="Experiencia" 
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Content container */}
                  <div className="md:w-3/5 p-8 md:border-l border-gray-100">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <h3 className="text-2xl font-semibold mb-4 text-ooi-dark-blue">Experiencia</h3>
                      <p className="text-ooi-text-dark text-lg mb-4">
                        Desarrollarás habilidades de resolución de problemas, mejora continua que te darán ventaja en tu futuro profesional.
                        Si eres seleccionado(a) para representar a Oaxaca competirás en la etapa nacional, donde conocerás a más programadores(as) como tú, que vienen de todos los estados.
                      </p>
                      <ul className="space-y-2 text-ooi-text-dark">
                        <motion.li 
                          className="flex items-center"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          <span className="mr-2 text-ooi-dark-blue">✓</span> Posibilidad de representar a México en la etapa internacional.
                        </motion.li>
                        <motion.li 
                          className="flex items-center"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <span className="mr-2 text-ooi-dark-blue">✓</span> Resuelve problemas complejos.
                        </motion.li>
                        <motion.li 
                          className="flex items-center"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                        >
                          <span className="mr-2 text-ooi-dark-blue">✓</span> Prepárate para seguir desarrollando tu camino profesional.
                        </motion.li>
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* History and Achievements with Animations */}
        <section id="history" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-ooi-dark-blue"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Historia y Logros
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-lg mb-6 text-ooi-text-dark">
                  Desde nuestra fundación, hemos trabajado para impulsar el talento oaxaqueño 
                  en competencias de programación a nivel nacional e internacional.
                </p>
                
                <motion.div 
                  className="grid grid-cols-2 gap-6 mt-8"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="text-center p-4 bg-ooi-second-blue/10 rounded-lg hover:shadow-md transition-all"
                    variants={itemVariants}
                    whileHover={{ y: -5, backgroundColor: "rgba(30, 119, 186, 0.15)" }}
                  >
                    <Counter 
                      from={0} 
                      to={1200} 
                      className="text-4xl font-bold text-ooi-second-blue block" 
                    />
                    <span className="text-sm">Alumnos</span>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-ooi-purple/10 rounded-lg hover:shadow-md transition-all"
                    variants={itemVariants}
                    whileHover={{ y: -5, backgroundColor: "rgba(107, 60, 140, 0.15)" }}
                  >
                    <Counter 
                      from={0} 
                      to={18} 
                      className="text-4xl font-bold text-ooi-purple block" 
                    />
                    <span className="text-sm">Medallistas nacionales</span>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-ooi-yellow/10 rounded-lg hover:shadow-md transition-all"
                    variants={itemVariants}
                    whileHover={{ y: -5, backgroundColor: "rgba(250, 238, 80, 0.15)" }}
                  >
                    <Counter 
                      from={0} 
                      to={12} 
                      duration={1.5}
                      className="text-4xl font-bold text-ooi-dark-blue block" 
                    />
                    <span className="text-sm">Años de trayectoria</span>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-ooi-pink/10 rounded-lg hover:shadow-md transition-all"
                    variants={itemVariants}
                    whileHover={{ y: -5, backgroundColor: "rgba(254, 110, 154, 0.15)" }}
                  >
                    <Counter 
                      from={0} 
                      to={2} 
                      duration={1.5}
                      className="text-4xl font-bold text-ooi-pink block" 
                    />
                    <span className="text-sm">Medallistas internacionales</span>
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Carousel 
                    className="w-full" 
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 3000,
                      }),
                    ]}
                  >
                    <CarouselContent>
                      {[2012, 2013, 2014, 2015, 2016, 2019, 2020, 2021, 2022, 2023, 'navidad'].map((item) => (
                        <CarouselItem key={item}>
                          <motion.div 
                            className="p-1 h-72 md:h-80 relative rounded-lg overflow-hidden"
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Image 
                              src={`/images/history/${item}.jpeg`} 
                              alt={`Logro ${item}`} 
                              fill
                              className="object-contain rounded-md"
                              sizes="(max-width: 768px) 90vw, 45vw"
                            />
                          </motion.div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
                    <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
                  </Carousel>
                </motion.div>
              </motion.div>
              </div>
            </div>
          </section>

        {/* Who We Are Section with More Distinctive Background */}
        <section id="who-we-are" className="py-16 bg-gradient-to-br from-ooi-second-blue/5 via-ooi-light-blue/15 to-ooi-purple/10 relative">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-ooi-second-blue/10 to-transparent rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-ooi-purple/10 to-transparent rounded-full filter blur-3xl"></div>
            
            {/* Optional geometric shapes */}
            <svg className="absolute top-10 left-10 w-32 h-32 text-ooi-second-blue/5" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" fill="currentColor" />
            </svg>
            <svg className="absolute bottom-20 right-20 w-48 h-48 text-ooi-purple/5" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="60" height="60" fill="currentColor" />
            </svg>
          </div>
          
          {/* Content container */}
          <div className="container mx-auto px-4 relative">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-ooi-dark-blue"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              ¿Quiénes Somos?
            </motion.h2>
            
            <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
              {/* Team Image */}
              <motion.div 
                className="lg:w-2/5 mb-10 lg:mb-0 flex items-center justify-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
                  <Image 
                    src="/images/team.png" 
                    alt="Equipo OOI" 
                    width={600}
                    height={600}
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              </motion.div>
              
              {/* Team Content Column */}
              <div className="lg:w-3/5">
                <motion.p 
                  className="mb-8 text-lg text-ooi-text-dark"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Somos un equipo de entusiastas de la programación, educadores y ex-olímpicos 
                  comprometidos con el desarrollo del talento tecnológico en Oaxaca. Nuestra misión
                  es descubrir y potenciar a los futuros líderes en informática del estado.
                </motion.p>
                
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      'name': 'Alejandro García',
                      'image': 'alex',
                      'role': 'Delegado Estatal',
                    },
                    {
                      'name': 'Daniel Gómez',
                      'image': 'daniel',
                      'role': 'Líder de Competencia',
                    },
                    {
                      'name': 'Jose Garfias',
                      'image': 'jose',
                      'role': 'Líder de difusión',
                    },
                    {
                      'name': 'Itzayana García',
                      'image': 'itzayana',
                      'role': 'Líder de OFMI Oaxaca',
                    },
                    {
                      'name': 'Esaú Peralta',
                      'image': 'esau',
                      'role': 'Profesor',
                    },
                    {
                      'name': 'Biniza Ruiz',
                      'image': 'bini',
                      'role': 'Profesora',
                    },
                    {
                      'name': 'Javier Alonso',
                      'image': 'javi',
                      'role': 'Profesor',
                    },
                    {
                      'name': 'Fernando Mauro',
                      'image': 'fer',
                      'role': 'Profesor',
                    },
                    {
                      'name': 'Giovanni Martínez',
                      'image': 'gio',
                      'role': 'Profesor',
                    },
                    {
                      'name': 'Ander López',
                      'image': 'ander',
                      'role': 'Profesor',
                    },
                    {
                      'name': 'Alex Ortega',
                      'image': 'alex-ortega',
                      'role': 'Profesor',
                    },
                    {
                      'name': 'Juliho García',
                      'image': 'juliho',
                      'role': 'Profesor',
                    },
                  ].map((person) => (
                    <motion.div 
                      key={person.image} 
                      className="text-center"
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                    >
                      <motion.div 
                        className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden relative cursor-pointer"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      >
                        <Image 
                          src={`/images/team/${person.image}.jpeg`} 
                          alt={`Persona ${person.name}`} 
                          fill 
                          className="object-cover"
                        />
                      </motion.div>
                      <h3 className="font-semibold text-ooi-dark-blue">{person.name}</h3>
                      <p className="text-sm text-ooi-second-blue">{person.role}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section with Animations */}
        <section id="convocatoria" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold mb-16 text-center text-ooi-dark-blue"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Convocatorias
            </motion.h2>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[2025, 2024, 2023].map((convoYear) => (
                <motion.div 
                  key={convoYear} 
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                >
                  <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all h-full flex flex-col">
                    <motion.div 
                      className="h-72 md:h-80 lg:h-96 relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image 
                        src={`/images/convocatorias/convo-${convoYear}.jpeg`} 
                        alt={`Convocatoria del año ${convoYear}`} 
                        fill
                        className="object-contain transition-transform"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    </motion.div>
                    <CardHeader>
                      <CardTitle className="text-ooi-dark-blue">Convocatoria {convoYear}</CardTitle>
                      <CardDescription className="text-ooi-second-blue">Fecha de publicación: {convoYear}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="line-clamp-3 text-ooi-text-dark">
                        Convocatoria para representar al Estado de Oaxaca en la OMI {convoYear}.
                      </p>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="border-ooi-second-blue text-ooi-second-blue"
                            onClick={() => setSelectedConvo(convoYear)}
                          >
                            Leer más
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl text-ooi-dark-blue">Convocatoria {convoYear}</DialogTitle>
                            <DialogDescription className="text-ooi-second-blue">
                              Convocatoria oficial para el proceso de selección estatal {convoYear}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="relative w-full aspect-[3/4] mt-4">
                            <Image
                              src={`/images/convocatorias/convo-${convoYear}.jpeg`}
                              alt={`Convocatoria completa ${convoYear}`}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 50vw"
                            />
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-ooi-text-dark mb-2">
                              Para más información, puedes contactarnos en <a href="mailto:contacto@omioaxaca.org" className="text-ooi-second-blue hover:underline">contacto@omioaxaca.org</a>
                            </p>
                            {/* <Link href="/registro">
                              <Button className="bg-ooi-second-blue hover:bg-ooi-dark-blue text-white mt-2">
                                Registrarme ahora
                              </Button>
                            </Link> */}
                  </div>
                        </DialogContent>
                      </Dialog>
                      
                      {/* Download Button */}
                      <Link 
                        href={`/images/convocatorias/convo-${convoYear}.jpeg`} 
                        download={`Convocatoria_OOI_${convoYear}.jpeg`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button 
                          variant="outline" 
                          className="border-ooi-purple text-ooi-purple hover:bg-ooi-purple/10"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="mr-2"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                          Descargar
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section with 3D Image */}
        <section id="faq" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-ooi-dark-blue"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Preguntas Frecuentes
            </motion.h2>
            
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Left side - FAQ Accordion */}
              <motion.div 
                className="lg:w-3/5"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      question: "¿Qué es la OOI?",
                      answer: "Nosotros formamos parte del Comité de la Olimpiada Oaxaqueña de Informática y somos un grupo de jóvenes con el ideal de ayudar a mejorar el nivel de competitividad en programación del estado de Oaxaca. Tenemos dos grandes categorías: Así como la OMI es un concurso a nivel nacional, la Olimpiada Oaxaqueña de Informática es la Fase Estatal donde se seleccionan a los mejores programadores para que representen a nuestro estado a nivel nacional. De la misma forma, preparamos a las mejores programadoras para que representen a nuestro estado a nivel nacional en la OFMI."
                    },
                    {
                      question: "¿Qué es la OMI?",
                      answer: "La Olimpiada Mexicana de Informática (OMI) es un concurso a nivel nacional para jóvenes con facilidad para resolver problemas prácticos mediante la lógica y el uso de computadoras, que busca promover el desarrollo tecnológico en México y encontrar a los mejores programadores, quienes formarán la selección mexicana para participar en las próximas Olimpiada Internacional de Informática (IOI). Si quieres saber más de la OMI puedes visitar su página oficial: https://www.olimpiadadeinformatica.org.mx/"
                    },
                    {
                      question: "¿Necesito tener experiencia previa en programación?",
                      answer: "No es necesario tener experiencia previa, aunque es útil contar con conocimientos básicos. Nuestro programa está diseñado para enseñar desde los fundamentos hasta conceptos avanzados."
                    },
                    {
                      question: "¿Cómo son seleccionados los representantes del Estado de Oaxaca en la OMI?",
                      answer: "Los seleccionados para representar el Estado de Oaxaca siempre son los mejores programadores. El proceso es el siguiente: 1) Inscribete a los cursos de la OOI, 2) Crea una cuenta en OmegaUp, será nuestra referencia para ver tu progreso, 3) Los cursos tienen una duración aproximada de 8 meses con dos sesiones semanales, 4) En cada sesión se dejarán problemas de práctica en OmegaUp, 5) Durante los cursos se realizarán 3 mini-concursos de evaluación. Si logras destacar en OmegaUp y en los concursos, es muy probable que seas uno de los seleccionados."
                    },
                    {
                      question: "¿Qué tipo de problemas son?",
                      answer: "La mayoría de los problemas que resolveremos serán del estilo de Programación Competitiva, donde tu ingenio, lógica y conocimiento de matemáticas son esenciales."
                    },
                    {
                      question: "¿Cuál es el costo de participación?",
                      answer: "Participar en los cursos y la selección de la OOI no tiene ningún costo. Hacemos todo el esfuerzo para que tengas todo lo necesario para prepararte como un excelente candidato para representar el Estado de Oaxaca. Sin embargo, no podemos hacernos cargo de los gastos operativos que implica ir a la OMI (transporte y hospedaje). Estamos buscando patrocinadores, pero por el momento es probable que necesites del apoyo de tu escuela, familia y amigos para cubrir estos gastos."
                    },
                    {
                      question: "¿Qué lenguajes de programación se utilizan?",
                      answer: "Principalmente C++, por ser el estándar en competencias de programación. Sin embargo, también se introducen conceptos en Python y Java."
                    },
                    {
                      question: "¿Cuál es el horario de las clases?",
                      answer: "Las clases tienen una duración aproximada de 5 meses, cada semana se imparte 1 sesion de una hora y media a través de videoconferencias."
                    },
                    {
                      question: "¿Puedo participar si no vivo en la ciudad de Oaxaca?",
                      answer: "¡Sí! Ofrecemos modalidad híbrida para estudiantes que viven en otras partes del estado. Las sesiones se transmiten en vivo y contamos con plataformas digitales para el seguimiento."
                    }
                  ].map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <AccordionItem value={`item-${index}`} className="border-ooi-second-blue/30">
                        <AccordionTrigger className="text-ooi-dark-blue hover:text-ooi-second-blue">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-ooi-text-dark">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </motion.div>
              
              {/* Right side - 3D Image */}
              <motion.div 
                className="lg:w-2/5 mt-10 lg:mt-0 flex items-center justify-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div style={{ width: '100%', maxWidth: '300px', height: '300px', position: 'relative' }}>
                  <Image 
                    src="/images/faq.png" 
                    alt="Preguntas Frecuentes" 
                    width={300}
                    height={300}
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              </motion.div>
            </div>
            </div>
          </section>

        {/* Merged Final CTA Section with 3D Image */}
        <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 relative overflow-hidden">
          {/* Animated background elements */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            initial={{ backgroundPosition: "0% 0%" }}
            animate={{ backgroundPosition: "100% 100%" }}
            transition={{ repeat: Infinity, repeatType: "mirror", duration: 20, ease: "linear" }}
            style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, rgba(250, 238, 80, 0.8) 0%, transparent 20%), 
                               radial-gradient(circle at 70% 20%, rgba(254, 110, 154, 0.7) 0%, transparent 20%)`,
              backgroundSize: "80% 80%"
            }}
          />
          
          <div className="relative z-10 container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left side - 3D Image (was on right) */}
              <motion.div 
                className="md:w-1/2 mb-10 md:mb-0 flex items-center justify-center"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div style={{ width: '100%', maxWidth: '300px', height: '300px', position: 'relative' }}>
                  <Image 
                    src="/images/join.png" 
                    alt="Comunidad OOI" 
                    width={300}
                    height={300}
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              </motion.div>
              
              {/* Right side - Text content (was on left) */}
              <motion.div 
                className="md:w-1/2 text-center md:text-left"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-white">¿Listo(a) para ser parte de la OOI?</h2>
                <p className="text-xl mb-6 text-white/90">
                  La OOI es más que una competencia, es una comunidad donde desarrollarás 
                  habilidades que te acompañarán toda la vida. Únete y empieza tu camino.
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex justify-center md:justify-start"
                >
                  <Link href="/registro">
                    <motion.div
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button size="lg" className="bg-ooi-yellow text-ooi-dark-blue hover:bg-white font-semibold">
                        Inscríbete Ahora
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer with Animations */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid md:grid-cols-5 gap-8 mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={itemVariants}>
                <h3 className="text-white text-lg font-semibold mb-4">OOI</h3>
                <p className="text-sm">
                La Olimpiada Oaxaqueña de Informática y todas las personas que lo involucran, forman una asociación sin fines de lucro, por lo que todos los cursos, materiales, competencia e información son y siempre serán completamente gratis.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-white text-lg font-semibold mb-4">Enlaces</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    {
                      title: "Únete a nuestro Discord",
                      url: "https://discord.gg/VjHmAqKfwh"
                    },
                    {
                      title: "Fechas Importantes",
                      url: "/calendario"
                    },
                    {
                      title: "Politica de privacidad",
                      url: "/politica-de-privacidad"
                    },
                    {
                      title: "Términos y condiciones",
                      url: "/terminos-y-condiciones"
                    },
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      whileHover={{ x: 5, color: "#ffffff" }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={item.url} 
                            className="hover:text-white">
                        {item.title}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              {/* New additional links column */}
              <motion.div variants={itemVariants}>
                <h3 className="text-white text-lg font-semibold mb-4">Recursos</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    {
                      title: "Material de Estudio",
                      url: "https://wiki.omioaxaca.org/"
                    },
                    {
                      title: "Github",
                      url: "https://github.com/omioaxaca"
                    },
                    {
                      title: "Cursos",
                      url: "https://www.youtube.com/channel/UC1vuv9F35Nlsg4X__AK6AZw/playlists"
                    },
                    {
                      title: "Preguntas Frecuentes",
                      url: "https://wiki.omioaxaca.org/es/faq"
                    },
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      whileHover={{ x: 5, color: "#ffffff" }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={item.url}
                            target="_blank"
                            className="hover:text-white">
                        {item.title}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h3 className="text-white text-lg font-semibold mb-4">Contacto</h3>
                <ul className="space-y-2 text-sm">
                  <motion.li 
                    className="flex items-center gap-2"
                    whileHover={{ x: 5, color: "#ffffff" }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <span>contacto@omioaxaca.org</span>
                  </motion.li>
                </ul>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h3 className="text-white text-lg font-semibold mb-4">Síguenos</h3>
                <div className="flex gap-4">
                  {[
                    {
                      name: "Facebook",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                      url: "https://www.facebook.com/OMIOaxaca"
                    },
                    {
                      name: "Twitter",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4.77a5.07 5.07 0 0 0 5.07-5.07c0-1.21-.32-2.34-.89-3.3z"/></svg>,
                      url: "https://twitter.com/omioaxaca"
                    },
                    {
                      name: "Instagram",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
                      url: "https://www.instagram.com/omioaxaca/"
                    },
                    {
                      name: "Youtube",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M22.54 6.42A2.5 2.5 0 0 0 20.12 4H3.88A2.5 2.5 0 0 0 1.46 6.42C1.16 7.68 1 9.31 1 12s.16 4.32 .46 5.58A2.5 2.5 0 0 0 3.88 20h16.24a2.5 2.5 0 0 0 2.42-2.42C22.84 16.32 23 14.69 23 12s-.16-4.32-.46-5.58z"/><polygon points="9.54,15.54 9.54,8.46,15,12"/></svg>,
                      url: "https://www.youtube.com/channel/UC1vuv9F35Nlsg4X__AK6AZw/"
                    },
                    {
                      name: "Discord",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-discord"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.2c3.4-1 5.6-1 9 0"/><path d="M7.5 16.8c3.4 1 5.6 1 9 0"/><path d="M3 7.2v9.6c0 1 .8 1.8 1.8 1.8h3l1.8 3h4.8l1.8-3h3c1 0 1.8-.8 1.8-1.8V7.2c0-1-.8-1.8-1.8-1.8H4.8C3.8 5.4 3 6.2 3 7.2z"/></svg>,
                      url: "https://discord.gg/VjHmAqKfwh"
                    },
                    {
                      name: "Github",
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
                      url: "https://github.com/omioaxaca"
                    },

                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 text-gray-300 hover:text-white p-2 rounded-full hover:bg-ooi-second-blue transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="border-t border-gray-800 pt-8 text-center text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p>© {new Date().getFullYear()} Olimpiada Oaxaqueña de Informática. Todos los derechos reservados.</p>
            </motion.div>
          </div>
        </footer>
      </div>
    </>
  );
} 