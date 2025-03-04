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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, Book, FileText, PenTool } from "lucide-react";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState("month");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Sample events data
  const events = [
    {
      id: 1,
      title: "Clase: Introducción a la Programación",
      date: new Date(2025, 2, 24), // March 24, 2025
      time: "16:00 - 18:00",
      type: "class",
      location: "Virtual - Google Meet",
      instructor: "Dr. Manuel Pérez",
      description: "Primera clase del curso donde se explicarán los objetivos y la metodología."
    },
    {
      id: 2,
      title: "Entrega: Tarea de algoritmos básicos",
      date: new Date(2025, 2, 31), // March 31, 2025
      type: "homework",
      deadline: true,
      description: "Resolver los 5 problemas planteados sobre algoritmos básicos."
    },
    {
      id: 3,
      title: "Sesión de preguntas y respuestas",
      date: new Date(2025, 3, 2), // April 2, 2025
      time: "17:00 - 18:00",
      type: "meeting",
      location: "Virtual - Discord",
      description: "Sesión para resolver dudas sobre los conceptos vistos en clase."
    },
    {
      id: 4,
      title: "Clase: Estructuras de datos",
      date: new Date(2025, 3, 7), // April 7, 2025
      time: "16:00 - 18:00",
      type: "class",
      location: "Virtual - Google Meet",
      instructor: "Ing. Karla Rodríguez",
      description: "Introducción a las estructuras de datos básicas: arrays, listas, pilas y colas."
    },
    {
      id: 5,
      title: "Examen: Evaluación 1",
      date: new Date(2025, 3, 10), // April 10, 2025
      time: "15:00 - 17:00",
      type: "exam",
      location: "Virtual - Plataforma OOI",
      description: "Primera evaluación del curso que cubre los temas de introducción y algoritmos básicos."
    },
  ];

  // Generate days for the calendar
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, events: [] });
    }
    
    // Add days of the month with their events
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayEvents = events.filter(event => 
        event.date.getDate() === day &&
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear
      );
      
      days.push({ day, events: dayEvents, date });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  // Get events for selected day
  const selectedDayEvents = selectedDay ? 
    events.filter(event => 
      event.date.getDate() === selectedDay &&
      event.date.getMonth() === currentMonth &&
      event.date.getFullYear() === currentYear
    ) : [];

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'class': return <Video className="h-4 w-4" />;
      case 'homework': return <FileText className="h-4 w-4" />;
      case 'exam': return <PenTool className="h-4 w-4" />;
      case 'meeting': return <Video className="h-4 w-4" />;
      default: return <Book className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch(type) {
      case 'class': return 'bg-blue-100 text-blue-800';
      case 'homework': return 'bg-green-100 text-green-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                  <BreadcrumbPage>Calendario</BreadcrumbPage>
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
              <CalendarIcon className="h-5 w-5 text-ooi-second-blue" />
              <h1 className="text-2xl font-semibold text-ooi-dark-blue">Calendario</h1>
            </div>
            <div className="flex items-center gap-2">
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Vista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Vista mensual</SelectItem>
                  <SelectItem value="list">Lista de eventos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {viewType === "month" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <CardTitle className="text-xl font-medium">
                        {monthNames[currentMonth]} {currentYear}
                      </CardTitle>
                      <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1">
                      {/* Days of the week */}
                      {weekDays.map((day, i) => (
                        <div key={i} className="text-center text-sm font-medium text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                      
                      {/* Calendar days */}
                      {calendarDays.map((dayData, i) => (
                        <div 
                          key={i} 
                          className={`border rounded-md min-h-[80px] p-1 ${
                            dayData.day === selectedDay ? 'ring-2 ring-ooi-second-blue' : ''
                          } ${
                            dayData.day ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50/50'
                          }`}
                          onClick={() => dayData.day && setSelectedDay(dayData.day)}
                        >
                          {dayData.day && (
                            <>
                              <div className="text-right text-sm font-medium mb-1">
                                {dayData.day}
                              </div>
                              <div className="space-y-1">
                                {dayData.events.slice(0, 2).map((event, j) => (
                                  <div 
                                    key={j} 
                                    className={`text-xs truncate px-1 py-0.5 rounded ${getEventColor(event.type)}`}
                                  >
                                    {event.title.length > 20 ? `${event.title.substring(0, 18)}...` : event.title}
                                  </div>
                                ))}
                                {dayData.events.length > 2 && (
                                  <div className="text-xs text-gray-500 text-center">
                                    + {dayData.events.length - 2} más
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedDay ? (
                        `Eventos: ${selectedDay} de ${monthNames[currentMonth]}`
                      ) : (
                        "Selecciona un día"
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedDay ? (
                      selectedDayEvents.length > 0 ? (
                        <div className="space-y-4">
                          {selectedDayEvents.map((event, i) => (
                            <div key={i} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <Badge className={getEventColor(event.type)}>
                                  {event.type === 'class' && 'Clase'}
                                  {event.type === 'homework' && 'Tarea'}
                                  {event.type === 'exam' && 'Examen'}
                                  {event.type === 'meeting' && 'Reunión'}
                                </Badge>
                                {event.time && (
                                  <span className="text-sm text-gray-500">{event.time}</span>
                                )}
                              </div>
                              <h3 className="font-medium mt-2">{event.title}</h3>
                              {event.location && (
                                <p className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">Lugar:</span> {event.location}
                                </p>
                              )}
                              {event.instructor && (
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Instructor:</span> {event.instructor}
                                </p>
                              )}
                              <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-6">
                          No hay eventos programados para este día
                        </div>
                      )
                    ) : (
                      <div className="text-center text-gray-500 py-6">
                        Selecciona un día en el calendario para ver los eventos
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Lista de eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((event, i) => (
                      <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          event.type === 'class' ? 'bg-blue-100 text-blue-700' :
                          event.type === 'homework' ? 'bg-green-100 text-green-700' :
                          event.type === 'exam' ? 'bg-red-100 text-red-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{event.title}</h3>
                            <Badge className={getEventColor(event.type)}>
                              {event.type === 'class' && 'Clase'}
                              {event.type === 'homework' && 'Tarea'}
                              {event.type === 'exam' && 'Examen'}
                              {event.type === 'meeting' && 'Reunión'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {event.date.toLocaleDateString('es-MX', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                            {event.time ? ` • ${event.time}` : ''}
                          </p>
                          {event.location && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Lugar:</span> {event.location}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 