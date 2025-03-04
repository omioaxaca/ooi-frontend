"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="pt-16 md:pt-20 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h1 
            className="text-3xl font-bold mb-8 text-center text-ooi-dark-blue"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Política de Privacidad
          </motion.h1>
          
          <motion.div
            className="bg-white rounded-lg shadow-md p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="prose max-w-none text-ooi-text-dark">
              <p className="font-semibold text-lg mb-6">Última actualización: {new Date().toLocaleDateString('es-MX')}</p>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">1. Introducción</h2>
                <p>
                  La Olimpiada Oaxaqueña de Informática (en adelante "OOI") se compromete a proteger la privacidad de todos sus participantes, especialmente considerando que muchos son menores de edad. Esta política describe cómo recopilamos, utilizamos y protegemos tu información personal.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">2. Información que recopilamos</h2>
                <p>Podemos recopilar los siguientes tipos de información:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Información de identificación personal:</strong> Nombre, apellidos, fecha de nacimiento, correo electrónico, número telefónico y escuela de procedencia.</li>
                  <li><strong>Información académica:</strong> Nivel educativo, grado escolar, y conocimientos previos en programación.</li>
                  <li><strong>Datos de tutores:</strong> Para participantes menores de edad, requerimos información de contacto de padres o tutores legales.</li>
                  <li><strong>Desempeño en competencias:</strong> Resultados en concursos, pruebas y actividades realizadas durante el programa.</li>
                  <li><strong>Material multimedia:</strong> Fotografías y videos tomados durante eventos, clases y competencias.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">3. Uso de la información</h2>
                <p>Utilizamos tu información personal para:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Gestionar tu participación en la OOI y sus programas educativos.</li>
                  <li>Comunicarnos contigo sobre clases, eventos y actividades relacionadas.</li>
                  <li>Evaluar tu progreso y seleccionar representantes para competencias estatales y nacionales.</li>
                  <li>Generar estadísticas y reportes de participación (de forma anónima y agregada).</li>
                  <li>Promocionar y difundir las actividades de la OOI a través de nuestros canales oficiales.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">4. Compartir información</h2>
                <p>
                  No vendemos ni arrendamos tu información personal a terceros. Sin embargo, podemos compartir información con:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Comités organizadores de la Olimpiada Mexicana de Informática (OMI) para participantes que avancen a ese nivel.</li>
                  <li>Instituciones educativas asociadas que colaboran en la realización de eventos y actividades.</li>
                  <li>Autoridades educativas cuando existe un requerimiento legal para hacerlo.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">5. Protección de datos de menores</h2>
                <p>
                  Reconocemos la importancia de proteger la privacidad de los menores. Por ello:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Requerimos consentimiento de los padres o tutores para la participación de menores de 18 años.</li>
                  <li>Limitamos la información recopilada de los menores a lo estrictamente necesario.</li>
                  <li>Implementamos medidas adicionales de seguridad para proteger sus datos.</li>
                  <li>Los padres o tutores pueden solicitar acceso, modificación o eliminación de los datos de sus hijos.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">6. Derechos ARCO</h2>
                <p>
                  Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos personales. Para ejercer estos derechos, envía una solicitud a <a href="mailto:contacto@omioaxaca.org" className="text-ooi-second-blue hover:underline">contacto@omioaxaca.org</a>.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">7. Cambios a esta política</h2>
                <p>
                  Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios significativos a través de nuestro sitio web o por correo electrónico.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">8. Contacto</h2>
                <p>
                  Si tienes preguntas o inquietudes sobre esta política de privacidad, contáctanos en <a href="mailto:contacto@omioaxaca.org" className="text-ooi-second-blue hover:underline">contacto@omioaxaca.org</a>.
                </p>
              </section>
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/">
                <Button className="bg-ooi-second-blue hover:bg-ooi-dark-blue text-white">
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* Simple footer */}
      <footer className="bg-gray-900 text-white py-6 text-center text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Olimpiada Oaxaqueña de Informática. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
} 