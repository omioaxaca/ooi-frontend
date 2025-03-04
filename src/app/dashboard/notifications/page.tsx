"use client";

import { useState } from "react";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample notification data
  const notifications = [
    {
      id: 1,
      title: "Inicio de clases para el curso 2025",
      message: "Las clases comienzan el 24 de marzo. Prepara tu equipo y material de estudio. Te recomendamos revisar los materiales previos para estar mejor preparado.",
      date: "12 marzo, 2025",
      read: false,
      type: "important",
      category: "class",
    },
    {
      id: 2,
      title: "Sesión de introducción a algoritmos",
      message: "Tendremos una sesión especial para introducir conceptos básicos de algoritmos el día 26 de marzo.",
      date: "10 marzo, 2025",
      read: true,
      type: "regular",
      category: "class",
    },
    {
      id: 3,
      title: "Primera evaluación programada",
      message: "La primera evaluación ha sido programada para el 10 de abril. Revisa los temas que se evaluarán en la sección de Evaluaciones.",
      date: "8 marzo, 2025",
      read: false,
      type: "important",
      category: "exam",
    },
    {
      id: 4,
      title: "Nueva tarea disponible",
      message: "Se ha publicado una nueva tarea sobre algoritmos básicos. La fecha límite es el 31 de marzo.",
      date: "7 marzo, 2025",
      read: true,
      type: "regular",
      category: "homework",
    },
    {
      id: 5,
      title: "Actualización de plataforma",
      message: "Hemos actualizado algunas funciones de la plataforma para mejorar tu experiencia de aprendizaje.",
      date: "5 marzo, 2025",
      read: true,
      type: "info",
      category: "system",
    },
  ];

  // Filter notifications based on search query
  const filteredNotifications = notifications.filter(notification => 
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mark notification as read
  const markAsRead = (id: number) => {
    // In a real app, you would update this in your backend
    console.log(`Marked notification ${id} as read`);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Notifications</BreadcrumbPage>
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
            className="flex justify-between items-center mb-6"
          >
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-ooi-second-blue" />
              <h1 className="text-2xl font-semibold text-ooi-dark-blue">Notificaciones</h1>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar notificaciones..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unread">No leídas</TabsTrigger>
              <TabsTrigger value="important">Importantes</TabsTrigger>
              <TabsTrigger value="class">Clases</TabsTrigger>
              <TabsTrigger value="exam">Exámenes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <motion.div 
                          key={notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50/50' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-medium ${!notification.read ? 'text-ooi-dark-blue' : 'text-gray-700'}`}>
                              {notification.title}
                              {!notification.read && (
                                <Badge variant="outline" className="ml-2 text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">
                                  Nuevo
                                </Badge>
                              )}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {notification.date}
                            </span>
                          </div>
                          <p className={`text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <div className="mt-2 flex gap-2">
                            {notification.type === 'important' && (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                Importante
                              </Badge>
                            )}
                            {notification.category === 'class' && (
                              <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                Clase
                              </Badge>
                            )}
                            {notification.category === 'exam' && (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                Examen
                              </Badge>
                            )}
                            {notification.category === 'homework' && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                Tarea
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No se encontraron notificaciones con tu búsqueda
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="unread" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredNotifications.filter(n => !n.read).length > 0 ? (
                      filteredNotifications
                        .filter(notification => !notification.read)
                        .map((notification) => (
                          <motion.div 
                            key={notification.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 hover:bg-gray-50 bg-blue-50/50"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-medium text-ooi-dark-blue">
                                {notification.title}
                                <Badge variant="outline" className="ml-2 text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">
                                  Nuevo
                                </Badge>
                              </h3>
                              <span className="text-xs text-gray-500">
                                {notification.date}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800">
                              {notification.message}
                            </p>
                            <div className="mt-2 flex gap-2">
                              {notification.type === 'important' && (
                                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                  Importante
                                </Badge>
                              )}
                              {notification.category === 'class' && (
                                <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                  Clase
                                </Badge>
                              )}
                              {notification.category === 'exam' && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                  Examen
                                </Badge>
                              )}
                              {notification.category === 'homework' && (
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Tarea
                                </Badge>
                              )}
                            </div>
                          </motion.div>
                        ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No tienes notificaciones sin leer
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Similar structure for other tabs (important, class, exam) */}
            <TabsContent value="important" className="mt-6">
              {/* Filter for important notifications */}
            </TabsContent>
            
            <TabsContent value="class" className="mt-6">
              {/* Filter for class notifications */}
            </TabsContent>
            
            <TabsContent value="exam" className="mt-6">
              {/* Filter for exam notifications */}
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 