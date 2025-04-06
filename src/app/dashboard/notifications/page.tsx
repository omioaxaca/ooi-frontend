"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bell, Search, ExternalLink } from "lucide-react";
import { WithConstructionBanner } from "@/components/with-construction-banner";
import { fetchUserNotifications, mapBackendNotificationToFrontendNotification } from "@/services/notificationService";
import type { NotificationView } from "@/types/dashboard/notification";
import Link from "next/link";

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch notifications on component mount
  useEffect(() => {
    const getNotifications = async () => {
      try {
        setIsLoading(true);
        const backendNotifications = await fetchUserNotifications();
        const mappedNotifications = backendNotifications.map(notification => 
          mapBackendNotificationToFrontendNotification(notification)
        );
        setNotifications(mappedNotifications);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("No se pudieron cargar las notificaciones. Por favor, intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    
    getNotifications();
  }, []);

  // Filter notifications based on search query
  const filteredNotifications = notifications.filter(notification => 
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get priority color based on notification priority
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Alta</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Media</Badge>;
      case 'LOW':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Baja</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
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
                <TabsTrigger value="HIGH">Prioridad Alta</TabsTrigger>
                <TabsTrigger value="MEDIUM">Prioridad Media</TabsTrigger>
                <TabsTrigger value="LOW">Prioridad Baja</TabsTrigger>
                <TabsTrigger value="pinned">Destacadas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="p-8 text-center text-gray-500">
                        Cargando notificaciones...
                      </div>
                    ) : error ? (
                      <div className="p-8 text-center text-red-500">
                        {error}
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredNotifications.length > 0 ? (
                          filteredNotifications.map((notification) => (
                            <motion.div 
                              key={notification.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className={`p-4 hover:bg-gray-50 ${notification.pinned ? 'bg-blue-50/50' : ''}`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h3 className={`font-medium ${notification.pinned ? 'text-ooi-dark-blue' : 'text-gray-700'}`}>
                                  {notification.title}
                                  {notification.pinned && (
                                    <Badge variant="outline" className="ml-2 text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">
                                      Destacada
                                    </Badge>
                                  )}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  {new Date(notification.initialDate).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {notification.description}
                              </p>
                              <div className="mt-2 flex gap-2 items-center justify-between">
                                <div className="flex gap-2">
                                  {getPriorityBadge(notification.priority)}
                                  {notification.contestCycle && (
                                    <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                      {notification.contestCycle}
                                    </Badge>
                                  )}
                                </div>
                                {notification.redirectionURL && (
                                  <Link href={notification.redirectionURL} passHref>
                                    <Button variant="outline" size="sm" className="flex gap-1 items-center">
                                      <span>Ver más</span>
                                      <ExternalLink className="h-3 w-3" />
                                    </Button>
                                  </Link>
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
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tab content for HIGH priority */}
              <TabsContent value="HIGH" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="p-8 text-center text-gray-500">
                        Cargando notificaciones...
                      </div>
                    ) : error ? (
                      <div className="p-8 text-center text-red-500">
                        {error}
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredNotifications.filter(n => n.priority === 'HIGH').length > 0 ? (
                          filteredNotifications
                            .filter(notification => notification.priority === 'HIGH')
                            .map((notification) => (
                              <motion.div 
                                key={notification.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`p-4 hover:bg-gray-50 ${notification.pinned ? 'bg-blue-50/50' : ''}`}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h3 className="font-medium text-ooi-dark-blue">
                                    {notification.title}
                                    {notification.pinned && (
                                      <Badge variant="outline" className="ml-2 text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">
                                        Destacada
                                      </Badge>
                                    )}
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    {new Date(notification.initialDate).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  {notification.description}
                                </p>
                                <div className="mt-2 flex gap-2 items-center justify-between">
                                  <div className="flex gap-2">
                                    {getPriorityBadge(notification.priority)}
                                    {notification.contestCycle && (
                                      <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                        {notification.contestCycle}
                                      </Badge>
                                    )}
                                  </div>
                                  {notification.redirectionURL && (
                                    <Link href={notification.redirectionURL} passHref>
                                      <Button variant="outline" size="sm" className="flex gap-1 items-center">
                                        <span>Ver más</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </motion.div>
                            ))
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            No hay notificaciones de prioridad alta
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Similar structure for MEDIUM priority */}
              <TabsContent value="MEDIUM" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="p-8 text-center text-gray-500">
                        Cargando notificaciones...
                      </div>
                    ) : error ? (
                      <div className="p-8 text-center text-red-500">
                        {error}
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredNotifications.filter(n => n.priority === 'MEDIUM').length > 0 ? (
                          filteredNotifications
                            .filter(notification => notification.priority === 'MEDIUM')
                            .map((notification) => (
                              // Same notification rendering component as in the HIGH priority tab
                              <motion.div 
                                key={notification.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`p-4 hover:bg-gray-50 ${notification.pinned ? 'bg-blue-50/50' : ''}`}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h3 className="font-medium text-ooi-dark-blue">
                                    {notification.title}
                                    {notification.pinned && (
                                      <Badge variant="outline" className="ml-2 text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">
                                        Destacada
                                      </Badge>
                                    )}
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    {new Date(notification.initialDate).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  {notification.description}
                                </p>
                                <div className="mt-2 flex gap-2 items-center justify-between">
                                  <div className="flex gap-2">
                                    {getPriorityBadge(notification.priority)}
                                    {notification.contestCycle && (
                                      <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                        {notification.contestCycle}
                                      </Badge>
                                    )}
                                  </div>
                                  {notification.redirectionURL && (
                                    <Link href={notification.redirectionURL} passHref>
                                      <Button variant="outline" size="sm" className="flex gap-1 items-center">
                                        <span>Ver más</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </motion.div>
                            ))
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            No hay notificaciones de prioridad media
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tab content for LOW priority */}
              <TabsContent value="LOW" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="p-8 text-center text-gray-500">
                        Cargando notificaciones...
                      </div>
                    ) : error ? (
                      <div className="p-8 text-center text-red-500">
                        {error}
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredNotifications.filter(n => n.priority === 'LOW').length > 0 ? (
                          filteredNotifications
                            .filter(notification => notification.priority === 'LOW')
                            .map((notification) => (
                              // Same notification rendering component as in other tabs
                              <motion.div 
                                key={notification.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`p-4 hover:bg-gray-50 ${notification.pinned ? 'bg-blue-50/50' : ''}`}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h3 className="font-medium text-ooi-dark-blue">
                                    {notification.title}
                                    {notification.pinned && (
                                      <Badge variant="outline" className="ml-2 text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">
                                        Destacada
                                      </Badge>
                                    )}
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    {new Date(notification.initialDate).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  {notification.description}
                                </p>
                                <div className="mt-2 flex gap-2 items-center justify-between">
                                  <div className="flex gap-2">
                                    {getPriorityBadge(notification.priority)}
                                    {notification.contestCycle && (
                                      <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                        {notification.contestCycle}
                                      </Badge>
                                    )}
                                  </div>
                                  {notification.redirectionURL && (
                                    <Link href={notification.redirectionURL} passHref>
                                      <Button variant="outline" size="sm" className="flex gap-1 items-center">
                                        <span>Ver más</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </motion.div>
                            ))
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            No hay notificaciones de prioridad baja
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Tab content for pinned notifications */}
              <TabsContent value="pinned" className="mt-6">
                <Card>
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="p-8 text-center text-gray-500">
                        Cargando notificaciones...
                      </div>
                    ) : error ? (
                      <div className="p-8 text-center text-red-500">
                        {error}
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredNotifications.filter(n => n.pinned).length > 0 ? (
                          filteredNotifications
                            .filter(notification => notification.pinned)
                            .map((notification) => (
                              // Same notification rendering component as in other tabs
                              <motion.div 
                                key={notification.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="p-4 hover:bg-gray-50 bg-blue-50/50"
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <h3 className="font-medium text-ooi-dark-blue">
                                    {notification.title}
                                    <Badge variant="outline" className="ml-2 text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">
                                      Destacada
                                    </Badge>
                                  </h3>
                                  <span className="text-xs text-gray-500">
                                    {new Date(notification.initialDate).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  {notification.description}
                                </p>
                                <div className="mt-2 flex gap-2 items-center justify-between">
                                  <div className="flex gap-2">
                                    {getPriorityBadge(notification.priority)}
                                    {notification.contestCycle && (
                                      <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                        {notification.contestCycle}
                                      </Badge>
                                    )}
                                  </div>
                                  {notification.redirectionURL && (
                                    <Link href={notification.redirectionURL} passHref>
                                      <Button variant="outline" size="sm" className="flex gap-1 items-center">
                                        <span>Ver más</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              </motion.div>
                            ))
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            No hay notificaciones destacadas
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </WithConstructionBanner>
      </SidebarInset>
    </>
  );
} 