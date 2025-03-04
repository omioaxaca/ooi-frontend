"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ChevronLeft, FileText, Calendar, CheckCircle, AlertCircle, Clock, Upload, Award, Download, ExternalLink } from "lucide-react";

export default function EvaluationDetailPage() {
  const params = useParams();
  const id = params.id;
  const [activeTab, setActiveTab] = useState("overview");
  const [evaluationData, setEvaluationData] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Sample evaluation data
  const sampleEvaluation = {
    id: 2,
    title: "Evaluación: Fundamentos de programación",
    type: "exam",
    status: "completed",
    deadline: "10 abril, 2025 - 23:59",
    submitDate: "10 abril, 2025 - 17:45",
    score: 85,
    maxScore: 100,
    feedback: "Buen dominio de los conceptos fundamentales. Necesitas mejorar en recursividad y análisis de algoritmos. Tu implementación de estructuras de datos es correcta pero podría ser más eficiente. Sigue así, vas por buen camino.",
    description: "Examen que cubre los temas de las primeras 3 clases: introducción, algoritmos básicos y estructuras de control.",
    instructions: `<p>Este examen evalúa tu comprensión de los fundamentos de programación vistos en las primeras 3 semanas del curso.</p>
    <p>Instrucciones:</p>
    <ul>
      <li>Tienes 2 horas para completar el examen.</li>
      <li>Puedes consultar la documentación oficial pero no buscar soluciones directas.</li>
      <li>Implementa todas las funciones solicitadas siguiendo las especificaciones.</li>
      <li>Entrega el examen en un único archivo .zip con todos tus archivos de solución.</li>
    </ul>`,
    sections: [
      {
        title: "Parte 1: Conceptos Básicos",
        points: 30,
        earned: 28,
        questions: [
          {
            id: 1,
            question: "Explica la diferencia entre compilación e interpretación.",
            points: 10,
            earned: 10,
            feedback: "Respuesta completa y precisa."
          },
          {
            id: 2,
            question: "Describe los tipos de datos primitivos en C++.",
            points: 10,
            earned: 10,
            feedback: "Excelente descripción de todos los tipos."
          },
          {
            id: 3,
            question: "Explica el concepto de variable y constante.",
            points: 10,
            earned: 8,
            feedback: "Faltó mencionar el ámbito de las variables."
          }
        ]
      },
      {
        title: "Parte 2: Estructuras de Control",
        points: 30,
        earned: 27,
        questions: [
          {
            id: 4,
            question: "Implementa un algoritmo que determine si un número es primo.",
            points: 15,
            earned: 15,
            feedback: "Implementación correcta y eficiente."
          },
          {
            id: 5,
            question: "Escribe un programa que genere la secuencia de Fibonacci hasta n términos.",
            points: 15,
            earned: 12,
            feedback: "La implementación es correcta pero podría ser más eficiente."
          }
        ]
      },
      {
        title: "Parte 3: Algoritmos",
        points: 40,
        earned: 30,
        questions: [
          {
            id: 6,
            question: "Implementa el algoritmo de ordenamiento por selección.",
            points: 20,
            earned: 18,
            feedback: "Buen algoritmo, pero falta analizar su complejidad."
          },
          {
            id: 7,
            question: "Implementa una función recursiva para calcular el factorial de un número.",
            points: 20,
            earned: 12,
            feedback: "La implementación no maneja correctamente los casos base."
          }
        ]
      }
    ],
    resources: [
      {
        title: "Guía de estudio",
        type: "pdf",
        url: "#" 
      },
      {
        title: "Clase grabada: Algoritmos básicos",
        type: "video",
        url: "#"
      }
    ]
  };
  
  useEffect(() => {
    // Simulate fetching evaluation data
    setEvaluationData(sampleEvaluation);
  }, [id]);
  
  const handleFileChange = (e) => {
    setFileUpload(e.target.files[0]);
  };
  
  const handleSubmit = () => {
    if (!fileUpload) {
      toast.error("Por favor selecciona un archivo para entregar");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to submit assignment
    setTimeout(() => {
      toast.success("Evaluación entregada correctamente");
      setLoading(false);
      setFileUpload(null);
    }, 1500);
  };
  
  if (!evaluationData) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ooi-second-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando evaluación...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/evaluations">
                    Evaluaciones
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{evaluationData.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <Button variant="outline" size="sm" className="mb-4" asChild>
                <a href="/dashboard/evaluations">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Volver a evaluaciones
                </a>
              </Button>
              
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-ooi-dark-blue">{evaluationData.title}</h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={
                      evaluationData.type === 'homework' ? 'bg-green-100 text-green-800' :
                      evaluationData.type === 'exam' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {evaluationData.type === 'homework' ? 'Tarea' :
                       evaluationData.type === 'exam' ? 'Examen' : 'Cuestionario'}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Fecha límite: {evaluationData.deadline}</span>
                    </div>
                    
                    {evaluationData.status === 'completed' && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completado</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {evaluationData.status === 'completed' ? (
                  <div className="p-2 rounded-md bg-green-50 border border-green-200 text-center mt-4 md:mt-0">
                    <div className="text-2xl font-bold text-green-600">
                      {evaluationData.score}/{evaluationData.maxScore}
                    </div>
                    <div className="text-sm text-green-700">
                      {(evaluationData.score / evaluationData.maxScore * 100).toFixed(1)}%
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 md:mt-0">
                    <Button 
                      size="sm" 
                      className="bg-ooi-second-blue hover:bg-ooi-blue-hover"
                      onClick={() => setActiveTab('submit')}
                    >
                      Entregar evaluación
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="px-6 py-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Descripción</span>
                    </TabsTrigger>
                    <TabsTrigger value="results" className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      <span>Resultados</span>
                    </TabsTrigger>
                    <TabsTrigger value="submit" className="flex items-center gap-1">
                      <Upload className="h-4 w-4" />
                      <span>Entregar</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              
              <CardContent className="px-6">
                <TabsContent value="overview" className="mt-0 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                    <p className="text-gray-700">{evaluationData.description}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Instrucciones</h2>
                    <div 
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: evaluationData.instructions }}
                    />
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Recursos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {evaluationData.resources.map((resource, i) => (
                        <a 
                          key={i}
                          href={resource.url}
                          className="p-3 border rounded-md hover:bg-gray-50 flex items-center gap-3"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                            resource.type === 'pdf' ? 'bg-red-100 text-red-600' : 
                            resource.type === 'video' ? 'bg-blue-100 text-blue-600' : 
                            'bg-green-100 text-green-600'
                          }`}>
                            {resource.type === 'pdf' ? (
                              <FileText className="h-5 w-5" />
                            ) : resource.type === 'video' ? (
                              <Video className="h-5 w-5" />
                            ) : (
                              <Download className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{resource.title}</p>
                            <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="results" className="mt-0 space-y-6">
                  {evaluationData.status === 'completed' ? (
                    <>
                      <div>
                        <h2 className="text-lg font-semibold mb-2">Calificación</h2>
                        <div className="rounded-md overflow-hidden border">
                          <div className="bg-gray-50 p-3 border-b">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Puntaje total</span>
                              <div className="text-xl font-bold text-ooi-dark-blue">
                                {evaluationData.score}/{evaluationData.maxScore}
                                <span className="text-sm text-gray-500 ml-2">
                                  ({(evaluationData.score / evaluationData.maxScore * 100).toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Progress value={(evaluationData.score / evaluationData.maxScore) * 100} className="h-2" />
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-medium mb-3">Retroalimentación</h3>
                            <p className="text-gray-700 p-3 bg-gray-50 rounded-md border">
                              {evaluationData.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h2 className="text-lg font-semibold mb-2">Detalles por sección</h2>
                        <div className="space-y-4">
                          {evaluationData.sections.map((section, i) => (
                            <Card key={i}>
                              <CardHeader className="px-4 py-3">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-base font-medium">{section.title}</CardTitle>
                                  <div className="text-sm">
                                    <span className="font-bold">{section.earned}</span>
                                    <span className="text-gray-500">/{section.points}</span>
                                  </div>
                                </div>
                                <Progress 
                                  value={(section.earned / section.points) * 100} 
                                  className="h-1.5 mt-2" 
                                />
                              </CardHeader>
                              <CardContent className="px-4 py-3">
                                <div className="space-y-4">
                                  {section.questions.map((question, j) => (
                                    <div key={j} className="p-3 border rounded-md">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <p className="font-medium">{question.question}</p>
                                        </div>
                                        <div className="ml-4 text-right">
                                          <Badge className={
                                            question.earned === question.points ? 'bg-green-100 text-green-800' : 
                                            question.earned > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-red-100 text-red-800'
                                          }>
                                            {question.earned}/{question.points}
                                          </Badge>
                                        </div>
                                      </div>
                                      
                                      {question.feedback && (
                                        <div className="mt-2 text-sm bg-gray-50 p-2 rounded-md">
                                          <span className="font-medium">Comentario:</span> {question.feedback}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aún no hay resultados disponibles</h3>
                      <p className="text-gray-500 max-w-md">
                        Los resultados estarán disponibles después de que entregues la evaluación y sea calificada por el instructor.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="submit" className="mt-0">
                  {evaluationData.status === 'completed' ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Evaluación ya entregada</h3>
                      <p className="text-gray-500 max-w-md">
                        Esta evaluación ya ha sido completada y calificada. Puedes revisar tus resultados en la pestaña correspondiente.
                      </p>
                      <Button
                        className="mt-4"
                        variant="outline"
                        onClick={() => setActiveTab('results')}
                      >
                        Ver resultados
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      <div>
                        <h2 className="text-lg font-semibold mb-2">Entregar evaluación</h2>
                        <p className="text-gray-700 mb-4">
                          Sube tu archivo con la solución siguiendo las instrucciones proporcionadas.
                        </p>
                        
                        <div className="space-y-4">
                          <div className="border-2 border-dashed rounded-md p-6 text-center">
                            <div className="mb-3">
                              <Upload className="h-8 w-8 mx-auto text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 mb-3">
                              Arrastra y suelta tu archivo aquí, o
                            </p>
                            <Input
                              type="file"
                              id="file-upload"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <Label htmlFor="file-upload" className="cursor-pointer">
                              <Button variant="outline" type="button">
                                Seleccionar archivo
                              </Button>
                            </Label>
                            {fileUpload && (
                              <p className="mt-2 text-sm text-green-600">
                                Archivo seleccionado: {fileUpload.name}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                            <Textarea
                              id="notes"
                              placeholder="Si tienes alguna nota o comentario para el instructor, escríbelo aquí."
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <Clock className="inline-block h-4 w-4 mr-1" />
                            Fecha límite: {evaluationData.deadline}
                          </div>
                          <Button 
                            className="bg-ooi-second-blue hover:bg-ooi-blue-hover"
                            onClick={handleSubmit}
                            disabled={loading || !fileUpload}
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Procesando...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-1" />
                                Entregar evaluación
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 