"use client";

import Link from "next/link";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ChevronLeft, PlayCircle, Code, BookOpen, CheckCircle, Clock, AlertCircle, Save, ExternalLink, Video, FileText } from "lucide-react";

// Add this type definition
type ExerciseData = {
  id: number;
  title: string;
  difficulty: string;
  acceptanceRate: string;
  description: string;
  examples: { 
    input: string; 
    output: string; 
    explanation: string; 
  }[];
  constraints: string[];
  solution: { 
    approach: string; 
    complexity: { 
      time: string;
      space: string;
    }; 
    code: string; 
  };
};

// Add this type definition near your other types
type TestResult = {
  success: boolean;
  results: Array<{
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }>;
};

export default function ExercisePage() {
  const params = useParams();
  const id = params.id;
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [exerciseData, setExerciseData] = useState<ExerciseData | null>(null);
  
  // Sample template code for different languages
  const templateCode = {
    cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Tu código aquí\n        \n    }\n};\n`,
    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Tu código aquí\n        \n    }\n}\n`,
    python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Tu código aquí\n        \n`,
    javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Tu código aquí\n    \n};\n`
  };
  
  // Mock exercise data
  const mockExercise = {
    id: 1,
    title: "Suma de dos números",
    difficulty: "easy",
    acceptanceRate: "95%",
    description: `<p>Dado un array de enteros <code>nums</code> y un entero <code>target</code>, devuelve los índices de los dos números que suman <code>target</code>.</p>
    <p>Puedes asumir que cada entrada tiene exactamente una solución y no puedes usar el mismo elemento dos veces.</p>
    <p>La respuesta puede devolverse en cualquier orden.</p>`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Como nums[0] + nums[1] == 9, devolvemos [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Como nums[1] + nums[2] == 6, devolvemos [1, 2]."
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Como nums[0] + nums[1] == 6, devolvemos [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    solution: {
      approach: "Usamos un hash map para almacenar los números que hemos visto anteriormente. Para cada número, comprobamos si su complemento (target - num) ya está en el hash map. Si es así, hemos encontrado la solución.",
      complexity: {
        time: "O(n) - solo un recorrido por el array",
        space: "O(n) - almacenamos como máximo n elementos en el hash map"
      },
      code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        throw new IllegalArgumentException("No solution");
    }
}`
    }
  };
  
  useEffect(() => {
    // Simulate fetching exercise data
    setExerciseData(mockExercise);
    
    // Set initial code based on selected language
    setCode(templateCode[selectedLanguage as keyof typeof templateCode]);
  }, [selectedLanguage]);
  
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };
  
  const handleRunCode = () => {
    if (!code.trim()) {
      toast.error("Por favor, escribe algún código primero");
      return;
    }
    
    setLoading(true);
    
    // Simulate running code against test cases
    setTimeout(() => {
      setLoading(false);
      
      setTestResults({
        success: Math.random() > 0.3, // 70% chance of success for demo
        results: [
          {
            input: "nums = [2,7,11,15], target = 9",
            expectedOutput: "[0,1]",
            actualOutput: "[0,1]",
            passed: true
          },
          {
            input: "nums = [3,2,4], target = 6",
            expectedOutput: "[1,2]",
            actualOutput: Math.random() > 0.3 ? "[1,2]" : "[0,2]",
            passed: Math.random() > 0.3
          },
          {
            input: "nums = [3,3], target = 6",
            expectedOutput: "[0,1]",
            actualOutput: Math.random() > 0.3 ? "[0,1]" : "[]",
            passed: Math.random() > 0.3
          }
        ]
      });
      
      toast.success("Código ejecutado");
    }, 1500);
  };
  
  const handleSubmit = () => {
    if (!code.trim()) {
      toast.error("Por favor, escribe algún código primero");
      return;
    }
    
    setLoading(true);
    
    // Simulate submitting
    setTimeout(() => {
      setLoading(false);
      toast.success("¡Solución correcta! Has resuelto el problema.");
    }, 2000);
  };
  
  if (!exerciseData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
                <BreadcrumbLink href="/dashboard/exercises">Ejercicios</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{exerciseData.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
                  <div>
                    <CardTitle className="text-xl text-ooi-dark-blue">{exerciseData.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={
                        exerciseData.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                        exerciseData.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }>
                        {exerciseData.difficulty === 'easy' && 'Fácil'}
                        {exerciseData.difficulty === 'medium' && 'Medio'}
                        {exerciseData.difficulty === 'hard' && 'Difícil'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Tasa de aceptación: {exerciseData.acceptanceRate}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs" asChild>
                    <Link href="/dashboard/exercises">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Volver a ejercicios
                    </Link>
                  </Button>
                </CardHeader>
                <Separator />
                
                <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
                  <CardContent className="p-0">
                    <TabsList className="w-full rounded-none border-b bg-transparent px-4 py-2">
                      <TabsTrigger value="description" className="rounded-sm data-[state=active]:rounded-sm data-[state=active]:border-b-2 data-[state=active]:border-ooi-second-blue data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Descripción
                      </TabsTrigger>
                      <TabsTrigger value="solution" className="rounded-sm data-[state=active]:rounded-sm data-[state=active]:border-b-2 data-[state=active]:border-ooi-second-blue data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                        <Code className="h-4 w-4 mr-2" />
                        Solución
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="description" className="p-4 space-y-4">
                      <div dangerouslySetInnerHTML={{ __html: exerciseData.description }} />
                      
                      <div>
                        <h3 className="text-md font-semibold mb-2">Ejemplos:</h3>
                        <div className="space-y-3">
                          {exerciseData.examples.map((example, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-md border">
                              <div className="mb-1">
                                <span className="font-medium">Entrada:</span> {example.input}
                              </div>
                              <div className="mb-1">
                                <span className="font-medium">Salida:</span> {example.output}
                              </div>
                              {example.explanation && (
                                <div className="text-gray-700 text-sm">
                                  <span className="font-medium">Explicación:</span> {example.explanation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-semibold mb-2">Restricciones:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {exerciseData.constraints.map((constraint, index) => (
                            <li key={index}>{constraint}</li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="solution" className="p-4 space-y-4">
                      <div>
                        <h3 className="text-md font-semibold mb-2">Enfoque:</h3>
                        <p className="text-gray-800">{exerciseData.solution.approach}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-semibold mb-2">Complejidad:</h3>
                        <div className="p-3 bg-gray-50 rounded-md border">
                          <div className="mb-1">
                            <span className="font-medium">Tiempo:</span> {exerciseData.solution.complexity.time}
                          </div>
                          <div>
                            <span className="font-medium">Espacio:</span> {exerciseData.solution.complexity.space}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-md font-semibold mb-2">Código:</h3>
                        <pre className="p-3 bg-gray-50 rounded-md border overflow-auto text-sm">
                          <code>{exerciseData.solution.code}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
                  <CardTitle className="text-lg">Editor de código</CardTitle>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="Selecciona lenguaje" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <Separator />
                <CardContent className="p-0">
                  <div className="h-64 border-b p-4 font-mono text-sm overflow-auto bg-gray-50">
                    <pre>{code}</pre>
                  </div>
                  
                  <div className="p-4 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Escribe tu solución y ejecútala para probar
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleRunCode} disabled={loading}>
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                            Ejecutando...
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Ejecutar código
                          </>
                        )}
                      </Button>
                      <Button size="sm" onClick={handleSubmit} disabled={loading} className="bg-ooi-second-blue hover:bg-ooi-blue-hover">
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1" />
                            Enviar solución
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {testResults && (
                <Card>
                  <CardHeader className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Resultados de las pruebas</CardTitle>
                      <Badge className={testResults.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {testResults.success ? (
                          <span className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Pasado
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Fallido
                          </span>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    <div className="space-y-3">
                      {testResults.results.map((result, index) => (
                        <div key={index} className={`p-3 rounded-md border ${result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                          <div className="flex items-center gap-1 mb-1">
                            {result.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">Caso de prueba {index + 1}</span>
                          </div>
                          <div className="text-xs space-y-1">
                            <div><span className="font-medium">Entrada:</span> {result.input}</div>
                            <div><span className="font-medium">Salida esperada:</span> {result.expectedOutput}</div>
                            <div><span className="font-medium">Tu salida:</span> {result.actualOutput}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-2"
          >
            <Card>
              <CardHeader className="px-4 py-3">
                <CardTitle className="text-base font-medium">Recursos adicionales</CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a 
                    href="#" 
                    className="p-3 border rounded-md hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Video explicativo</h3>
                      <p className="text-xs text-gray-500">Aprende el enfoque paso a paso</p>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                  
                  <a 
                    href="#" 
                    className="p-3 border rounded-md hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Guía de estudio</h3>
                      <p className="text-xs text-gray-500">Conceptos relacionados</p>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                  
                  <a 
                    href="#" 
                    className="p-3 border rounded-md hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Code className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Problemas similares</h3>
                      <p className="text-xs text-gray-500">Practica con ejercicios relacionados</p>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 