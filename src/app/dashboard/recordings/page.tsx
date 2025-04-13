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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Video, Search, FileText, ExternalLink, Download, Clock, Calendar, User as UserIcon, ChevronRight, Play, X } from "lucide-react";
import { WithConstructionBanner } from "@/components/with-construction-banner";
import { fetchUserClassLessons } from "@/services/classLessonService";
import type { ClassLesson } from "@/types/dashboard/classLessons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function RecordingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [classLessons, setClassLessons] = useState<ClassLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecording, setSelectedRecording] = useState<ClassLesson | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
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

  // Filter for only recordings that have a recording URL
  const recordings = classLessons.filter(lesson => lesson.classRecordingURL);

  // Extract unique phases from recordings
  const getPhaseInfo = (phase: { title?: string, id?: number } | null | undefined) => {
    if (!phase || !phase.title) return { id: 0, number: 0, title: 'Sin fase' };
    
    // Try to extract phase number
    const match = phase.title.match(/fase\s*(\d+)/i);
    const phaseNumber = match ? parseInt(match[1], 10) : 0;
    
    return {
      id: phase.id || 0,
      number: phaseNumber,
      title: phase.title
    };
  };

  // Get all unique phases and sort them by phase number
  const uniquePhases = recordings.reduce((phases: Array<{id: number, number: number, title: string}>, recording) => {
    const phaseInfo = getPhaseInfo(recording.contestPhase);
    
    // Only add if this phase doesn't already exist in the array
    if (!phases.some(p => p.id === phaseInfo.id)) {
      phases.push(phaseInfo);
    }
    
    return phases;
  }, []).sort((a, b) => a.number - b.number);

  // Group recordings by phase
  const getPhaseNumber = (phase: { title?: string, id?: number } | null | undefined): number => {
    if (!phase) return 0;
    const title = phase.title || '';
    // Try to extract phase number
    const match = title.match(/fase\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Get recordings for a specific phase or phase ID
  const getRecordingsForPhase = (phaseIdOrNumber: number | string) => {
    if (phaseIdOrNumber === 'all') return recordings;
    
    // Check if it's a phase ID or number
    const isPhaseId = typeof phaseIdOrNumber === 'string' && phaseIdOrNumber.startsWith('phase-');
    const phaseNumber = isPhaseId 
      ? uniquePhases.find(p => `phase-${p.id}` === phaseIdOrNumber)?.number || 0
      : Number(phaseIdOrNumber);
    
    return recordings.filter(recording => 
      getPhaseNumber(recording.contestPhase) === phaseNumber ||
      (recording.contestPhase?.id && `phase-${recording.contestPhase.id}` === phaseIdOrNumber)
    );
  };

  // Filter recordings by search query and phase
  const getFilteredRecordings = () => {
    const recordingsToFilter = getRecordingsForPhase(activeTab);
    
    if (!searchQuery.trim()) return recordingsToFilter;
    
    const lowerQuery = searchQuery.toLowerCase();
    return recordingsToFilter.filter(recording => 
      (recording.description?.toLowerCase().includes(lowerQuery) ||
        recording.teacher?.firstName?.toLowerCase().includes(lowerQuery) ||
        recording.teacher?.lastName?.toLowerCase().includes(lowerQuery) ||
        recording.syllabi?.some(s => 
          s.title?.toLowerCase().includes(lowerQuery) || 
          s.description?.toLowerCase().includes(lowerQuery)
        ))
    );
  };

  const filteredRecordings = getFilteredRecordings();

  // Sort recordings by date (newest first)
  const sortedRecordings = [...filteredRecordings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Helper to get syllabus title
  const getSyllabusTitle = (lesson: ClassLesson) => {
    return lesson?.syllabi && lesson.syllabi.length > 0 && lesson.syllabi[0]?.title
      ? lesson.syllabi[0].title
      : 'Clase grabada';
  };

  // Helper to get syllabus description
  const getSyllabusDescription = (lesson: ClassLesson) => {
    return lesson?.description || 
      (lesson?.syllabi && lesson.syllabi.length > 0 && lesson.syllabi[0]?.description) || 
      'No hay descripción disponible.';
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX', { 
        day: 'numeric',
        month: 'long', 
        year: 'numeric'
      });
    } catch (e) {
      return 'Fecha no disponible';
    }
  };

  // Helper to get teacher name
  const getTeacherName = (lesson: ClassLesson) => {
    return lesson?.teacher 
      ? `${lesson.teacher.firstName || ''} ${lesson.teacher.lastName || ''}`.trim() || 'Profesor no asignado'
      : 'Profesor no asignado';
  };

  // Helper to get teacher initials for avatar fallback
  const getTeacherInitials = (lesson: ClassLesson) => {
    if (!lesson?.teacher) return 'NA';
    const firstName = lesson.teacher.firstName || '';
    const lastName = lesson.teacher.lastName || '';
    return `${firstName.charAt(0) || ''}${lastName.charAt(0) || ''}`.toUpperCase() || 'NA';
  };

  // Helper to extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string) => {
    if (!url) return null;
    
    // Try to match YouTube URL patterns
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Calculate estimated video duration (placeholder)
  const getEstimatedDuration = (lesson: ClassLesson) => {
    // This is a placeholder - in a real app, you might get this from the API
    // or calculate based on syllabus complexity
    return '1h 30m';
  };

  // Open the video player with the selected recording
  const openVideoPlayer = (recording: ClassLesson) => {
    setSelectedRecording(recording);
    setIsPlayerOpen(true);
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
                    <BreadcrumbPage>Grabaciones de Clases</BreadcrumbPage>
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
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
            >
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-ooi-second-blue" />
                <h1 className="text-2xl font-semibold text-ooi-dark-blue">Grabaciones de Clases</h1>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar grabaciones..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  {uniquePhases.map(phase => (
                    <TabsTrigger key={`phase-${phase.id}`} value={`phase-${phase.id}`}>
                      {phase.title || `Fase ${phase.number}`}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value={activeTab} className="space-y-6">
                  {isLoading ? (
                    // Loading skeletons
                    Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="bg-gray-100 md:w-64 p-4">
                            <Skeleton className="h-32 w-full rounded-md" />
                          </div>
                          <div className="flex-1 p-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-16 w-full mb-4" />
                            <div className="flex gap-2">
                              <Skeleton className="h-8 w-24" />
                              <Skeleton className="h-8 w-24" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : sortedRecordings.length > 0 ? (
                    sortedRecordings.map((recording) => (
                      <RecordingCard 
                        key={recording.id} 
                        recording={recording}
                        getSyllabusTitle={getSyllabusTitle}
                        getSyllabusDescription={getSyllabusDescription}
                        formatDate={formatDate}
                        getTeacherName={getTeacherName}
                        getTeacherInitials={getTeacherInitials}
                        getEstimatedDuration={getEstimatedDuration}
                        onPlay={() => openVideoPlayer(recording)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                      <Video className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">No se encontraron grabaciones</p>
                      <p className="text-sm mt-1">
                        {searchQuery 
                          ? "Intenta con otra búsqueda o selecciona otra categoría" 
                          : "Aún no hay grabaciones disponibles para esta categoría"}
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </WithConstructionBanner>
      </SidebarInset>

      {/* Video Player Dialog */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="max-w-6xl w-[95vw] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0 flex-row justify-between items-start">
            <div>
              <DialogTitle className="text-xl">{selectedRecording ? getSyllabusTitle(selectedRecording) : 'Grabación de Clase'}</DialogTitle>
              <DialogDescription className="mt-1">
                {selectedRecording ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{formatDate(selectedRecording.date)}</span>
                    <span>•</span>
                    <span>{getTeacherName(selectedRecording)}</span>
                  </div>
                ) : ''}
              </DialogDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsPlayerOpen(false)}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="aspect-video bg-black w-full">
            {selectedRecording?.classRecordingURL && getYoutubeVideoId(selectedRecording.classRecordingURL) ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYoutubeVideoId(selectedRecording.classRecordingURL)}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                Error al cargar el video
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50">
            <h3 className="font-medium mb-1">Descripción</h3>
            <p className="text-sm text-gray-700">
              {selectedRecording ? getSyllabusDescription(selectedRecording) : ''}
            </p>
          </div>
          <div className="p-4 flex gap-2 justify-end">
            {selectedRecording?.presentation?.url && (
              <Button variant="outline" size="sm" asChild>
                <a 
                  href={`${process.env.NEXT_PUBLIC_STRAPI_URL}${selectedRecording.presentation.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Presentación
                </a>
              </Button>
            )}
            {selectedRecording?.classRecordingURL && (
              <Button size="sm" asChild>
                <a 
                  href={selectedRecording.classRecordingURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver en YouTube
                </a>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// RecordingCard component to display each recording
function RecordingCard({ 
  recording,
  getSyllabusTitle,
  getSyllabusDescription,
  formatDate,
  getTeacherName,
  getTeacherInitials,
  getEstimatedDuration,
  onPlay
}: { 
  recording: ClassLesson;
  getSyllabusTitle: (lesson: ClassLesson) => string;
  getSyllabusDescription: (lesson: ClassLesson) => string;
  formatDate: (date: string) => string;
  getTeacherName: (lesson: ClassLesson) => string;
  getTeacherInitials: (lesson: ClassLesson) => string;
  getEstimatedDuration: (lesson: ClassLesson) => string;
  onPlay: () => void;
}) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div 
          className="bg-gray-100 md:w-64 p-4 relative cursor-pointer group"
          onClick={onPlay}
        >
          <div className="w-full aspect-video bg-gray-800 rounded-md flex items-center justify-center relative">
            {/* Thumbnail/Preview - in a real app, you might use an actual thumbnail */}
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-gray-900 translate-x-0.5" />
              </div>
            </div>
            
            {/* Class info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
              <span className="text-white text-xs font-medium">
                {formatDate(recording.date)}
              </span>
            </div>
          </div>
          
          <div className="mt-2 text-center">
            <Button 
              onClick={onPlay}
              variant="outline" 
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              Reproducir
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold text-ooi-dark-blue">
                {getSyllabusTitle(recording)}
              </CardTitle>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Clock className="h-4 w-4" />
                <span>{getEstimatedDuration(recording)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(recording.date)}
              </div>
              
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage 
                    src={recording.teacher?.avatar?.url} 
                    alt={getTeacherName(recording)} 
                  />
                  <AvatarFallback className="text-xs">
                    {getTeacherInitials(recording)}
                  </AvatarFallback>
                </Avatar>
                <span>{getTeacherName(recording)}</span>
              </div>
              
              {recording.contestPhase?.title && (
                <Badge variant="outline" className="bg-gray-50">
                  {recording.contestPhase.title}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm text-gray-700 mb-4 line-clamp-3">
              {getSyllabusDescription(recording)}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={onPlay}>
                <Video className="h-4 w-4 mr-2" />
                Ver grabación
              </Button>
              
              {recording.presentation?.url && (
                <Button size="sm" variant="outline" asChild>
                  <a href={`${process.env.NEXT_PUBLIC_STRAPI_URL}${recording.presentation.url}`} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    Presentación
                  </a>
                </Button>
              )}
              
              {recording.classRecordingURL && (
                <Button size="sm" variant="outline" asChild>
                  <a href={recording.classRecordingURL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver en YouTube
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
} 