"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, ExternalLink, FileText, User as UserIcon, Clock, Calendar, Check } from "lucide-react";
import { WithConstructionBanner } from "@/components/with-construction-banner";
import { fetchUserClassLessons } from "@/services/classLessonService";
import type { ClassLesson, ClassLessonView } from "@/types/dashboard/classLessons";
import type { ContestPhase } from "@/types/dashboard/contestPhase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState("list");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [classLessons, setClassLessons] = useState<ClassLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // For class numbering
  const [classNumbersAssigned, setClassNumbersAssigned] = useState(false);
  const classNumberMapRef = useRef<Map<number, number>>(new Map());
  
  // Fetch class lessons when component mounts
  useEffect(() => {
    const getClassLessons = async () => {
      try {
        const lessons = await fetchUserClassLessons();
        setClassLessons(lessons);
      } catch (error) {
        console.error("Failed to fetch class lessons:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getClassLessons();
  }, []);

  // Sort class lessons by date for consistent numbering
  const sortedLessons = useMemo(() => 
    [...classLessons]
      .filter(lesson => lesson?.syllabi && lesson.syllabi.length > 1)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [classLessons]
  );

  // Assign sequential class numbers once data is loaded
  useEffect(() => {
    if (!isLoading && sortedLessons.length > 0 && !classNumbersAssigned) {
      // Clear existing assignments to ensure fresh numbering
      classNumberMapRef.current.clear();
      
      // Assign sequential numbers to classes with syllabi
      let counter = 1;
      sortedLessons.forEach(lesson => {
        classNumberMapRef.current.set(lesson.id, counter++);
      });
      
      setClassNumbersAssigned(true);
    }
  }, [isLoading, sortedLessons, classNumbersAssigned]);

  // Get class number from the map
  const getClassNumber = (lessonId: number): number => {
    return classNumberMapRef.current.get(lessonId) || 0;
  };

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
      
      // Find class lessons for this day (with validation)
      const dayEvents = classLessons.filter(lesson => {
        if (!lesson.date) return false;
        try {
          const lessonDate = new Date(lesson.date);
          return (
            lessonDate.getDate() === day &&
            lessonDate.getMonth() === currentMonth &&
            lessonDate.getFullYear() === currentYear
          );
        } catch (e) {
          return false;
        }
      });
      
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
    classLessons.filter(lesson => {
      const lessonDate = new Date(lesson.date);
      return (
        lessonDate.getDate() === selectedDay &&
        lessonDate.getMonth() === currentMonth &&
        lessonDate.getFullYear() === currentYear
      );
    }) : [];

  // Sort class lessons by date
  const sortedClassLessons = [...classLessons].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Format date with proper fallback
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No date specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Format time with proper fallback
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return 'No time specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return 'Invalid time';
    }
  };

  // Check if date is today with proper validation
  const isToday = (dateString: string | undefined) => {
    if (!dateString) return false;
    try {
      const today = new Date();
      const date = new Date(dateString);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    } catch (e) {
      return false;
    }
  };

  // Check if date is in the past with proper validation
  const isPast = (dateString: string | undefined) => {
    if (!dateString) return false;
    try {
      const today = new Date();
      const date = new Date(dateString);
      return date < today;
    } catch (e) {
      return false;
    }
  };

  // Safe access to date parts
  const getDatePart = (dateString: string | undefined, part: 'day' | 'month' | 'year') => {
    if (!dateString) return 1; // Default to 1 for day, January for month, current year for year
    try {
      const date = new Date(dateString);
      switch(part) {
        case 'day': return date.getDate();
        case 'month': return date.getMonth();
        case 'year': return date.getFullYear();
        default: return 1;
      }
    } catch (e) {
      return part === 'year' ? new Date().getFullYear() : 1;
    }
  };

  // Determine badge color based on contest phase name
  const getPhaseBadgeColor = (phaseTitle: string | undefined | null) => {
    if (!phaseTitle) return "bg-gray-100 text-gray-800";
    
    // Use the phase title to determine color
    const phaseLower = phaseTitle.toLowerCase();
    
    if (phaseLower.includes('fase 1') || phaseLower.includes('aprendiz')) {
      return "bg-blue-100 text-blue-800";
    } else if (phaseLower.includes('fase 2') || phaseLower.includes('matemático')) {
      return "bg-green-100 text-green-800";
    } else if (phaseLower.includes('fase 3') || phaseLower.includes('programador') || phaseLower.includes('explorador')) {
      return "bg-purple-100 text-purple-800";
    } else if (phaseLower.includes('fase 4') || phaseLower.includes('algoritmista')) {
      return "bg-amber-100 text-amber-800";
    } else if (phaseLower.includes('fase 5') || phaseLower.includes('olimpico') || phaseLower.includes('leyenda')) {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  // Get phase name for display
  const getPhaseName = (lesson: ClassLesson) => {
    return lesson.contestPhase?.title || '';
  };

  // Get safe syllabus title based on number of syllabi items
  const getSyllabusTitle = (lesson: ClassLesson) => {
    // If no syllabi, use default title
    if (!lesson?.syllabi || lesson.syllabi.length === 0) {
      return 'Clase programada';
    }
    
    // If only one syllabus, use its title
    if (lesson.syllabi.length === 1) {
      return lesson.syllabi[0]?.title || 'Clase programada';
    }
    
    // If multiple syllabi, format as "Clase número X"
    const classNumber = getClassNumber(lesson.id);
    return `Clase número ${classNumber || '?'} (${lesson.syllabi.length} temas)`;
  };

  // Get all syllabi titles for a lesson
  const getSyllabiTitles = (lesson: ClassLesson) => {
    if (!lesson?.syllabi || lesson.syllabi.length === 0) {
      return [];
    }
    
    return lesson.syllabi.map(syllabus => syllabus.title).filter(Boolean);
  };

  // Get safe syllabus description
  const getSyllabusDescription = (lesson: ClassLesson) => {
    return lesson?.description || 
      (lesson?.syllabi && lesson.syllabi.length > 0 && lesson.syllabi[0]?.description) || 
      'No hay descripción disponible.';
  };

  // Get safe teacher name
  const getTeacherName = (lesson: ClassLesson) => {
    return lesson?.teacher 
      ? `${lesson.teacher.firstName || ''} ${lesson.teacher.lastName || ''}`.trim() || 'Profesor no asignado'
      : 'Profesor no asignado';
  };

  // Get teacher initials for avatar fallback
  const getTeacherInitials = (lesson: ClassLesson) => {
    if (!lesson?.teacher) return 'NA';
    const firstName = lesson.teacher.firstName || '';
    const lastName = lesson.teacher.lastName || '';
    return `${firstName.charAt(0) || ''}${lastName.charAt(0) || ''}`.toUpperCase() || 'NA';
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
                <h1 className="text-2xl font-semibold text-ooi-dark-blue">Calendario de Clases</h1>
              </div>
              <div className="flex items-center gap-2">
                <Tabs value={viewType} onValueChange={setViewType} className="w-[250px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="calendar">Calendario</TabsTrigger>
                    <TabsTrigger value="list">Lista</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </motion.div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-8 w-48 mb-2" />
                      <Skeleton className="h-5 w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-32 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {viewType === "calendar" && (
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
                                      {dayData.events.slice(0, 2).map((lesson, j) => (
                                        <div 
                                          key={j} 
                                          className={`text-xs truncate px-1 py-0.5 rounded ${getPhaseBadgeColor(getPhaseName(lesson))}`}
                                        >
                                          <span className="font-medium">
                                            {formatTime(lesson.date)}
                                          </span>: {getSyllabusTitle(lesson)}
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
                              `Clases: ${selectedDay} de ${monthNames[currentMonth]}`
                            ) : (
                              "Selecciona un día"
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedDay ? (
                            selectedDayEvents.length > 0 ? (
                              <div className="space-y-4">
                                {selectedDayEvents.map((lesson, i) => (
                                  <div key={i} className="border rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <Badge className={getPhaseBadgeColor(getPhaseName(lesson))}>
                                        {getPhaseName(lesson) || 'Clase'}
                                      </Badge>
                                      <span className="text-sm text-gray-500">
                                        {formatTime(lesson.date)}
                                      </span>
                                    </div>
                                    <h3 className="font-medium">{getSyllabusTitle(lesson)}</h3>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                      <UserIcon className="h-4 w-4" />
                                      <span>{getTeacherName(lesson)}</span>
                                    </div>
                                    {lesson.meetingURL && (
                                      <div className="mt-3">
                                        <a 
                                          href={lesson.meetingURL} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="flex items-center text-sm text-blue-600 hover:underline"
                                        >
                                          <ExternalLink className="h-4 w-4 mr-1" />
                                          Unirse a la clase
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center text-gray-500 py-6">
                                No hay clases programadas para este día
                              </div>
                            )
                          ) : (
                            <div className="text-center text-gray-500 py-6">
                              Selecciona un día en el calendario para ver las clases
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {viewType === "list" && (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tus Clases Programadas</CardTitle>
                        <CardDescription>
                          {classLessons.length > 0 
                            ? `Tienes ${classLessons.length} clases programadas.` 
                            : "No tienes clases programadas."}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {classLessons.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
                            <p>No hay clases programadas aún.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {sortedClassLessons.map((lesson) => (
                              <div key={lesson.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0">
                                  <div className={`p-4 rounded-lg ${isPast(lesson.date) ? 'bg-gray-100' : isToday(lesson.date) ? 'bg-blue-100' : 'bg-green-50'}`}>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold">
                                        {getDatePart(lesson.date, 'day')}
                                      </div>
                                      <div className="text-sm uppercase">
                                        {monthNames[getDatePart(lesson.date, 'month')].slice(0, 3)}
                                      </div>
                                      <div className="text-xs mt-1">
                                        {formatTime(lesson.date)}
                                      </div>
                                    </div>
                                  </div>
                                  {isPast(lesson.date) && (
                                    <div className="mt-2 flex justify-center">
                                      <Badge variant="outline" className="text-gray-500 border-gray-300">
                                        <Check className="h-3 w-3 mr-1" />
                                        Completada
                                      </Badge>
                                    </div>
                                  )}
                                  {isToday(lesson.date) && (
                                    <div className="mt-2 flex justify-center">
                                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Hoy
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                      <h3 className="font-semibold text-lg">
                                        {getSyllabusTitle(lesson)}
                                      </h3>
                                      <div className="text-sm text-gray-500 mb-2">
                                        {formatDate(lesson.date)}
                                      </div>
                                    </div>
                                    <Badge className={getPhaseBadgeColor(getPhaseName(lesson))}>
                                      {getPhaseName(lesson) || lesson.contestCycle?.name || 'OOI 2025'}
                                    </Badge>
                                  </div>
                                  
                                  {/* Display syllabus topics if multiple exist */}
                                  {lesson.syllabi && lesson.syllabi.length > 1 && (
                                    <div className="mb-3">
                                      <p className="text-sm text-gray-600 mb-1 font-medium">Temas:</p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {getSyllabiTitles(lesson).map((title, i) => (
                                          <Badge key={i} variant="outline" className="bg-gray-50 text-xs">
                                            <ChevronRight className="h-3 w-3 mr-1 text-gray-400" />
                                            {title}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                    {getSyllabusDescription(lesson)}
                                  </p>
                                  
                                  <div className="flex items-center gap-2 mt-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={lesson.teacher?.avatar?.url} alt={lesson.teacher?.firstName || 'Teacher'} />
                                      <AvatarFallback>{getTeacherInitials(lesson)}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">
                                      <div className="font-medium">{getTeacherName(lesson)}</div>
                                      <div className="text-gray-500">Instructor</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 justify-center mt-4 md:mt-0">
                                  {lesson.meetingURL && (
                                    <Button asChild variant="default" className="gap-2">
                                      <Link href={lesson.meetingURL} target="_blank" rel="noopener noreferrer">
                                        <Video className="h-4 w-4" />
                                        Unirse a la clase
                                      </Link>
                                    </Button>
                                  )}
                                  
                                  {lesson.classRecordingURL && (
                                    <Button asChild variant="outline" className="gap-2">
                                      <Link href={lesson.classRecordingURL} target="_blank" rel="noopener noreferrer">
                                        <Video className="h-4 w-4" />
                                        Grabación
                                      </Link>
                                    </Button>
                                  )}
                                  
                                  {lesson.presentation?.url && (
                                    <Button asChild variant="outline" className="gap-2">
                                      <Link href={lesson.presentation.url} target="_blank" rel="noopener noreferrer">
                                        <FileText className="h-4 w-4" />
                                        Presentación
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </WithConstructionBanner>
      </SidebarInset>
    </>
  );
} 