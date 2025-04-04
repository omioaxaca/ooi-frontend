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
import { WithConstructionBanner } from "@/components/with-construction-banner";

interface Event {
  id: number;
  title: string;
  startDate?: Date;
  endDate?: Date;
  date?: Date;
  time?: string;
  type: string;
  category: string;
  description: string;
  location?: string;
  instructor?: string;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState("table");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Replace your current events array with this comprehensive one
  const events = [
    // Registration period
    {
      id: 1,
      title: "Periodo de inscripciones",
      startDate: new Date(2025, 2, 10), // March 10, 2025
      endDate: new Date(2025, 2, 28), // March 28, 2025
      type: "general",
      category: "all",
      description: "Periodo oficial de inscripciones para la OOI 2025.",
      instructor: "Instructor 1"
    },
    // Online evaluation exam
    {
      id: 2,
      title: "Examen de evaluación por internet",
      startDate: new Date(2025, 2, 17), // March 17, 2025
      endDate: new Date(2025, 2, 28), // March 28, 2025
      type: "exam",
      category: "all",
      description: "Examen de evaluación en línea para todos los participantes.",
      instructor: "Instructor 2"
    },
    // Class schedule selection
    {
      id: 3,
      title: "Elección de horario de clases",
      startDate: new Date(2025, 2, 31), // March 31, 2025
      endDate: new Date(2025, 3, 7), // April 7, 2025
      type: "general",
      category: "all",
      description: "Selección de horario preferido para las clases.",
      instructor: "Instructor 3"
    },
    // Welcome session
    {
      id: 4,
      title: "Bienvenida a la OOI y OOI Femenil 2025",
      date: new Date(2025, 3, 4), // April 4, 2025
      time: "16:00",
      type: "meeting",
      category: "all",
      location: "Virtual - Microsoft Teams",
      description: "Sesión de bienvenida para todos los participantes de la OOI 2025.",
      instructor: "Instructor 4"
    },
    // Diagnostic exam for green category
    {
      id: 5,
      title: "Examen diagnóstico para categoría verde",
      startDate: new Date(2025, 3, 5), // April 5, 2025
      endDate: new Date(2025, 3, 6), // April 6, 2025
      type: "exam",
      category: "green",
      description: "Examen diagnóstico para participantes que desean integrarse a la categoría verde.",
      instructor: "Instructor 5"
    },
    // Phase 1 - Blue category
    {
      id: 6,
      title: "Fase 1: Aprendiz",
      startDate: new Date(2025, 3, 7), // April 7, 2025
      endDate: new Date(2025, 3, 11), // April 11, 2025
      type: "class",
      category: "blue",
      description: "Primera fase de entrenamiento para la categoría azul.",
      instructor: "Instructor 6"
    },
    // Phase 1 - Green category
    {
      id: 7,
      title: "Fase 1: Olimpico++",
      startDate: new Date(2025, 3, 7), // April 7, 2025
      endDate: new Date(2025, 3, 11), // April 11, 2025
      type: "class",
      category: "green",
      description: "Primera fase de entrenamiento para la categoría verde.",
      instructor: "Instructor 7"
    },
    // Phase 1 - Female category
    {
      id: 8,
      title: "Fase 1: Aprendiz",
      startDate: new Date(2025, 3, 7), // April 7, 2025
      endDate: new Date(2025, 3, 11), // April 11, 2025
      type: "class",
      category: "female",
      description: "Primera fase de entrenamiento para la categoría femenil.",
      instructor: "Instructor 8"
    },
    // Vacation period 1
    {
      id: 9,
      title: "Vacaciones",
      startDate: new Date(2025, 3, 12), // April 12, 2025
      endDate: new Date(2025, 3, 20), // April 20, 2025
      type: "holiday",
      category: "all",
      description: "Periodo de vacaciones.",
      instructor: "Instructor 9"
    },
    // Phase 2 - Blue category
    {
      id: 10,
      title: "Fase 2: Aprendiz++",
      startDate: new Date(2025, 3, 21), // April 21, 2025
      endDate: new Date(2025, 4, 16), // May 16, 2025
      type: "class",
      category: "blue",
      description: "Segunda fase de entrenamiento para la categoría azul.",
      instructor: "Instructor 10"
    },
    // Phase 2 - Green category
    {
      id: 11,
      title: "Fase 2: Matemático",
      startDate: new Date(2025, 3, 21), // April 21, 2025
      endDate: new Date(2025, 4, 16), // May 16, 2025
      type: "class",
      category: "green",
      description: "Segunda fase de entrenamiento para la categoría verde.",
      instructor: "Instructor 11"
    },
    // Phase 2 - Female category
    {
      id: 12,
      title: "Fase 2: Aprendiz++",
      startDate: new Date(2025, 3, 21), // April 21, 2025
      endDate: new Date(2025, 4, 16), // May 16, 2025
      type: "class",
      category: "female",
      description: "Segunda fase de entrenamiento para la categoría femenil.",
      instructor: "Instructor 12"
    },
    // Bonus Phase - All categories
    {
      id: 13,
      title: "Fase bonus",
      startDate: new Date(2025, 4, 17), // May 17, 2025
      endDate: new Date(2025, 4, 23), // May 23, 2025
      type: "class",
      category: "blue",
      description: "Fase adicional de entrenamiento para la categoría azul.",
      instructor: "Instructor 13"
    },
    {
      id: 14,
      title: "Fase bonus",
      startDate: new Date(2025, 4, 17), // May 17, 2025
      endDate: new Date(2025, 4, 23), // May 23, 2025
      type: "class",
      category: "green",
      description: "Fase adicional de entrenamiento para la categoría verde.",
      instructor: "Instructor 14"
    },
    {
      id: 15,
      title: "Fase bonus",
      startDate: new Date(2025, 4, 17), // May 17, 2025
      endDate: new Date(2025, 4, 23), // May 23, 2025
      type: "class",
      category: "female",
      description: "Fase adicional de entrenamiento para la categoría femenil.",
      instructor: "Instructor 15"
    },
    // Elimination 1 - Blue and Green categories
    {
      id: 16,
      title: "Eliminatoria 1",
      startDate: new Date(2025, 4, 24), // May 24, 2025
      endDate: new Date(2025, 4, 25), // May 25, 2025
      type: "exam",
      category: "blue",
      description: "Primera eliminatoria para la categoría azul.",
      instructor: "Instructor 16"
    },
    {
      id: 17,
      title: "Eliminatoria 1",
      startDate: new Date(2025, 4, 24), // May 24, 2025
      endDate: new Date(2025, 4, 25), // May 25, 2025
      type: "exam",
      category: "green",
      description: "Primera eliminatoria para la categoría verde.",
      instructor: "Instructor 17"
    },
    // Phase 3 - All categories
    {
      id: 18,
      title: "Fase 3: Programador",
      startDate: new Date(2025, 4, 26), // May 26, 2025
      endDate: new Date(2025, 5, 20), // June 20, 2025
      type: "class",
      category: "blue",
      description: "Tercera fase de entrenamiento para la categoría azul.",
      instructor: "Instructor 18"
    },
    {
      id: 19,
      title: "Fase 3: Explorador",
      startDate: new Date(2025, 4, 26), // May 26, 2025
      endDate: new Date(2025, 5, 20), // June 20, 2025
      type: "class",
      category: "green",
      description: "Tercera fase de entrenamiento para la categoría verde.",
      instructor: "Instructor 19"
    },
    {
      id: 20,
      title: "Fase 3: Programadora",
      startDate: new Date(2025, 4, 26), // May 26, 2025
      endDate: new Date(2025, 5, 20), // June 20, 2025
      type: "class",
      category: "female",
      description: "Tercera fase de entrenamiento para la categoría femenil.",
      instructor: "Instructor 20"
    },
    // Elimination 2 - Blue and Green categories
    {
      id: 21,
      title: "Eliminatoria 2",
      startDate: new Date(2025, 5, 21), // June 21, 2025
      endDate: new Date(2025, 5, 22), // June 22, 2025
      type: "exam",
      category: "blue",
      description: "Segunda eliminatoria para la categoría azul.",
      instructor: "Instructor 21"
    },
    {
      id: 22,
      title: "Eliminatoria 2",
      startDate: new Date(2025, 5, 21), // June 21, 2025
      endDate: new Date(2025, 5, 22), // June 22, 2025
      type: "exam",
      category: "green",
      description: "Segunda eliminatoria para la categoría verde.",
      instructor: "Instructor 22"
    },
    // Phase 4 - All categories
    {
      id: 23,
      title: "Fase 4: Programador++",
      startDate: new Date(2025, 5, 23), // June 23, 2025
      endDate: new Date(2025, 6, 18), // July 18, 2025
      type: "class",
      category: "blue",
      description: "Cuarta fase de entrenamiento para la categoría azul.",
      instructor: "Instructor 23"
    },
    {
      id: 24,
      title: "Fase 4: Algoritmista",
      startDate: new Date(2025, 5, 23), // June 23, 2025
      endDate: new Date(2025, 6, 18), // July 18, 2025
      type: "class",
      category: "green",
      description: "Cuarta fase de entrenamiento para la categoría verde.",
      instructor: "Instructor 24"
    },
    {
      id: 25,
      title: "Fase 4: Programadora++",
      startDate: new Date(2025, 5, 23), // June 23, 2025
      endDate: new Date(2025, 6, 18), // July 18, 2025
      type: "class",
      category: "female",
      description: "Cuarta fase de entrenamiento para la categoría femenil.",
      instructor: "Instructor 25"
    },
    // Elimination 3 - Blue and Green categories
    {
      id: 26,
      title: "Eliminatoria 3",
      startDate: new Date(2025, 6, 19), // July 19, 2025
      endDate: new Date(2025, 6, 20), // July 20, 2025
      type: "exam",
      category: "blue",
      description: "Tercera eliminatoria para la categoría azul.",
      instructor: "Instructor 26"
    },
    {
      id: 27,
      title: "Eliminatoria 3",
      startDate: new Date(2025, 6, 19), // July 19, 2025
      endDate: new Date(2025, 6, 20), // July 20, 2025
      type: "exam",
      category: "green",
      description: "Tercera eliminatoria para la categoría verde.",
      instructor: "Instructor 27"
    },
    // Vacation period 2
    {
      id: 28,
      title: "Vacaciones",
      startDate: new Date(2025, 6, 21), // July 21, 2025
      endDate: new Date(2025, 6, 27), // July 27, 2025
      type: "holiday",
      category: "all",
      description: "Segundo periodo de vacaciones.",
      instructor: "Instructor 28"
    },
    // Phase 5 - All categories
    {
      id: 29,
      title: "Fase 5: Olimpico",
      startDate: new Date(2025, 6, 28), // July 28, 2025
      endDate: new Date(2025, 7, 22), // August 22, 2025
      type: "class",
      category: "blue",
      description: "Quinta fase de entrenamiento para la categoría azul.",
      instructor: "Instructor 29"
    },
    {
      id: 30,
      title: "Fase 5: Leyenda",
      startDate: new Date(2025, 6, 28), // July 28, 2025
      endDate: new Date(2025, 7, 22), // August 22, 2025
      type: "class",
      category: "green",
      description: "Quinta fase de entrenamiento para la categoría verde.",
      instructor: "Instructor 30"
    },
    {
      id: 31,
      title: "Fase 5: Olimpica",
      startDate: new Date(2025, 6, 28), // July 28, 2025
      endDate: new Date(2025, 7, 22), // August 22, 2025
      type: "class",
      category: "female",
      description: "Quinta fase de entrenamiento para la categoría femenil.",
      instructor: "Instructor 31"
    },
    // Final elimination - Blue and Green categories
    {
      id: 32,
      title: "Eliminatoria 5 - Etapa final OMI",
      startDate: new Date(2025, 7, 23), // August 23, 2025
      endDate: new Date(2025, 7, 31), // August 31, 2025
      type: "exam",
      category: "all",
      description: "Etapa final para seleccionar a los 4 competidores para la OMI.",
      instructor: "Instructor 32"
    },
    // OFMI preparation
    {
      id: 33,
      title: "Preparación para la OFMI",
      startDate: new Date(2025, 7, 23), // August 23, 2025
      endDate: new Date(2025, 7, 31), // August 31, 2025
      type: "class",
      category: "female",
      description: "Preparación especial para el concurso en la OFMI.",
      instructor: "Instructor 33"
    },
    // Team announcement
    {
      id: 34,
      title: "Anuncio de la selección estatal 🏅",
      date: new Date(2025, 8, 3), // September 3, 2025
      type: "meeting",
      category: "all",
      description: "Anuncio oficial de los 4 seleccionados para representar a Oaxaca en la OMI.",
      instructor: "Instructor 34"
    },
    // Final preparation
    {
      id: 35,
      title: "Preparación final de la selección",
      startDate: new Date(2025, 8, 4), // September 4, 2025
      endDate: new Date(2025, 8, 30), // September 30, 2025
      type: "class",
      category: "all",
      description: "Entrenamiento final para los seleccionados estatales.",
      instructor: "Instructor 35"
    },
    // OMI participation
    {
      id: 36,
      title: "Participación de Oaxaca en la OMI",
      startDate: new Date(2025, 9, 1), // October 1, 2025
      endDate: new Date(2025, 9, 15), // October 15, 2025
      type: "exam",
      category: "all",
      description: "Participación del equipo de Oaxaca en la Olimpiada Mexicana de Informática.",
      instructor: "Instructor 36"
    },
    // OFMI participation (date TBD, placeholder)
    {
      id: 37,
      title: "Participación en la OFMI 2026",
      date: new Date(2025, 9, 15), // October 15, 2025 (placeholder)
      type: "exam",
      category: "female",
      description: "Participación en la Olimpiada Femenil Mexicana de Informática (fecha por confirmar).",
      instructor: "Instructor 37"
    }
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
        event.date?.getDate() === day &&
        event.date?.getMonth() === currentMonth &&
        event.date?.getFullYear() === currentYear
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
      event.date?.getDate() === selectedDay &&
      event.date?.getMonth() === currentMonth &&
      event.date?.getFullYear() === currentYear
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

  const getEventColor = (type: string, category?: string) => {
    if (category) {
      switch(category) {
        case 'blue': return 'bg-blue-100 text-blue-800';
        case 'green': return 'bg-green-100 text-green-800';
        case 'female': return 'bg-purple-100 text-purple-800';
        default: break;
      }
    }
    
    switch(type) {
      case 'class': return 'bg-blue-100 text-blue-800';
      case 'homework': return 'bg-green-100 text-green-800';
      case 'exam': return 'bg-red-100 text-red-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'holiday': return 'bg-amber-100 text-amber-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              {/* <div className="flex items-center gap-2">
                <Select value={viewType} onValueChange={setViewType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Vista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Vista mensual</SelectItem>
                    <SelectItem value="list">Lista de eventos</SelectItem>
                    <SelectItem value="table">Cronograma completo</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
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
                                      className={`text-xs truncate px-1 py-0.5 rounded ${getEventColor(event.type, event.category)}`}
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
                                  <Badge className={getEventColor(event.type, event.category)}>
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
            ) : viewType === "list" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Lista de eventos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events
                      .sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0))
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
                              <Badge className={getEventColor(event.type, event.category)}>
                                {event.type === 'class' && 'Clase'}
                                {event.type === 'homework' && 'Tarea'}
                                {event.type === 'exam' && 'Examen'}
                                {event.type === 'meeting' && 'Reunión'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.date ? event.date.toLocaleDateString('es-MX', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              }) : ''}
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
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Cronograma OOI 2025</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-700">
                    Bienvenido olímpico(a), tu viaje de preparación para convertirte en el/la mejor programador(a) del estado ha
                    comenzado. A continuación encontrarás los detalles de cómo se llevará a cabo el proceso de entrenamiento y selección
                    este año.
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr>
                          <th className="border p-2 bg-gray-50 font-medium text-left">Fecha</th>
                          <th className="border p-2 bg-gray-50 font-medium text-left">Categoría azul 📘</th>
                          <th className="border p-2 bg-gray-50 font-medium text-left">Categoría verde 📗</th>
                          <th className="border p-2 bg-gray-50 font-medium text-left">Categoría Femenil 📓</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2">10 - 30 de marzo</td>
                          <td className="border p-2" colSpan={3}>Periodo de inscripciones.</td>
                        </tr>
                        <tr>
                          <td className="border p-2">17 - 30 de marzo</td>
                          <td className="border p-2" colSpan={3}>Examen de evaluación por internet.</td>
                        </tr>
                        <tr>
                          <td className="border p-2">31 Marzo - 6 Abril</td>
                          <td className="border p-2" colSpan={3}>Elección de horario de clases.</td>
                        </tr>
                        <tr>
                          <td className="border p-2">4 de Abril - 4:00 P.M.</td>
                          <td className="border p-2 bg-amber-100" colSpan={3}>
                            <p>Bienvenida a la OOI 2025.</p>
                            <p className="text-xs mt-1">Unete a la sesión de bienvenida en línea en el siguiente link: <a href="https://omioaxaca.com/bienvenida-2025" target="_blank" rel="noopener noreferrer">Sesión de bienvenida</a></p>
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>5 y 6 de Abril</p>
                            <p className="text-xs italic">fin de semana</p>
                          </td>
                          <td className="border p-2 bg-amber-100" colSpan={3}>
                            Exámen diagnostico para participantes que deseen integrarse a la categoría verde.
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>7 de abril al 11 de abril</p>
                            <p className="text-xs italic">1 semana</p>
                          </td>
                          <td className="border p-2" style={{ backgroundColor: '#9fc5e8' }}>Fase 1. Aprendiz</td>
                          <td className="border p-2" style={{ backgroundColor: '#b6d7a8' }}>Fase 1. Olimpico++</td>
                          <td className="border p-2" style={{ backgroundColor: '#e5ccff' }}>Fase 1. Aprendiz</td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>12 de abril al 20 de abril</p>
                            <p className="text-xs italic">1 semana</p>
                          </td>
                          <td className="border p-2 bg-amber-100" colSpan={3}>Vacaciones 🌴</td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>21 de abril al 16 de mayo</p>
                            <p className="text-xs italic">4 semanas</p>
                          </td>
                          <td className="border p-2" style={{ backgroundColor: '#9fc5e8' }}>Fase 2. Aprendiz++</td>
                          <td className="border p-2" style={{ backgroundColor: '#b6d7a8' }}>Fase 2. Matemático</td>
                          <td className="border p-2" style={{ backgroundColor: '#e5ccff' }}>Fase 2. Aprendiz++</td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>17 de mayo al 23 de mayo</p>
                            <p className="text-xs italic">1 semana</p>
                          </td>
                          <td className="border p-2" style={{ backgroundColor: '#9fc5e8' }}>Fase bonus</td>
                          <td className="border p-2" style={{ backgroundColor: '#b6d7a8' }}>Fase bonus</td>
                          <td className="border p-2" style={{ backgroundColor: '#e5ccff' }}>Fase bonus</td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>24 y 25 de mayo</p>
                            <p className="text-xs italic">fin de semana</p>
                          </td>
                          <td className="border p-2" style={{ backgroundColor: '#9fc5e8' }}><strong>Eliminatoria 1</strong> ☑️</td>
                          <td className="border p-2" style={{ backgroundColor: '#b6d7a8' }}><strong>Eliminatoria 1</strong> ☑️</td>
                          <td className="border p-2 bg-gray-200">No aplica</td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>26 de mayo al 20 de junio</p>
                            <p className="text-xs italic">4 semanas</p>
                          </td>
                          <td className="border p-2" style={{ backgroundColor: '#9fc5e8' }}>Fase 3. Programador</td>
                          <td className="border p-2" style={{ backgroundColor: '#b6d7a8' }}>Fase 3. Explorador</td>
                          <td className="border p-2" style={{ backgroundColor: '#e5ccff' }}>Fase 3. Programadora</td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>21 y 22 de junio</p>
                            <p className="text-xs italic">fin de semana</p>
                          </td>
                          <td className="border p-2" style={{ backgroundColor: '#9fc5e8' }}><strong>Eliminatoria 2</strong> ☑️</td>
                          <td className="border p-2" style={{ backgroundColor: '#b6d7a8' }}><strong>Eliminatoria 2</strong> ☑️</td>
                          <td className="border p-2 bg-gray-200">No aplica</td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>23 de junio al 18 de julio</p>
                            <p className="text-xs italic">4 semanas</p>
                          </td>
                          <td className="border p-2" style={{ backgroundColor: '#9fc5e8' }}>Fase 4. Programador++</td>
                          <td className="border p-2" style={{ backgroundColor: '#b6d7a8' }}>Fase 4. Algoritmista</td>
                          <td className="border p-2" style={{ backgroundColor: '#e5ccff' }}>Fase 4. Programadora++</td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>19 y 20 de julio</p>
                            <p className="text-xs italic">fin de semana</p>
                          </td>
                          <td className="border p-2" style={{ backgroundColor: '#9fc5e8' }}><strong>Eliminatoria 3</strong> ☑️</td>
                          <td className="border p-2" style={{ backgroundColor: '#b6d7a8' }}><strong>Eliminatoria 3</strong> ☑️</td>
                          <td className="border p-2 bg-gray-200">No aplica</td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>21 al 27 de julio</p>
                            <p className="text-xs italic">1 semana</p>
                          </td>
                          <td className="border p-2 bg-amber-100" colSpan={3}>Vacaciones 🌴</td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>28 de julio al 22 agosto</p>
                            <p className="text-xs italic">4 semanas</p>
                          </td>
                          <td className="border p-2" style={{ backgroundColor: '#9fc5e8' }}>Fase 5. Olimpico</td>
                          <td className="border p-2" style={{ backgroundColor: '#b6d7a8' }}>Fase 5. Leyenda</td>
                          <td className="border p-2" style={{ backgroundColor: '#e5ccff' }}>Fase 5. Olimpica</td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            <p>23, 24, 30 y 31 de agosto</p>
                            <p className="text-xs italic">fines de semana</p>
                          </td>
                          <td className="border p-2 bg-amber-100" colSpan={2}>
                            Eliminatoria 5. Etapa final para seleccionar a los 4 competidores para la OMI
                          </td>
                          <td className="border p-2" style={{ backgroundColor: '#e6e64d' }}>
                            Preparación para el concurso en la OFMI
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">3 de septiembre</td>
                          <td className="border p-2 bg-amber-100" colSpan={2}>
                            Anuncio de la selección estatal 🏅🏅🏅🏅
                          </td>
                          <td className="border p-2" style={{ backgroundColor: '#e6e64d' }}>
                            *Fecha por definirse, participación en la OFMI 2026
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">Septiembre</td>
                          <td className="border p-2 bg-amber-100" colSpan={2}>
                            Preparación final de la selección
                          </td>
                          <td className="border p-2"></td>
                        </tr>
                        <tr>
                          <td className="border p-2">Primera quincena de octubre</td>
                          <td className="border p-2" colSpan={2} style={{ backgroundColor: '#e6994d' }}>
                            Participación de Oaxaca en la OMI
                          </td>
                          <td className="border p-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Leyenda de colores</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4" style={{ backgroundColor: '#9fc5e8' }}></div>
                        <span className="text-sm">Categoría azul</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4" style={{ backgroundColor: '#b6d7a8' }}></div>
                        <span className="text-sm">Categoría verde</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4" style={{ backgroundColor: '#e5ccff' }}></div>
                        <span className="text-sm">Categoría femenil</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4" style={{ backgroundColor: '#e6994d' }}></div>
                        <span className="text-sm">Eventos OMI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4" style={{ backgroundColor: '#e6e64d' }}></div>
                        <span className="text-sm">Eventos OFMI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-amber-100"></div>
                        <span className="text-sm">Eventos generales</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200"></div>
                        <span className="text-sm">No aplica</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </WithConstructionBanner>
      </SidebarInset>
    </>
  );
} 