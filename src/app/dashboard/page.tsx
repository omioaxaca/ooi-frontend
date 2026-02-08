"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Video, FileText, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WithConstructionBanner } from "@/components/with-construction-banner";
import { fetchUserNotifications, mapBackendNotificationToFrontendNotification } from "@/services/notificationService";
import type { NotificationView } from "@/types/dashboard/notification";

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);

  useEffect(() => {
    // Get user info from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserName(user.firstName || 'estudiante');
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    // Fetch notifications
    const getNotifications = async () => {
      try {
        setIsLoadingNotifications(true);
        const backendNotifications = await fetchUserNotifications();
        const mappedNotifications = backendNotifications.map(notification =>
          mapBackendNotificationToFrontendNotification(notification)
        );
        setNotifications(mappedNotifications);
        setNotificationsError(null);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setNotificationsError("No se pudieron cargar las notificaciones.");
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    getNotifications();
  }, []);

  // Get priority color based on notification priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return "bg-red-500";
      case 'MEDIUM':
        return "bg-yellow-500";
      case 'LOW':
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  // Format date from ISO string to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <SidebarTrigger />
      <AppSidebar />
      <SidebarInset>
        <WithConstructionBanner isUnderConstruction={false}>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card id="announcements-card">
                <CardHeader>
                  <CardTitle className="text-lg text-ooi-dark-blue flex items-center justify-between">
                    Anuncios
                    <button
                      onClick={() => {
                        const announcementsEl = document.getElementById('announcements-card');
                        if (announcementsEl) {
                          announcementsEl.style.display = 'none';
                        }
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Dismiss announcements"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingNotifications ? (
                    <div className="text-center text-gray-500 py-4">
                      Cargando anuncios...
                    </div>
                  ) : notificationsError ? (
                    <div className="text-center text-red-500 py-4">
                      {notificationsError}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.length > 0 ? (
                        notifications
                          .slice(0, 3) // Limit to first 3 notifications
                          .map((notification) => (
                            <div
                              key={notification.id}
                              className="flex gap-4 border-b pb-3 last:border-0"
                            >
                              <div
                                className={`w-1 rounded-full self-stretch ${getPriorityColor(notification.priority)}`}
                              />
                              <div className="flex-1">
                                <h3 className="font-medium text-sm">
                                  {notification.title}
                                  {notification.pinned && (
                                    <span className="ml-2 text-xs py-1 px-2 bg-blue-100 text-blue-800 rounded-full">
                                      Destacado
                                    </span>
                                  )}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {formatDate(notification.initialDate)}
                                  {notification.finalDate && ` - ${formatDate(notification.finalDate)}`}
                                </p>
                              </div>
                              {notification.redirectionURL && (
                                <Link
                                  href={notification.redirectionURL}
                                  className="text-sm text-ooi-second-blue hover:underline flex items-center self-center whitespace-nowrap"
                                >
                                  Abrir <ChevronRight className="h-4 w-4" />
                                </Link>
                              )}
                            </div>
                          ))
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          No hay anuncios disponibles
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex justify-end mt-4">
                    <Link
                      href="/dashboard/notifications"
                      className="text-sm text-ooi-second-blue hover:underline flex items-center"
                    >
                      Ver todos <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader className="bg-gradient-to-r from-ooi-light-blue/20 to-transparent">
                  <CardTitle className="text-2xl text-ooi-dark-blue">
                    ¡Bienvenido{userName ? `, ${userName}` : ""}!
                  </CardTitle>
                  <CardDescription>
                    Nos complace darte la bienvenida. ¡Estamos muy emocionados
                    por la olimpiada de este año!
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">


                  <p className="mb-4">
                    Bienvenido olímpico(a), tu viaje de preparación para
                    convertirte en el/la mejor programador(a) del estado ha
                    comenzado. A continuación encontrarás los detalles de cómo
                    se llevará a cabo el proceso de entrenamiento y selección
                    este año.
                  </p>

                  <p className="mb-4">
                    La plataforma (todavía en construcción) te proporciona todos
                    los recursos necesarios para tu preparación como olímpico.
                    Comienza explorando los materiales de clase y completando
                    las primeras actividades.
                  </p>

                  <p>
                    <strong className="text-ooi-dark-blue">OMI&nbsp;</strong>
                  </p>
                  <ul className="space-y-4 mt-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-ooi-second-blue/20 flex items-center justify-center text-ooi-second-blue mr-3 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-ooi-second-blue"></div>
                      </div>
                      <span>
                        A lo largo de un periodo de ocho meses se te impartirán
                        cursos en línea, resolverás muchos problemas y
                        aprenderás cosas nuevas.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-ooi-second-blue/20 flex items-center justify-center text-ooi-second-blue mr-3 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-ooi-second-blue"></div>
                      </div>
                      <span>
                        Todo ese conocimiento será tu aliado para conquistar las
                        diferentes fases y eliminatorias del entrenamiento para
                        asegurar tu lugar como uno(a) de los 4 seleccionados
                        estatales.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-ooi-second-blue/20 flex items-center justify-center text-ooi-second-blue mr-3 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-ooi-second-blue"></div>
                      </div>
                      <span>
                        En cada fase tendrás la posibilidad de acumular puntos,
                        los cuales se suman con la resolución de ejercicios que
                        se asignan después de cada clase en línea.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-ooi-second-blue/20 flex items-center justify-center text-ooi-second-blue mr-3 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-ooi-second-blue"></div>
                      </div>
                      <span>
                        Después de una o dos fases se realiza una eliminatoria
                        que consta de un examen general, en este examen podrás
                        obtener más puntos para asegurar tu lugar ya que se
                        eliminaran a los competidores que tengan menor puntaje
                        en la tabla.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-ooi-second-blue/20 flex items-center justify-center text-ooi-second-blue mr-3 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-ooi-second-blue"></div>
                      </div>
                      <span>
                        Los(as) 4 mejores olímpicos(as) con mayor puntaje al
                        final de todas las fases de la olimpiada serán los
                        seleccionados para participar en la etapa nacional
                        (Olimpiada Mexicana de Informática 2026).
                      </span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    <strong className="text-ooi-purple">OFMI&nbsp;</strong>
                  </p>
                  <ul className="space-y-3 ml-4 mt-2 list-disc text-gray-700">
                    <li className="pl-2">
                      A lo largo de un periodo de ocho meses se te impartirán
                      cursos en línea, resolverás muchos problemas y
                      aprenderás cosas nuevas.
                    </li>
                    <li className="pl-2">
                      Tendremos clases de algoritmos y también clases de
                      sesiones de habilidades personales y sociales.
                    </li>
                    <li className="pl-2">Podrás participar en la OFMI 2026.</li>
                  </ul>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link href="/dashboard/calendar">
                      <Button className="bg-ooi-second-blue hover:bg-ooi-dark-blue flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Ver calendario
                      </Button>
                    </Link>
                    {/* <Link href="/dashboard/recordings">
                      <Button variant="outline" className="border-ooi-second-blue text-ooi-second-blue hover:bg-ooi-second-blue/10 flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Clases grabadas
                      </Button>
                    </Link> */}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-ooi-dark-blue flex items-center justify-between">
                    Próximos pasos
                    <Link
                      href="/dashboard/calendar"
                      className="text-sm text-ooi-second-blue hover:underline flex items-center"
                    >
                      Ver calendario <ChevronRight className="h-4 w-4" />
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">Te invitamos a seguir los siguientes pasos para dar comienzo a tu viaje en la olimpiada de informática:</p>
                  </div>

                  <div className="space-y-5">

                    {/* Step 1 */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-ooi-second-blue/10 p-3 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-ooi-second-blue flex items-center justify-center text-white font-medium mr-3">
                          1
                        </div>
                        <div>
                          <h3 className="font-medium text-ooi-dark-blue">Crea tu usuario de OmegaUp</h3>
                          <p className="text-xs text-gray-600">• Requerido</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-700 mb-2">
                          Si aun no tienes un usuario, ingresa a <a href="https://www.omegaup.com" className="text-ooi-second-blue hover:underline">www.omegaup.com</a> y crea una cuenta.
                        </p>
                        <p className="text-xs text-gray-600 mb-3">
                          Luego, completa el formulario con tus datos de usuario.
                        </p>
                        <Button size="sm" className="w-full bg-ooi-second-blue hover:bg-ooi-blue-hover" asChild>
                          <a href="https://www.omegaup.com/login" target="_blank" rel="noopener noreferrer">
                            Registrar usuario
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-ooi-second-blue/10 p-3 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-ooi-second-blue flex items-center justify-center text-white font-medium mr-3">
                          2
                        </div>
                        <div>
                          <h3 className="font-medium text-ooi-dark-blue">Examen de evaluación diagnóstica en línea</h3>
                          <p className="text-xs text-gray-600">7 de marzo - 7 de abril de 2026 • Requerido</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-700 mb-2">
                          Este examen es exclusivamente de lógica. El objetivo es evaluar tus habilidades lógicas y matemáticas al resolver problemas computacionales.
                          Podras realizar el examen en cualquier momento desde que se encuentre disponible hasta el 7 de abril.
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1 mb-3">
                          <li>• Ingresa el mismo correo electrónico que usaste en tu registro a la olimpiada.</li>
                          <li>• El examen contiene 20 preguntas. Debes contestar correctamente al menos 13 preguntas para continuar en la olimpiada.</li>
                          <li>• Debes realizar el examen por tu cuenta, sin ayuda de nadie más.</li>
                        </ul>
                        <Button size="sm" className="w-full bg-ooi-second-blue hover:bg-ooi-blue-hover">
                          <a href="/dashboard/evaluations" target="_blank" rel="noopener noreferrer">
                            Realizar examen
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-ooi-second-blue/10 p-3 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-ooi-second-blue flex items-center justify-center text-white font-medium mr-3">
                          3
                        </div>
                        <div>
                          <h3 className="font-medium text-ooi-dark-blue">Selecciona tu horario de clases</h3>
                          <p className="text-xs text-gray-600">7 Marzo - 7 de Abril de 2026 • Requerido</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-700 mb-2">
                          Llena el formulario para elegir el horario de clases de tu preferencia.
                        </p>
                        <p className="text-xs text-gray-600 italic mb-3">
                          Nota: Por temas de logística no podemos asegurar que el horario que elijas sea el horario final de las clases, se contabilizaran los votos y el horario con mayor votación será el elegido.
                        </p>
                        <Button size="sm" className="w-full bg-ooi-second-blue hover:bg-ooi-blue-hover">
                          <a href="https://forms.office.com/e/xSbdtdWBBH" target="_blank" rel="noopener noreferrer">
                            Seleccionar horario
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-ooi-second-blue/10 p-3 flex items-center">
                        <div className="h-8 w-8 rounded-full bg-ooi-second-blue flex items-center justify-center text-white font-medium mr-3">
                          4
                        </div>
                        <div>
                          <h3 className="font-medium text-ooi-dark-blue">Asiste a la bienvenida en línea</h3>
                          <p className="text-xs text-gray-600">28 de Febrero de 2026 • 11:00 A.M. • Requerido</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-700 mb-3">
                          Te esperamos para la sesión de bienvenida en línea donde conocerás más sobre la olimpiada.
                        </p>
                        <Button size="sm" className="w-full bg-ooi-second-blue hover:bg-ooi-blue-hover">
                          <a href="https://omioaxaca.org/bienvenida-2026" target="_blank" rel="noopener noreferrer">
                            Unirse a la bienvenida 2026
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Optional Steps */}
                    <div className="mt-4">
                      <h3 className="font-medium text-sm text-ooi-dark-blue mb-3">Pasos opcionales</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="h-6 w-6 rounded-full bg-ooi-purple/20 flex items-center justify-center text-ooi-purple text-xs font-medium">
                            5
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Revisa el calendario</h4>
                            <p className="text-xs text-gray-600 mb-2">Consulta todas las actividades programadas</p>
                            <Button size="sm" variant="outline" className="text-xs h-7 border-ooi-purple text-ooi-purple hover:bg-ooi-purple/10" asChild>
                              <Link href="/dashboard/calendar">Ver calendario</Link>
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="h-6 w-6 rounded-full bg-ooi-purple/20 flex items-center justify-center text-ooi-purple text-xs font-medium">
                            6
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Prepárate para las clases</h4>
                            <p className="text-xs text-gray-600 mb-2">Comienza tu preparación anticipada con estos recursos:</p>
                            <div className="space-y-2">
                              <Button size="sm" variant="outline" className="text-xs h-7 w-full border-ooi-purple text-ooi-purple hover:bg-ooi-purple/10" asChild>
                                <a href="https://youtube.com/playlist?list=PLLLsY3RQV2bhHhhoDoIfEEgRJGmjZBTii&si=89ogv39b1zY27S2V" target="_blank" rel="noopener noreferrer">
                                  Cursos anteriores
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs h-7 w-full border-ooi-purple text-ooi-purple hover:bg-ooi-purple/10" asChild>
                                <a href="https://omegaup.com/course/Curso-OMI/" target="_blank" rel="noopener noreferrer">
                                  Ejercicios introductorios
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </WithConstructionBanner>
      </SidebarInset>
    </>
  );
}
