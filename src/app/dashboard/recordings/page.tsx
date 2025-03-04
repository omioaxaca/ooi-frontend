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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Video, Search, FileText, ExternalLink, Download, Clock } from "lucide-react";

// Update the type to match the actual data structure
type Recording = {
  id: number;
  title: string;
  date: string;
  duration: string;
  instructor: string;
  description: string;
  youtubeLink: string;
  slidesLink: string;
  pdfLink: string;
  module: string;
  tags: string[];
  // Optional properties that might not be in all recordings
  url?: string;
  thumbnail?: string;
  category?: string;
};

export default function RecordingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Sample recording data
  const recordings = [
    {
      id: 1,
      title: "Introducción a la Programación",
      date: "24 marzo, 2025",
      duration: "1h 45m",
      instructor: "Dr. Manuel Pérez",
      description: "Primera clase del curso donde se explicarán los objetivos, la metodología y una introducción a los conceptos básicos de programación.",
      youtubeLink: "https://youtube.com/watch?v=example1",
      slidesLink: "https://slides.example.com/intro-programming",
      pdfLink: "https://notes.example.com/intro-programming.pdf",
      module: "beginner",
      tags: ["introducción", "conceptos básicos"]
    },
    {
      id: 2,
      title: "Algoritmos Básicos",
      date: "26 marzo, 2025",
      duration: "2h",
      instructor: "Dr. Manuel Pérez",
      description: "Conceptos fundamentales de algoritmos: secuencia, selección y repetición. Ejemplos prácticos de algoritmos sencillos.",
      youtubeLink: "https://youtube.com/watch?v=example2",
      slidesLink: "https://slides.example.com/basic-algorithms",
      pdfLink: "https://notes.example.com/basic-algorithms.pdf",
      module: "beginner",
      tags: ["algoritmos", "estructuras de control"]
    },
    {
      id: 3,
      title: "Estructuras de Datos I",
      date: "31 marzo, 2025",
      duration: "1h 50m",
      instructor: "Ing. Karla Rodríguez",
      description: "Introducción a las estructuras de datos: arrays, listas enlazadas, pilas y colas. Implementación básica y aplicaciones.",
      youtubeLink: "https://youtube.com/watch?v=example3",
      slidesLink: "https://slides.example.com/data-structures-1",
      pdfLink: "https://notes.example.com/data-structures-1.pdf",
      module: "beginner",
      tags: ["estructuras de datos", "arrays", "listas enlazadas"]
    },
    {
      id: 4,
      title: "Programación Orientada a Objetos",
      date: "7 abril, 2025",
      duration: "2h 10m",
      instructor: "Ing. Carlos González",
      description: "Principios de la POO: clases, objetos, herencia, encapsulamiento y polimorfismo. Ejemplos prácticos en C++ y Java.",
      youtubeLink: "https://youtube.com/watch?v=example4",
      slidesLink: "https://slides.example.com/oop",
      pdfLink: "https://notes.example.com/oop.pdf",
      module: "intermediate",
      tags: ["POO", "clases", "objetos"]
    },
    {
      id: 5,
      title: "Algoritmos de Búsqueda",
      date: "14 abril, 2025",
      duration: "1h 40m",
      instructor: "Dr. Manuel Pérez",
      description: "Algoritmos de búsqueda: lineal, binaria, hashmap. Análisis de complejidad y casos de uso.",
      youtubeLink: "https://youtube.com/watch?v=example5",
      slidesLink: "https://slides.example.com/search-algorithms",
      pdfLink: "https://notes.example.com/search-algorithms.pdf",
      module: "intermediate",
      tags: ["búsqueda", "complejidad algorítmica"]
    }
  ];

  // Filter recordings by search query and module
  const filteredRecordings = recordings.filter(recording => 
    (activeTab === "all" || recording.module === activeTab) &&
    (recording.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     recording.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     recording.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

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
            className="flex justify-between items-center mb-6"
          >
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-ooi-second-blue" />
              <h1 className="text-2xl font-semibold text-ooi-dark-blue">Grabaciones de Clases</h1>
            </div>
            <div className="relative w-64">
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
                <TabsTrigger value="beginner">Principiante</TabsTrigger>
                <TabsTrigger value="intermediate">Intermedio</TabsTrigger>
                <TabsTrigger value="advanced">Avanzado</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                {filteredRecordings.length > 0 ? (
                  filteredRecordings.map((recording) => (
                    <RecordingCard key={recording.id} recording={recording} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron grabaciones que coincidan con tu búsqueda
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="beginner" className="space-y-6">
                {filteredRecordings.length > 0 ? (
                  filteredRecordings.map((recording) => (
                    <RecordingCard key={recording.id} recording={recording} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron grabaciones para este nivel
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="intermediate" className="space-y-6">
                {filteredRecordings.length > 0 ? (
                  filteredRecordings.map((recording) => (
                    <RecordingCard key={recording.id} recording={recording} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron grabaciones para este nivel
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-6">
                {filteredRecordings.length > 0 ? (
                  filteredRecordings.map((recording) => (
                    <RecordingCard key={recording.id} recording={recording} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron grabaciones para este nivel
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// RecordingCard component to display each recording
function RecordingCard({ recording }: { recording: Recording }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="bg-gray-100 md:w-64 p-4 flex items-center justify-center">
          <div className="w-full aspect-video bg-gray-200 rounded-md flex items-center justify-center">
            <Video className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <div className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold text-ooi-dark-blue">
                {recording.title}
              </CardTitle>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Clock className="h-4 w-4" />
                <span>{recording.duration}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <span className="font-medium">Instructor:</span> {recording.instructor} • {recording.date}
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              {recording.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {recording.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="bg-gray-100">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="bg-red-600 hover:bg-red-700" asChild>
                <a href={recording.youtubeLink} target="_blank" rel="noopener noreferrer">
                  <Video className="h-4 w-4 mr-2" />
                  Ver en YouTube
                </a>
              </Button>
              
              <Button size="sm" variant="outline" asChild>
                <a href={recording.slidesLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Presentación
                </a>
              </Button>
              
              <Button size="sm" variant="outline" asChild>
                <a href={recording.pdfLink} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Notas (PDF)
                </a>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
} 