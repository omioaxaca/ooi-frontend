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
import { Book, Video, FileText, ExternalLink, Check, LucideIcon, Lock } from "lucide-react";

export default function AdvancedSyllabusPage() {
  // Sample syllabus data for advanced level
  const syllabus = [
    {
      id: "module-1",
      title: "Algoritmos Avanzados",
      description: "Técnicas algorítmicas avanzadas y su análisis",
      progress: 20,
      units: [
        {
          id: "unit-1-1",
          title: "Divide y Vencerás",
          description: "Estrategia para dividir problemas en subproblemas más pequeños",
          completed: true,
          resources: [
            { type: "video", title: "Fundamentos de Divide y Vencerás", url: "#", completed: true },
            { type: "pdf", title: "Ejemplos de algoritmos", url: "#", completed: true },
            { type: "exercise", title: "Implementación práctica", url: "#", completed: false }
          ]
        },
        {
          id: "unit-1-2",
          title: "Programación Dinámica",
          description: "Optimización mediante memorización de subproblemas",
          completed: false,
          resources: [
            { type: "video", title: "Introducción a Programación Dinámica", url: "#", completed: true },
            { type: "pdf", title: "Ejercicios resueltos", url: "#", completed: false },
            { type: "exercise", title: "Problemas de optimización", url: "#", completed: false }
          ]
        },
        {
          id: "unit-1-3",
          title: "Algoritmos Voraces (Greedy)",
          description: "Estrategia de optimización local para soluciones globales",
          completed: false,
          locked: true,
          resources: [
            { type: "video", title: "Algoritmos Voraces", url: "#", completed: false, locked: true },
            { type: "pdf", title: "Análisis de algoritmos greedy", url: "#", completed: false, locked: true },
            { type: "quiz", title: "Evaluación de conceptos", url: "#", completed: false, locked: true }
          ]
        }
      ]
    },
    {
      id: "module-2",
      title: "Estructuras de Datos Avanzadas",
      description: "Implementación y aplicación de estructuras complejas",
      progress: 0,
      locked: true,
      units: [
        {
          id: "unit-2-1",
          title: "Árboles Binarios y Árboles Binarios de Búsqueda",
          description: "Implementación y operaciones en árboles",
          completed: false,
          locked: true,
          resources: [
            { type: "video", title: "Árboles Binarios", url: "#", completed: false, locked: true },
            { type: "pdf", title: "Recorridos en árboles", url: "#", completed: false, locked: true },
            { type: "exercise", title: "Operaciones en BST", url: "#", completed: false, locked: true }
          ]
        },
        {
          id: "unit-2-2",
          title: "Grafos",
          description: "Representación y algoritmos sobre grafos",
          completed: false,
          locked: true,
          resources: [
            { type: "video", title: "Representación de grafos", url: "#", completed: false, locked: true },
            { type: "pdf", title: "Recorridos en grafos", url: "#", completed: false, locked: true },
            { type: "exercise", title: "Implementación de algoritmos", url: "#", completed: false, locked: true }
          ]
        },
        {
          id: "unit-2-3",
          title: "Tablas Hash",
          description: "Implementación y resolución de colisiones",
          completed: false,
          locked: true,
          resources: [
            { type: "video", title: "Tablas Hash", url: "#", completed: false, locked: true },
            { type: "pdf", title: "Funciones Hash", url: "#", completed: false, locked: true },
            { type: "exercise", title: "Problemas de aplicación", url: "#", completed: false, locked: true }
          ]
        }
      ]
    },
    {
      id: "module-3",
      title: "Técnicas para Competencias",
      description: "Estrategias específicas para resolver problemas de competencia",
      progress: 0,
      locked: true,
      units: [
        {
          id: "unit-3-1",
          title: "Geometría Computacional",
          description: "Algoritmos para resolver problemas geométricos",
          completed: false,
          locked: true,
          resources: [
            { type: "video", title: "Fundamentos de geometría", url: "#", completed: false, locked: true },
            { type: "pdf", title: "Algoritmos clave", url: "#", completed: false, locked: true },
            { type: "exercise", title: "Problemas típicos", url: "#", completed: false, locked: true }
          ]
        },
        {
          id: "unit-3-2",
          title: "Teoría de Números",
          description: "Algoritmos y técnicas matemáticas",
          completed: false,
          locked: true,
          resources: [
            { type: "video", title: "Teoría de números en competencias", url: "#", completed: false, locked: true },
            { type: "pdf", title: "Algoritmos fundamentales", url: "#", completed: false, locked: true },
            { type: "exercise", title: "Ejercicios prácticos", url: "#", completed: false, locked: true }
          ]
        },
        {
          id: "unit-3-3",
          title: "Técnicas de Optimización",
          description: "Mejorando la eficiencia de algoritmos",
          completed: false,
          locked: true,
          resources: [
            { type: "video", title: "Estrategias de optimización", url: "#", completed: false, locked: true },
            { type: "pdf", title: "Patrones comunes", url: "#", completed: false, locked: true },
            { type: "exercise", title: "Optimización de soluciones", url: "#", completed: false, locked: true }
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
                  <BreadcrumbLink href="/dashboard/syllabus">Syllabus</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Avanzado</BreadcrumbPage>
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
              <h1 className="text-2xl font-semibold text-ooi-dark-blue">Syllabus - Nivel Avanzado</h1>
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{module.title}</h3>
                          {module.locked && <Lock className="h-3 w-3 text-gray-400" />}
                        </div>
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
                <Card key={module.id} className={`overflow-hidden ${module.locked ? 'opacity-75' : ''}`}>
                  <AccordionItem value={module.id} className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline" disabled={module.locked}>
                      <div className="flex flex-col items-start text-left">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-ooi-dark-blue">{module.title}</h2>
                          {module.locked ? (
                            <Badge variant="outline" className="border-gray-300 text-gray-500">
                              <Lock className="h-3 w-3 mr-1" />
                              Bloqueado
                            </Badge>
                          ) : (
                            <Badge className={module.progress > 0 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                              {module.progress > 0 ? "En progreso" : "No iniciado"}
                            </Badge>
                          )}
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
                                    'locked' in unit && unit.locked ? "bg-gray-100 text-gray-400" :
                                    unit.completed ? "bg-green-100 text-green-600" : 
                                    "bg-gray-100 text-gray-500"
                                  }`}>
                                    {('locked' in unit && unit.locked) ? (
                                      <Lock className="h-3 w-3" />
                                    ) : unit.completed ? (
                                      <Check className="h-3 w-3" />
                                    ) : null}
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-base">{unit.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{unit.description}</p>
                                  </div>
                                </div>
                                {('locked' in unit && unit.locked) ? (
                                  <Badge variant="outline" className="border-gray-300 text-gray-500">
                                    Bloqueado
                                  </Badge>
                                ) : (
                                  <Badge className={unit.completed ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                                    {unit.completed ? "Completado" : "Pendiente"}
                                  </Badge>
                                )}
                              </div>
                              
                              {!('locked' in unit && unit.locked) && (
                                <div className="mt-4 space-y-2">
                                  {unit.resources.map((resource, i) => (
                                    <div 
                                      key={i} 
                                      className={`p-3 rounded-md border flex items-center justify-between ${
                                        'locked' in resource && resource.locked ? "bg-gray-50 opacity-75" :
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
                                        {('locked' in resource && resource.locked) ? (
                                          <Badge variant="outline" className="border-gray-300 text-gray-500">
                                            <Lock className="h-3 w-3 mr-1" />
                                            Bloqueado
                                          </Badge>
                                        ) : null}
                                        {resource.completed ? (
                                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            <Check className="h-3 w-3 mr-1" />
                                            Completado
                                          </Badge>
                                        ) : (
                                          <Button size="sm" variant="default" asChild>
                                            <a href={resource.url}>
                                              Comenzar
                                              <ExternalLink className="h-3 w-3 ml-2" />
                                            </a>
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-ooi-dark-blue">
                  Requisitos para Desbloquear Contenido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md bg-gray-50">
                    <h3 className="font-medium">Algoritmos Voraces (Greedy)</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Completa al menos el 80% de los ejercicios de Programación Dinámica para desbloquear.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-md bg-gray-50">
                    <h3 className="font-medium">Estructuras de Datos Avanzadas</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Completa el módulo de Algoritmos Avanzados con una calificación mínima de 7/10.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-md bg-gray-50">
                    <h3 className="font-medium">Técnicas para Competencias</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Completa al menos el 70% de los módulos anteriores y resuelve 10 problemas en la sección de Ejercicios.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 