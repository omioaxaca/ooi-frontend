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
import { ChevronRight, Calendar, Video, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WithConstructionBanner } from "@/components/with-construction-banner";

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  
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
  }, []);

  const announcements = [
    {
      title: "Inicio de clases para el curso 2025",
      description: "Las clases comienzan el 24 de marzo. Prepara tu equipo y material de estudio.",
      date: "12 marzo, 2025",
      priority: "high",
    },
    {
      title: "Sesión de introducción a algoritmos",
      description: "Tendremos una sesión especial para introducir conceptos básicos de algoritmos.",
      date: "26 marzo, 2025",
      priority: "medium",
    },
    {
      title: "Actualización de material de estudio",
      description: "Hemos añadido nuevos recursos para ayudarte a prepararte mejor.",
      date: "10 marzo, 2025",
      priority: "low",
    },
  ];

  const nextEvents = [
    {
      title: "Clase de Introducción",
      date: "24 marzo, 2025",
      time: "16:00 - 18:00",
      type: "class",
      icon: Video,
    },
    {
      title: "Tarea: Algoritmos Básicos",
      date: "31 marzo, 2025",
      type: "homework",
      icon: FileText,
    },
    {
      title: "Sesión de Preguntas",
      date: "2 abril, 2025",
      time: "17:00 - 18:00",
      type: "meeting",
      icon: Calendar,
    },
  ];

  return (
    <>
      <SidebarTrigger />
      <AppSidebar />
      <SidebarInset>
        <WithConstructionBanner isUnderConstruction={false}>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
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
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6">
                <CardHeader className="bg-gradient-to-r from-ooi-light-blue/20 to-transparent">
                  <CardTitle className="text-2xl text-ooi-dark-blue">
                    ¡Bienvenido{userName ? `, ${userName}` : ''}!
                  </CardTitle>
                  <CardDescription>
                    Estamos emocionados de tenerte en la Olimpiada Oaxaqueña de Informática 2025
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="mb-4">
                    La plataforma te proporciona todos los recursos necesarios para tu preparación como olímpico. 
                    Comienza explorando los materiales de clase y completando las primeras actividades.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link href="/dashboard/calendar">
                      <Button className="bg-ooi-second-blue hover:bg-ooi-dark-blue flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Ver calendario
                      </Button>
                    </Link>
                    <Link href="/dashboard/recordings">
                      <Button variant="outline" className="border-ooi-second-blue text-ooi-second-blue hover:bg-ooi-second-blue/10 flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Clases grabadas
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-ooi-dark-blue flex items-center justify-between">
                      Anuncios
                      <Link href="/dashboard/notifications" className="text-sm text-ooi-second-blue hover:underline flex items-center">
                        Ver todos <ChevronRight className="h-4 w-4" />
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {announcements.map((announcement, i) => (
                        <div key={i} className="flex gap-4 border-b pb-3 last:border-0">
                          <div className={`w-1 rounded-full self-stretch ${
                            announcement.priority === 'high' ? 'bg-red-500' : 
                            announcement.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div>
                            <h3 className="font-medium text-sm">{announcement.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{announcement.description}</p>
                            <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
                          </div>
                        </div>
                      ))}
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
                      Próximos eventos
                      <Link href="/dashboard/calendar" className="text-sm text-ooi-second-blue hover:underline flex items-center">
                        Ver calendario <ChevronRight className="h-4 w-4" />
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {nextEvents.map((event, i) => (
                        <div key={i} className="flex gap-4 border-b pb-3 last:border-0">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-ooi-second-blue">
                            <event.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{event.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{event.date}{event.time ? ` • ${event.time}` : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-ooi-dark-blue">
                    Próximos pasos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ooi-second-blue text-ooi-second-blue text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium text-base">Completa tu perfil</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Asegúrate de que toda tu información personal está correcta y actualizada.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ooi-second-blue text-ooi-second-blue text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium text-base">Explora el material de estudio</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Familiarízate con los recursos disponibles en la sección de Syllabus.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ooi-second-blue text-ooi-second-blue text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium text-base">Resuelve tu primer problema</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Dirígete a la sección de Ejercicios y comienza con los problemas para principiantes.
                        </p>
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
