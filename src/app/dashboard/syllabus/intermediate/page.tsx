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
import { 
  Accordion,
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Book, Video, FileText, ExternalLink, Check, LucideIcon } from "lucide-react";
import { WithConstructionBanner } from "@/components/with-construction-banner";

export default function BeginnerSyllabusPage() {
  // Sample syllabus data for beginner level
  const syllabus = [
    {
      id: "module-1",
      title: "Introducción a la Programación",
      description: "Fundamentos y conceptos básicos de programación",
      progress: 100,
      units: [
        {
          id: "unit-1-1",
          title: "¿Qué es la programación?",
          description: "Introducción a los conceptos fundamentales de programación",
          completed: true,
          resources: [
            { type: "video", title: "Introducción a la programación", url: "#", completed: true },
            { type: "pdf", title: "Conceptos básicos", url: "#", completed: true },
            { type: "quiz", title: "Evaluación de conceptos", url: "#", completed: true }
          ]
        },
        {
          id: "unit-1-2",
          title: "Lógica de programación",
          description: "Desarrollo del pensamiento lógico para resolver problemas",
          completed: true,
          resources: [
            { type: "video", title: "Pensamiento lógico", url: "#", completed: true },
            { type: "pdf", title: "Diagramas de flujo", url: "#", completed: true },
            { type: "exercise", title: "Ejercicios de lógica", url: "#", completed: true }
          ]
        },
        {
          id: "unit-1-3",
          title: "Pseudocódigo",
          description: "Cómo expresar algoritmos de manera simple antes de codificar",
          completed: true,
          resources: [
            { type: "video", title: "Introducción al pseudocódigo", url: "#", completed: true },
            { type: "pdf", title: "Guía de pseudocódigo", url: "#", completed: true },
            { type: "exercise", title: "Convertir problemas a pseudocódigo", url: "#", completed: true }
          ]
        }
      ]
    },
    {
      id: "module-2",
      title: "Algoritmos Básicos",
      description: "Fundamentos de algoritmos y estructuras de control",
      progress: 75,
      units: [
        {
          id: "unit-2-1",
          title: "Estructuras secuenciales",
          description: "Ejecución paso a paso de instrucciones",
          completed: true,
          resources: [
            { type: "video", title: "Secuencias de instrucciones", url: "#", completed: true },
            { type: "pdf", title: "Ejemplos de estructuras secuenciales", url: "#", completed: true },
            { type: "exercise", title: "Práctica de secuencias", url: "#", completed: true }
          ]
        },
        {
          id: "unit-2-2",
          title: "Estructuras condicionales",
          description: "Toma de decisiones en los algoritmos (if-else)",
          completed: true,
          resources: [
            { type: "video", title: "Condicionales simples y anidados", url: "#", completed: true },
            { type: "pdf", title: "Guía de estructuras condicionales", url: "#", completed: true },
            { type: "exercise", title: "Ejercicios de condicionales", url: "#", completed: true }
          ]
        },
        {
          id: "unit-2-3",
          title: "Estructuras repetitivas",
          description: "Bucles y ciclos (for, while, do-while)",
          completed: false,
          resources: [
            { type: "video", title: "Diferentes tipos de bucles", url: "#", completed: true },
            { type: "pdf", title: "Guía de estructuras repetitivas", url: "#", completed: true },
            { type: "exercise", title: "Ejercicios de bucles", url: "#", completed: false }
          ]
        },
        {
          id: "unit-2-4",
          title: "Algoritmos de ordenamiento simples",
          description: "Bubble sort y selection sort",
          completed: false,
          resources: [
            { type: "video", title: "Algoritmos de ordenamiento básicos", url: "#", completed: false },
            { type: "pdf", title: "Implementación de ordenamientos simples", url: "#", completed: false },
            { type: "exercise", title: "Práctica de algoritmos", url: "#", completed: false }
          ]
        }
      ]
    },
    {
      id: "module-3",
      title: "Estructuras de Datos Básicas",
      description: "Introducción a las estructuras de datos fundamentales",
      progress: 30,
      units: [
        {
          id: "unit-3-1",
          title: "Arrays y Matrices",
          description: "Fundamentos de estructuras de datos lineales",
          completed: true,
          resources: [
            { type: "video", title: "Introducción a arrays", url: "#", completed: true },
            { type: "pdf", title: "Operaciones con arrays", url: "#", completed: true },
            { type: "exercise", title: "Ejercicios de arrays", url: "#", completed: true }
          ]
        },
        {
          id: "unit-3-2",
          title: "Listas enlazadas",
          description: "Conceptos y operaciones básicas",
          completed: false,
          resources: [
            { type: "video", title: "Listas enlazadas simples", url: "#", completed: true },
            { type: "pdf", title: "Implementación de listas enlazadas", url: "#", completed: false },
            { type: "exercise", title: "Ejercicios de listas", url: "#", completed: false }
          ]
        },
        {
          id: "unit-3-3",
          title: "Pilas y Colas",
          description: "Estructuras de datos LIFO y FIFO",
          completed: false,
          resources: [
            { type: "video", title: "Pilas y sus aplicaciones", url: "#", completed: false },
            { type: "video", title: "Colas y sus aplicaciones", url: "#", completed: false },
            { type: "exercise", title: "Implementaciones prácticas", url: "#", completed: false }
          ]
        }
      ]
    }
  ];

  // Function to get icon by resource type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "quiz":
      case "exercise":
        return <Book className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <>
      <SidebarTrigger />
      <AppSidebar />
      <SidebarInset>
        <WithConstructionBanner>
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
                    <BreadcrumbLink href="/dashboard/syllabus">Syllabus</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Principiante</BreadcrumbPage>
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
                <Book className="h-5 w-5 text-ooi-second-blue" />
                <h1 className="text-2xl font-semibold text-ooi-dark-blue">Syllabus - Nivel Principiante</h1>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-ooi-dark-blue">
                    Progreso del Curso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {syllabus.map((module, index) => (
                      <div key={module.id}>
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium text-sm">{module.title}</h3>
                          <span className="text-sm text-gray-500">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2 mb-1" />
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
              <Accordion type="single" collapsible className="space-y-4">
                {syllabus.map((module) => (
                  <Card key={module.id} className="overflow-hidden">
                    <AccordionItem value={module.id} className="border-0">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex flex-col items-start text-left">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-ooi-dark-blue">{module.title}</h2>
                            <Badge className={module.progress === 100 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                              {module.progress === 100 ? "Completado" : "En progreso"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 pb-0 pt-0">
                        <div className="border-t">
                          {module.units.map((unit) => (
                            <div key={unit.id} className="border-b last:border-b-0">
                              <div className="px-6 py-4">
                                <div className="flex justify-between mb-2">
                                  <div className="flex items-start gap-3">
                                    <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${
                                      unit.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                                    }`}>
                                      {unit.completed ? (
                                        <Check className="h-3 w-3" />
                                      ) : null}
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-base">{unit.title}</h3>
                                      <p className="text-sm text-gray-500 mt-1">{unit.description}</p>
                                    </div>
                                  </div>
                                  <Badge className={unit.completed ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                                    {unit.completed ? "Completado" : "Pendiente"}
                                  </Badge>
                                </div>
                                
                                <div className="mt-4 space-y-2">
                                  {unit.resources.map((resource, i) => (
                                    <div 
                                      key={i} 
                                      className={`p-3 rounded-md border flex items-center justify-between ${
                                        resource.completed ? "bg-gray-50" : "bg-white"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                          {getResourceIcon(resource.type)}
                                        </div>
                                        <div>
                                          <p className="font-medium text-sm">{resource.title}</p>
                                          <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {resource.completed && (
                                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            <Check className="h-3 w-3 mr-1" />
                                            Completado
                                          </Badge>
                                        )}
                                        <Button size="sm" variant={resource.completed ? "outline" : "default"} asChild>
                                          <a href={resource.url}>
                                            {resource.completed ? "Repasar" : "Comenzar"}
                                            <ExternalLink className="h-3 w-3 ml-2" />
                                          </a>
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </WithConstructionBanner>
      </SidebarInset>
    </>
  );
} 