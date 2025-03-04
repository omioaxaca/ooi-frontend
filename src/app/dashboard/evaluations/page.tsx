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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { FileText, Calendar, CheckCircle, AlertCircle, Clock, ExternalLink, Award } from "lucide-react";

export default function EvaluationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Sample evaluations data
  const evaluations = [
    {
      id: 1,
      title: "Tarea 1: Introducción a algoritmos",
      type: "homework",
      status: "completed",
      deadline: "30 marzo, 2025",
      submitDate: "28 marzo, 2025",
      score: 9.5,
      maxScore: 10,
      feedback: "Excelente trabajo. Buena comprensión de los conceptos básicos.",
      description: "Resolver los 5 problemas sobre algoritmos básicos y estructuras de control.",
      url: "/dashboard/evaluations/1"
    },
    {
      id: 2,
      title: "Evaluación: Fundamentos de programación",
      type: "exam",
      status: "completed",
      deadline: "10 abril, 2025",
      submitDate: "10 abril, 2025",
      score: 85,
      maxScore: 100,
      feedback: "Buen dominio de los conceptos fundamentales. Necesitas mejorar en recursividad.",
      description: "Examen que cubre los temas de las primeras 3 clases: introducción, algoritmos básicos y estructuras de control.",
      url: "/dashboard/evaluations/2"
    },
    {
      id: 3,
      title: "Tarea 2: Estructuras de datos",
      type: "homework",
      status: "in-progress",
      deadline: "20 abril, 2025",
      submitDate: null,
      score: null,
      maxScore: 10,
      feedback: null,
      description: "Implementar diferentes estructuras de datos: listas enlazadas, pilas y colas.",
      url: "/dashboard/evaluations/3"
    },
    {
      id: 4,
      title: "Proyecto: Aplicación básica",
      type: "project",
      status: "upcoming",
      deadline: "15 mayo, 2025",
      submitDate: null,
      score: null,
      maxScore: 100,
      feedback: null,
      description: "Desarrollar una aplicación de consola que implemente los conceptos aprendidos hasta ahora.",
      url: "/dashboard/evaluations/4"
    },
    {
      id: 5,
      title: "Evaluación: Programación Orientada a Objetos",
      type: "exam",
      status: "upcoming",
      deadline: "30 mayo, 2025",
      submitDate: null,
      score: null,
      maxScore: 100,
      feedback: null,
      description: "Examen que cubre los temas del módulo de POO: clases, objetos, herencia y polimorfismo.",
      url: "/dashboard/evaluations/5"
    }
  ];

  // Get filtered evaluations based on tab
  const getFilteredEvaluations = (tabValue) => {
    return tabValue === "all"
      ? evaluations
      : evaluations.filter(item => item.type === tabValue || (tabValue === "upcoming" && item.status === "upcoming"));
  };

  // Reusable component for rendering evaluation cards
  const EvaluationsList = ({ evaluations }) => (
    <>
      {evaluations.length > 0 ? (
        evaluations.map((evaluation) => (
          <Card
            key={evaluation.id}
            className={`mb-4 overflow-hidden border-l-4 ${
              evaluation.status === 'completed' 
                ? 'border-l-green-500' 
                : evaluation.status === 'in-progress'
                ? 'border-l-yellow-500'
                : 'border-l-blue-500'
            }`}
          >
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={
                      evaluation.type === 'homework' ? 'bg-indigo-100 text-indigo-800' : 
                      evaluation.type === 'exam' ? 'bg-red-100 text-red-800' : 
                      'bg-purple-100 text-purple-800'
                    }>
                      {evaluation.type === 'homework' && 'Tarea'}
                      {evaluation.type === 'exam' && 'Examen'}
                      {evaluation.type === 'project' && 'Proyecto'}
                    </Badge>
                    
                    <Badge className={
                      evaluation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      evaluation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }>
                      {evaluation.status === 'completed' && 'Completado'}
                      {evaluation.status === 'in-progress' && 'En progreso'}
                      {evaluation.status === 'upcoming' && 'Próximamente'}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-1">{evaluation.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{evaluation.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Fecha límite: {evaluation.deadline}</span>
                    </div>
                    
                    {evaluation.submitDate && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Entregado: {evaluation.submitDate}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-center md:items-end gap-2">
                  {evaluation.status === 'completed' ? (
                    <>
                      <div className="text-2xl font-bold text-green-600">
                        {evaluation.score}/{evaluation.maxScore}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(evaluation.score / evaluation.maxScore * 100).toFixed(1)}%
                      </div>
                    </>
                  ) : (
                    <Badge className={
                      evaluation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {evaluation.status === 'in-progress' ? 'Pendiente' : 'Próxima'}
                    </Badge>
                  )}
                  
                  <Button size="sm" className="mt-2" asChild>
                    <a href={evaluation.url}>
                      {evaluation.status === 'completed' 
                        ? 'Ver detalles' 
                        : evaluation.status === 'in-progress'
                        ? 'Continuar'
                        : 'Ver información'}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
              
              {evaluation.feedback && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md border text-sm">
                  <p className="font-medium mb-1">Retroalimentación:</p>
                  <p className="text-gray-700">{evaluation.feedback}</p>
                </div>
              )}
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-12 text-gray-500">
          No hay evaluaciones disponibles en esta categoría
        </div>
      )}
    </>
  );

  return (
    <SidebarProvider>
      <SidebarTrigger />
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col gap-4 p-4 md:p-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Evaluaciones</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-ooi-dark-blue">Evaluaciones</CardTitle>
                <CardDescription>
                  Tareas, exámenes, proyectos y otras actividades evaluativas del curso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="homework">Tareas</TabsTrigger>
                    <TabsTrigger value="exam">Exámenes</TabsTrigger>
                    <TabsTrigger value="project">Proyectos</TabsTrigger>
                    <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-0">
                    <EvaluationsList evaluations={getFilteredEvaluations("all")} />
                  </TabsContent>
                  
                  <TabsContent value="homework" className="mt-0">
                    <EvaluationsList evaluations={getFilteredEvaluations("homework")} />
                  </TabsContent>
                  
                  <TabsContent value="exam" className="mt-0">
                    <EvaluationsList evaluations={getFilteredEvaluations("exam")} />
                  </TabsContent>
                  
                  <TabsContent value="project" className="mt-0">
                    <EvaluationsList evaluations={getFilteredEvaluations("project")} />
                  </TabsContent>
                  
                  <TabsContent value="upcoming" className="mt-0">
                    <EvaluationsList evaluations={getFilteredEvaluations("upcoming")} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 