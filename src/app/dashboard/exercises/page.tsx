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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Code, Search, CheckCircle, Star, ArrowRight, Filter, SortAsc, SortDesc, ChevronRight } from "lucide-react";
import { WithConstructionBanner } from "@/components/with-construction-banner";

export default function ExercisesPage() {
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("difficulty-asc");
  
  // Sample exercises data
  const exercises = [
    {
      id: 1,
      title: "Suma de dos números",
      description: "Dado un array de números y un valor objetivo, encuentra dos números que sumen al objetivo.",
      difficulty: "easy",
      topics: ["arrays", "hash table"],
      status: "completed",
      completedDate: "15 marzo, 2025",
      acceptanceRate: "95%",
      url: "/dashboard/exercises/1"
    },
    {
      id: 2,
      title: "Palindrome Checker",
      description: "Verifica si una cadena es un palíndromo (se lee igual de izquierda a derecha y viceversa).",
      difficulty: "easy",
      topics: ["strings", "two pointers"],
      status: "completed",
      completedDate: "17 marzo, 2025",
      acceptanceRate: "92%",
      url: "/dashboard/exercises/2"
    },
    {
      id: 3,
      title: "Reverse Linked List",
      description: "Invierte una lista enlazada simple.",
      difficulty: "medium",
      topics: ["linked list", "recursion"],
      status: "attempted",
      completedDate: null,
      acceptanceRate: "68%",
      url: "/dashboard/exercises/3"
    },
    {
      id: 4,
      title: "Binary Search",
      description: "Implementa el algoritmo de búsqueda binaria.",
      difficulty: "easy",
      topics: ["binary search", "arrays"],
      status: "not-attempted",
      completedDate: null,
      acceptanceRate: "78%",
      url: "/dashboard/exercises/4"
    },
    {
      id: 5,
      title: "Merge Sorted Arrays",
      description: "Combina dos arrays ordenados en uno solo manteniendo el orden.",
      difficulty: "easy",
      topics: ["arrays", "two pointers"],
      status: "not-attempted",
      completedDate: null,
      acceptanceRate: "82%",
      url: "/dashboard/exercises/5"
    },
    {
      id: 6,
      title: "Valid Parentheses",
      description: "Verifica si una cadena de paréntesis, corchetes y llaves está correctamente balanceada.",
      difficulty: "easy",
      topics: ["stack", "strings"],
      status: "completed",
      completedDate: "20 marzo, 2025",
      acceptanceRate: "89%",
      url: "/dashboard/exercises/6"
    },
    {
      id: 7,
      title: "Maximum Subarray",
      description: "Encuentra el subarray contiguo con la mayor suma.",
      difficulty: "medium",
      topics: ["arrays", "dynamic programming"],
      status: "attempted",
      completedDate: null,
      acceptanceRate: "64%",
      url: "/dashboard/exercises/7"
    },
    {
      id: 8,
      title: "Binary Tree Level Order Traversal",
      description: "Recorre un árbol binario por niveles.",
      difficulty: "medium",
      topics: ["tree", "breadth-first search"],
      status: "not-attempted",
      completedDate: null,
      acceptanceRate: "59%",
      url: "/dashboard/exercises/8"
    },
    {
      id: 9,
      title: "Longest Substring Without Repeating Characters",
      description: "Encuentra la longitud de la subcadena más larga sin caracteres repetidos.",
      difficulty: "medium",
      topics: ["strings", "sliding window", "hash table"],
      status: "not-attempted",
      completedDate: null,
      acceptanceRate: "56%",
      url: "/dashboard/exercises/9"
    },
    {
      id: 10,
      title: "Trapping Rain Water",
      description: "Calcula cuánta agua puede ser atrapada después de llover.",
      difficulty: "hard",
      topics: ["arrays", "two pointers", "dynamic programming"],
      status: "not-attempted",
      completedDate: null,
      acceptanceRate: "42%",
      url: "/dashboard/exercises/10"
    },
    {
      id: 11,
      title: "LRU Cache",
      description: "Implementa una estructura de caché con política Least Recently Used (LRU).",
      difficulty: "hard",
      topics: ["design", "hash table", "linked list"],
      status: "not-attempted",
      completedDate: null,
      acceptanceRate: "38%",
      url: "/dashboard/exercises/11"
    },
    {
      id: 12,
      title: "Merge K Sorted Lists",
      description: "Combina K listas enlazadas ordenadas en una sola lista ordenada.",
      difficulty: "hard",
      topics: ["linked list", "divide and conquer", "heap"],
      status: "not-attempted",
      completedDate: null,
      acceptanceRate: "35%",
      url: "/dashboard/exercises/12"
    },
  ];
  
  // Get available topics from exercises
  const allTopics = [...new Set(exercises.flatMap(ex => ex.topics))].sort();
  
  // Apply filters
  const filteredExercises = exercises.filter(exercise => {
    // Apply search filter
    if (searchQuery && !exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !exercise.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply difficulty filter
    if (difficultyFilter !== "all" && exercise.difficulty !== difficultyFilter) {
      return false;
    }
    
    // Apply topic filter
    if (topicFilter !== "all" && !exercise.topics.includes(topicFilter)) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter !== "all" && exercise.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Sort exercises
  const sortedExercises = [...filteredExercises].sort((a, b) => {
    switch (sortBy) {
      case "difficulty-asc":
        const difficultyOrder = { "easy": 1, "medium": 2, "hard": 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      case "difficulty-desc":
        const difficultyOrderDesc = { "easy": 1, "medium": 2, "hard": 3 };
        return difficultyOrderDesc[b.difficulty as keyof typeof difficultyOrderDesc] - difficultyOrderDesc[a.difficulty as keyof typeof difficultyOrderDesc];
      case "acceptance-asc":
        return parseInt(a.acceptanceRate) - parseInt(b.acceptanceRate);
      case "acceptance-desc":
        return parseInt(b.acceptanceRate) - parseInt(a.acceptanceRate);
      default:
        return 0;
    }
  });
  
  // Helper function to get color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Helper function to get status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "completed": return { text: "Completado", icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      case "attempted": return { text: "Intentado", icon: <Star className="h-4 w-4 text-yellow-500" /> };
      case "not-attempted": return { text: "No intentado", icon: null };
      default: return { text: "Desconocido", icon: null };
    }
  };

  return (
    <>
      <SidebarTrigger />
      <AppSidebar />
      <SidebarInset>
        <WithConstructionBanner>
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
                    <BreadcrumbPage>Ejercicios</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-between items-center mb-4"
            >
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-ooi-second-blue" />
                <h1 className="text-2xl font-semibold text-ooi-dark-blue">Ejercicios</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Fácil</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Medio</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Difícil</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Buscar ejercicios por título o descripción..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                        <SelectTrigger className="w-[140px]">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>Dificultad</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="easy">Fácil</SelectItem>
                          <SelectItem value="medium">Medio</SelectItem>
                          <SelectItem value="hard">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={topicFilter} onValueChange={setTopicFilter}>
                        <SelectTrigger className="w-[140px]">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>Tema</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {allTopics.map(topic => (
                            <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span>Estado</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="completed">Completados</SelectItem>
                          <SelectItem value="attempted">Intentados</SelectItem>
                          <SelectItem value="not-attempted">No intentados</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px]">
                          <div className="flex items-center gap-2">
                            {sortBy.includes('asc') ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                            <span>Ordenar</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="difficulty-asc">Dificultad ↑</SelectItem>
                          <SelectItem value="difficulty-desc">Dificultad ↓</SelectItem>
                          <SelectItem value="acceptance-asc">Aceptación ↑</SelectItem>
                          <SelectItem value="acceptance-desc">Aceptación ↓</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {sortedExercises.length > 0 ? (
                      sortedExercises.map((exercise) => (
                        <motion.div 
                          key={exercise.id}
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="border overflow-hidden">
                            <div className="flex items-stretch">
                              <div className={`w-2 ${
                                exercise.difficulty === 'easy' ? 'bg-green-500' :
                                exercise.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              
                              <div className="flex-1 flex items-center p-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{exercise.title}</h3>
                                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                                      {exercise.difficulty === 'easy' ? 'Fácil' :
                                       exercise.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                                  
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {exercise.topics.map((topic, i) => (
                                      <Badge key={i} variant="outline" className="text-xs bg-gray-50">
                                        {topic}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-2 ml-4">
                                  <div className="flex items-center">
                                    {getStatusDisplay(exercise.status).icon}
                                    <span className="text-sm text-gray-600 ml-1">
                                      {getStatusDisplay(exercise.status).text}
                                    </span>
                                  </div>
                                  
                                  <div className="text-xs text-gray-500">
                                    Aceptación: {exercise.acceptanceRate}
                                  </div>
                                  
                                  <Button size="sm" asChild>
                                    <a href={exercise.url} className="mt-2">
                                      {exercise.status === 'completed' ? 'Revisar' : 'Resolver'}
                                      <ChevronRight className="h-4 w-4 ml-1" />
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        No se encontraron ejercicios que coincidan con los filtros aplicados.
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Mostrando {sortedExercises.length} de {exercises.length} ejercicios
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" disabled>
                        Anterior
                      </Button>
                      <Button size="sm" variant="outline" disabled>
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-ooi-dark-blue">
                    Estadísticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-ooi-second-blue mb-2">
                        {exercises.filter(ex => ex.status === 'completed').length}
                      </div>
                      <div className="text-sm text-gray-600">Problemas resueltos</div>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-yellow-500 mb-2">
                        {exercises.filter(ex => ex.status === 'attempted').length}
                      </div>
                      <div className="text-sm text-gray-600">Problemas intentados</div>
                    </div>
                    
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-gray-700 mb-2">
                        {exercises.filter(ex => ex.status === 'not-attempted').length}
                      </div>
                      <div className="text-sm text-gray-600">Problemas pendientes</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Progreso por dificultad</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Fácil</span>
                          <span>{exercises.filter(ex => ex.difficulty === 'easy' && ex.status === 'completed').length} / {exercises.filter(ex => ex.difficulty === 'easy').length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(exercises.filter(ex => ex.difficulty === 'easy' && ex.status === 'completed').length / Math.max(1, exercises.filter(ex => ex.difficulty === 'easy').length)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Medio</span>
                          <span>{exercises.filter(ex => ex.difficulty === 'medium' && ex.status === 'completed').length} / {exercises.filter(ex => ex.difficulty === 'medium').length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${(exercises.filter(ex => ex.difficulty === 'medium' && ex.status === 'completed').length / Math.max(1, exercises.filter(ex => ex.difficulty === 'medium').length)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Difícil</span>
                          <span>{exercises.filter(ex => ex.difficulty === 'hard' && ex.status === 'completed').length} / {exercises.filter(ex => ex.difficulty === 'hard').length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(exercises.filter(ex => ex.difficulty === 'hard' && ex.status === 'completed').length / Math.max(1, exercises.filter(ex => ex.difficulty === 'hard').length)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </WithConstructionBanner>
      </SidebarInset>
    </>
  );
} 