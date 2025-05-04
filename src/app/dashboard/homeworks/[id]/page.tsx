"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { 
  ChevronLeft, 
  FileText, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Upload, 
  Download, 
  ExternalLink, 
  File, 
  Paperclip
} from "lucide-react";
import { 
  fetchHomeworkById, 
  fetchUserHomeworkAttempts,
  submitHomeworkAttempt
} from "@/services/homeworkService";
import { format } from "date-fns";

import type { Homework, HomeworkAttempt, NewHomeworkAttempt } from "@/types/dashboard/homework";
import type { StrapiFile } from "@/types/common";

export default function HomeworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homework, setHomework] = useState<Homework | null>(null);
  const [userAttempts, setUserAttempts] = useState<HomeworkAttempt[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [userNotes, setUserNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  useEffect(() => {
    const loadHomework = async () => {
      try {
        setLoading(true);
        
        // Fetch homework details
        const homeworkData = await fetchHomeworkById(id);

        setHomework(homeworkData);
        
        // Fetch user's attempts for this homework
        const attempts = await fetchUserHomeworkAttempts();
        const homeworkAttempts = attempts.filter(
          attempt => attempt.homework.documentId === id
        );
        setUserAttempts(homeworkAttempts);
        
      } catch (err) {
        console.error("Error loading homework details:", err);
        setError("Failed to load homework. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadHomework();
  }, [id]);
  
  // Helper function to get current user ID
  const getCurrentUserId = (): number => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.id;
    }
    return 0;
  };
  
  // Helper to format dates
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No disponible';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      return format(date, "dd MMMM, yyyy - HH:mm");
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };
  
  // Determine homework status
  const getHomeworkStatus = () => {
    if (!homework) return "loading";
    
    // Check if user has already submitted an attempt
    const hasAttempt = userAttempts.length > 0;
    if (hasAttempt) return "submitted";
    
    try {
      const now = new Date();
      const deadline = homework.deadlineDate ? new Date(homework.deadlineDate) : now;
      
      // Validate date
      if (isNaN(deadline.getTime())) {
        return "in-progress"; // Default to in-progress if date is invalid
      }
      
      if (now > deadline) return "expired";
      return "in-progress";
    } catch (error) {
      console.error('Error determining homework status:', error);
      return "in-progress"; // Default to in-progress if there's an error
    }
  };
  
  // Check if homework can be submitted
  const canSubmit = () => {
    if (!homework) return false;
    
    try {
      // Check date constraints
      const now = new Date();
      const deadline = homework.deadlineDate ? new Date(homework.deadlineDate) : now;
      
      // Validate date
      if (isNaN(deadline.getTime())) {
        return false;
      }
      
      // Check if past deadline
      if (now > deadline) return false;
      
      // Check if at least one file is selected or notes provided
      return selectedFiles.length > 0;
      
    } catch (error) {
      console.error('Error checking submission status:', error);
      return false;
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setSelectedFiles(fileList);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!homework) return;
    
    try {
      setSubmitting(true);

      console.log(homework);
      
      // Create submission data
      const submissionData: NewHomeworkAttempt = {
        homework: homework.id,
        contestCycle: homework.contestCycle.id, 
        user: getCurrentUserId(),
        deliveredDate: new Date().toISOString(),
        userNotes: userNotes,
      };
      
      // Submit the attempt with files
      await submitHomeworkAttempt(submissionData, selectedFiles);
      toast.success("Tarea enviada correctamente");
      
      // Refresh data
      const attempts = await fetchUserHomeworkAttempts();
      const homeworkAttempts = attempts.filter(
        attempt => attempt.homework.id === Number(id)
      );
      setUserAttempts(homeworkAttempts);
      
      // Reset form
      setUserNotes("");
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Switch to submissions tab
      setActiveTab("submissions");
      
    } catch (err) {
      console.error("Error submitting homework:", err);
      toast.error("Error al enviar la tarea. Por favor intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ooi-second-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando tarea...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
  // Error state
  if (error || !homework) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="mt-4 text-gray-600">{error || "No se pudo cargar la tarea"}</p>
              <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/homeworks')}>
                Volver a tareas
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
  const homeworkStatus = getHomeworkStatus();
  
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
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/homeworks">Tareas</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{homework.name}</BreadcrumbPage>
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
                <Link href="/dashboard/homeworks">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Volver a tareas
                </Link>
              </Button>
              
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-ooi-dark-blue">{homework.name}</h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="bg-indigo-100 text-indigo-800">
                      Tarea
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Fecha límite: {formatDate(homework.deadlineDate)}</span>
                    </div>
                    
                    <Badge className={
                      homeworkStatus === 'submitted' ? 'bg-green-100 text-green-800' :
                      homeworkStatus === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }>
                      {homeworkStatus === 'submitted' && 'Entregado'}
                      {homeworkStatus === 'in-progress' && 'Pendiente'}
                      {homeworkStatus === 'expired' && 'Expirado'}
                    </Badge>
                  </div>
                </div>
                
                {homeworkStatus === 'submitted' && userAttempts.length > 0 && userAttempts[0].score !== null && (
                  <div className="p-2 rounded-md bg-green-50 border border-green-200 text-center mt-4 md:mt-0">
                    <div className="text-2xl font-bold text-green-600">
                      {userAttempts[0].score}/{homework.maxScore}
                    </div>
                    <div className="text-sm text-green-700">
                      {((Number(userAttempts[0].score || 0) / homework.maxScore) * 100).toFixed(1)}%
                    </div>
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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <CardHeader className="px-6 py-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">
                      <FileText className="h-4 w-4 mr-2" />
                      Descripción
                    </TabsTrigger>
                    <TabsTrigger value="submit">
                      <Upload className="h-4 w-4 mr-2" />
                      Entregar
                    </TabsTrigger>
                    <TabsTrigger value="submissions">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Entregas
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent className="px-6">
                  <TabsContent value="overview" className="mt-0 space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                      <p className="text-gray-700">{homework.description}</p>
                    </div>
                    
                    {homework.files && homework.files.length > 0 && (
                      <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">Archivos de la tarea</h2>
                        <div className="space-y-2">
                          {homework.files.map((file: StrapiFile) => (
                            <div key={file.url} className="flex items-center p-3 border rounded-md bg-gray-50">
                              <File className="h-5 w-5 text-blue-500 mr-3" />
                              <div className="flex-1">
                                <p className="font-medium">{file.url.split('/').pop() || 'Archivo adjunto'}</p>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <a href={`${process.env.NEXT_PUBLIC_STRAPI_URL}${file.url}`} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4 mr-1" />
                                  Descargar
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Fecha límite: {formatDate(homework.deadlineDate)}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="submit" className="mt-0 space-y-6">
                    {homeworkStatus === 'in-progress' ? (
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-lg font-semibold mb-2">Entrega de tarea</h2>
                          <p className="text-gray-600">
                            Completa el formulario a continuación para enviar tu tarea.
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="notes">Notas (opcional)</Label>
                            <Textarea 
                              id="notes" 
                              placeholder="Añade cualquier nota o comentario sobre tu entrega" 
                              value={userNotes}
                              onChange={(e) => setUserNotes(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="files">Archivos</Label>
                            <Input 
                              id="files" 
                              type="file" 
                              multiple 
                              ref={fileInputRef}
                              onChange={handleFileChange}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Selecciona los archivos que deseas entregar
                            </p>
                          </div>
                          
                          {selectedFiles.length > 0 && (
                            <div className="rounded-md border overflow-hidden">
                              <div className="bg-gray-50 p-2 border-b">
                                <h3 className="font-medium">Archivos seleccionados</h3>
                              </div>
                              <div className="p-2">
                                <ul className="space-y-1">
                                  {selectedFiles.map((file, index) => (
                                    <li key={index} className="text-sm flex items-center">
                                      <File className="h-4 w-4 text-blue-500 mr-2" />
                                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="pt-4 border-t flex justify-between items-center">
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Fecha límite: {formatDate(homework.deadlineDate)}
                          </div>
                          
                          <Button 
                            className="bg-ooi-second-blue hover:bg-ooi-blue-hover"
                            onClick={handleSubmit}
                            disabled={submitting || !canSubmit()}
                          >
                            {submitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-1" />
                                Entregar tarea
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : homeworkStatus === 'submitted' ? (
                      <div className="space-y-6">
                        <div className="rounded-md overflow-hidden border p-4 bg-green-50">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-green-800">Tarea entregada</h3>
                              <p className="text-sm text-green-600 mt-1">
                                Ya has entregado esta tarea. Puedes ver los detalles de tu entrega en la pestaña "Entregas".
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Esta tarea ha expirado</h3>
                        <p className="text-gray-500 max-w-md">
                          El plazo para enviar esta tarea terminó el {formatDate(homework.deadlineDate)}.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="submissions" className="mt-0 space-y-6">
                    {userAttempts.length > 0 ? (
                      <div className="space-y-6">
                        {userAttempts.map((attempt, index) => (
                          <div key={attempt.id} className="rounded-md border overflow-hidden">
                            <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">Entrega #{index + 1}</h3>
                                <p className="text-sm text-gray-500">
                                  Entregado el {formatDate(attempt.deliveredDate)}
                                </p>
                              </div>
                              {attempt.score !== null && (
                                <div className="text-lg font-bold text-green-600">
                                  {attempt.score}/{homework.maxScore}
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4">
                              {attempt.userNotes && (
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium mb-1">Notas</h4>
                                  <p className="text-gray-700 text-sm p-2 bg-gray-50 rounded-md">
                                    {attempt.userNotes}
                                  </p>
                                </div>
                              )}
                              
                              {attempt.deliveredFiles && attempt.deliveredFiles.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Archivos entregados</h4>
                                  <div className="space-y-2">
                                    {attempt.deliveredFiles.map((file) => (
                                      <div key={file.url} className="flex items-center p-2 border rounded-md bg-gray-50">
                                        <File className="h-4 w-4 text-blue-500 mr-2" />
                                        <div className="flex-1 text-sm">
                                          <p>{file.url.split('/').pop() || 'Archivo adjunto'}</p>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                          <a href={`${process.env.NEXT_PUBLIC_STRAPI_URL}${file.url}`} target="_blank" rel="noopener noreferrer">
                                            <Download className="h-3 w-3 mr-1" />
                                            Descargar
                                          </a>
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {attempt.notes && (
                                <div className="mt-4 pt-4 border-t">
                                  <h4 className="text-sm font-medium mb-1">Retroalimentación</h4>
                                  <p className="text-gray-700 text-sm p-2 bg-gray-50 rounded-md">
                                    {attempt.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No hay entregas disponibles</h3>
                        <p className="text-gray-500 max-w-md">
                          Aún no has realizado ninguna entrega para esta tarea.
                          Ve a la pestaña "Entregar" para enviar tu tarea.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4" 
                          onClick={() => setActiveTab('submit')}
                          disabled={homeworkStatus === 'expired'}
                        >
                          Ir a entregar
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 