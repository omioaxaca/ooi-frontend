"use client";

import { useEffect, useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BarChart2, Award, TrendingUp, Check, Clock, FileQuestion } from "lucide-react";
import { WithConstructionBanner } from "@/components/with-construction-banner";

export default function ProgressPage() {
  const [userName, setUserName] = useState("");
  const [progressData, setProgressData] = useState({
    overall: 45, // Overall course completion percentage
    attendance: 100,
    homeworks: 67,
    exams: 85,
    exercises: 38
  });

  useEffect(() => {
    // Get user info from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserName(user.firstName || 'estudiante');
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  // Sample data for recent activities
  const recentActivities = [
    {
      type: "homework",
      title: "Tarea: Algoritmos Básicos",
      score: 9,
      maxScore: 10,
      date: "31 marzo, 2026",
      status: "completed"
    },
    {
      type: "exam",
      title: "Examen: Introducción a la Programación",
      score: 85,
      maxScore: 100,
      date: "10 abril, 2026",
      status: "completed"
    },
    {
      type: "exercise",
      title: "Ejercicio: Bubble Sort",
      score: null,
      maxScore: null,
      date: "5 abril, 2026",
      status: "completed"
    },
    {
      type: "exercise",
      title: "Ejercicio: Binary Search",
      score: null,
      maxScore: null,
      date: "8 abril, 2026",
      status: "in-progress"
    },
    {
      type: "homework",
      title: "Tarea: Estructuras de Datos",
      score: null,
      maxScore: 10,
      date: "15 abril, 2026",
      status: "pending"
    }
  ];

  // Sample data for skills
  const skills = [
    {
      name: "Pensamiento algorítmico",
      level: 65,
      description: "Capacidad para diseñar algoritmos eficientes y estructurados."
    },
    {
      name: "Estructuras de datos",
      level: 40,
      description: "Conocimiento y aplicación de estructuras de datos fundamentales."
    },
    {
      name: "Resolución de problemas",
      level: 70,
      description: "Habilidad para analizar y resolver problemas complejos."
    },
    {
      name: "Programación orientada a objetos",
      level: 30,
      description: "Entendimiento de los principios de la POO."
    },
    {
      name: "Complejidad algorítmica",
      level: 25,
      description: "Análisis de la eficiencia temporal y espacial de algoritmos."
    }
  ];

  // Sample data for next goals
  const nextGoals = [
    {
      title: "Completar módulo de estructuras de datos",
      deadline: "30 abril, 2026",
      progress: 40
    },
    {
      title: "Resolver 10 ejercicios de nivel intermedio",
      deadline: "15 mayo, 2026",
      progress: 20
    },
    {
      title: "Participar en la competencia mensual",
      deadline: "22 abril, 2026",
      progress: 0
    }
  ];

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
                    <BreadcrumbPage>Tu Progreso</BreadcrumbPage>
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
                <BarChart2 className="h-5 w-5 text-ooi-second-blue" />
                <h1 className="text-2xl font-semibold text-ooi-dark-blue">Tu Progreso</h1>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="mb-6">
                <CardHeader className="bg-gradient-to-r from-ooi-second-blue/20 to-transparent">
                  <CardTitle className="text-xl text-ooi-dark-blue">
                    Resumen de progreso
                  </CardTitle>
                  <CardDescription>
                    Olimpiada Oaxaqueña de Informática 2026
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Progreso general del curso</span>
                      <span className="font-medium">{progressData.overall}%</span>
                    </div>
                    <Progress value={progressData.overall} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-blue-700">Asistencia</p>
                          <p className="text-2xl font-bold text-blue-800">{progressData.attendance}%</p>
                        </div>
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-blue-700" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-green-700">Tareas</p>
                          <p className="text-2xl font-bold text-green-800">{progressData.homeworks}%</p>
                        </div>
                        <div className="bg-green-100 p-2 rounded-full">
                          <FileQuestion className="h-5 w-5 text-green-700" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-yellow-700">Exámenes</p>
                          <p className="text-2xl font-bold text-yellow-800">{progressData.exams}%</p>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded-full">
                          <Award className="h-5 w-5 text-yellow-700" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-purple-700">Ejercicios</p>
                          <p className="text-2xl font-bold text-purple-800">{progressData.exercises}%</p>
                        </div>
                        <div className="bg-purple-100 p-2 rounded-full">
                          <TrendingUp className="h-5 w-5 text-purple-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-ooi-dark-blue">
                      Actividades recientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, i) => (
                        <div key={i} className="flex gap-4 border-b pb-4 last:border-0">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                            activity.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {activity.status === 'completed' ? <Check className="h-5 w-5" /> :
                             activity.status === 'in-progress' ? <Clock className="h-5 w-5" /> :
                             <FileQuestion className="h-5 w-5" />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-sm">{activity.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                              </div>
                              {activity.status === 'completed' && activity.score !== null && (
                                <Badge className="bg-green-100 text-green-800">
                                  {activity.score}/{activity.maxScore}
                                </Badge>
                              )}
                              {activity.status === 'in-progress' && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  En progreso
                                </Badge>
                              )}
                              {activity.status === 'pending' && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Pendiente
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-ooi-dark-blue">
                        Habilidades
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {skills.map((skill, i) => (
                          <div key={i}>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-sm text-gray-500">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2 mb-1" />
                            <p className="text-xs text-gray-500">{skill.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-ooi-dark-blue">
                        Objetivos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {nextGoals.map((goal, i) => (
                          <div key={i}>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">{goal.title}</span>
                              <span className="text-xs text-gray-500">{goal.deadline}</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">
                              {goal.progress}% completado
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </WithConstructionBanner>
      </SidebarInset>
    </>
  );
}