"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/nav-bar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsAndConditions() {
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
            Términos y Condiciones
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
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">1. Aceptación de los términos</h2>
                <p>
                  Al inscribirte y participar en la Olimpiada Oaxaqueña de Informática (OOI), aceptas cumplir con estos términos y condiciones. Si eres menor de edad, estos términos deberán ser revisados y aceptados por tu padre, madre o tutor legal.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">2. Elegibilidad</h2>
                <p>Para participar en la OOI, debes cumplir con los siguientes requisitos:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Estar inscrito en alguna institución educativa de nivel medio o medio superior en el estado de Oaxaca.</li>
                  <li>Ser menor de 20 años al momento de la competencia internacional del año en curso (IOI).</li>
                  <li>Estar cursando a lo más el segundo año de preparatoria o su equivalente.</li>
                  <li>No haber participado anteriormente en dos olimpiadas internacionales (IOI).</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">3. Proceso de inscripción</h2>
                <p>
                  La inscripción se realiza a través de nuestro sitio web oficial. Es responsabilidad del participante o de su tutor proporcionar información veraz y completa. La OOI se reserva el derecho de verificar la información proporcionada y descalificar a quienes no cumplan con los requisitos o proporcionen información falsa.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">4. Programa de entrenamiento</h2>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>El participante se compromete a asistir regularmente a las sesiones de entrenamiento programadas.</li>
                  <li>El material educativo proporcionado es para uso exclusivo del programa y no debe ser distribuido sin autorización.</li>
                  <li>Es responsabilidad del participante contar con el equipo y conexión a internet necesarios para las sesiones virtuales.</li>
                  <li>La OOI se reserva el derecho de modificar el calendario de actividades previa notificación.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">5. Proceso de selección</h2>
                <p>
                  La selección de los representantes estatales se basa en:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Desempeño durante el periodo de entrenamiento.</li>
                  <li>Resultados en los exámenes y concursos internos.</li>
                  <li>Participación activa y constante.</li>
                  <li>Cumplimiento del código de conducta.</li>
                </ul>
                <p className="mt-3">
                  Las decisiones del comité organizador son definitivas e inapelables.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">6. Código de conducta</h2>
                <p>
                  Todos los participantes deben:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Comportarse con respeto y honestidad en todas las actividades.</li>
                  <li>No incurrir en plagio o copia durante exámenes y tareas.</li>
                  <li>Mantener una comunicación respetuosa con instructores y compañeros.</li>
                  <li>No compartir soluciones de problemas de competencia con otros participantes durante evaluaciones.</li>
                  <li>Respetar la diversidad y promover un ambiente inclusivo.</li>
                </ul>
                <p className="mt-3">
                  El incumplimiento del código de conducta puede resultar en la descalificación del participante.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">7. Propiedad intelectual</h2>
                <p>
                  El contenido del programa, incluyendo materiales didácticos, problemas y soluciones, están protegidos por derechos de autor. Los participantes pueden utilizar estos materiales para su aprendizaje personal, pero no pueden redistribuirlos ni utilizarlos con fines comerciales.
                </p>
                <p className="mt-3">
                  Las soluciones y códigos desarrollados por los participantes durante el programa son propiedad intelectual de cada participante, aunque la OOI se reserva el derecho de utilizarlos con fines educativos.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">8. Uso de imagen</h2>
                <p>
                  Al participar en la OOI, autorizas el uso de tu imagen en fotografías y videos tomados durante los eventos y actividades para fines promocionales, educativos y de difusión. Si no deseas que tu imagen sea utilizada, deberás notificarlo por escrito al comité organizador.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">9. Limitación de responsabilidad</h2>
                <p>
                  La OOI no se hace responsable por:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Problemas técnicos que puedan afectar la participación en actividades virtuales.</li>
                  <li>Pérdida de objetos personales durante eventos presenciales.</li>
                  <li>Accidentes que puedan ocurrir durante el traslado a eventos o durante los mismos.</li>
                </ul>
                <p className="mt-3">
                  Para eventos presenciales, los participantes menores de edad deberán contar con la autorización firmada de sus padres o tutores.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold text-ooi-second-blue mb-4">10. Modificaciones a los términos</h2>
                <p>
                  La OOI se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios serán notificados a través de nuestro sitio web oficial y/o por correo electrónico.
                </p>
                <p className="mt-3">
                  Para cualquier duda o aclaración sobre estos términos, puedes contactarnos en <a href="mailto:contacto@omioaxaca.org" className="text-ooi-second-blue hover:underline">contacto@omioaxaca.org</a>.
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