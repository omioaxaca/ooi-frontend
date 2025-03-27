"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
import { ChevronLeft, FileText, Calendar, CheckCircle, AlertCircle, Clock, Upload, Award, Download, ExternalLink, Video } from "lucide-react";
import { 
  fetchEvaluationById, 
  fetchUserEvaluationAttempts,
  submitEvaluationAttempt 
} from "@/services/evaluationService";
import { format } from "date-fns";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Evaluation, EvaluationAttempt, NewEvaluationAttempt } from "@/types/dashboard/evaluations";
import { EvaluationQuestion } from "@/components/evaluation/EvaluationQuestion";

export default function EvaluationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [attempt, setAttempt] = useState<EvaluationAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number | boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const loadEvaluation = async () => {
      try {
        setLoading(true);
        
        // Fetch evaluation details
        const evaluationData = await fetchEvaluationById(id);
        setEvaluation(evaluationData);
        
        // Fetch user's attempts
        const attempts = await fetchUserEvaluationAttempts();
        const currentAttempt = attempts.find(a => a.evaluation.documentId === id) || null;
        setAttempt(currentAttempt);
        
        // If there's a previous attempt, populate answers
        if (currentAttempt) {
          const savedAnswers: Record<string, string | string[] | number | boolean> = {};
          currentAttempt.answeredQuestions.forEach((answer) => {
            savedAnswers[answer.questionIdentifier] = answer.answerIdentifier;
          });
          setAnswers(savedAnswers);
        }
        
      } catch (err) {
        console.error("Error loading evaluation details:", err);
        setError("Failed to load evaluation. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadEvaluation();
  }, [id]);
  
  const handleAnswerChange = (questionIdentifier: string, answerIdentifier: string | string[] | number | boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionIdentifier]: answerIdentifier
    }));
  };
  
  const handleSubmit = async () => {
    if (!evaluation) return;

    try {
      setSubmitting(true);
      
      // Format answers for submission
      const formattedAnswers = Object.entries(answers).map(([questionIdentifier, value]) => ({
        questionIdentifier: evaluation.questions.find(q => q.identifier === questionIdentifier)?.identifier || '',
        answerIdentifier: value.toString()
      }));  
      
      // Create submission data
      const submissionData: NewEvaluationAttempt = {
        deliveredDate: new Date().toISOString(),
        user: getCurrentUserId(),
        answeredQuestions: formattedAnswers,
        contestCycle: 1, // hardcoded for now, todo: get from context
        evaluation: evaluation.id
      };
      
      // Submit attempt
      await submitEvaluationAttempt(submissionData);
      toast.success("Evaluación enviada correctamente");
      
      // Refresh data
      const attempts = await fetchUserEvaluationAttempts();
      const currentAttempt = attempts.find(a => a.evaluation.documentId === id) || null;
      setAttempt(currentAttempt);
      setActiveTab("results");
      
    } catch (err) {
      console.error("Error submitting evaluation:", err);
      toast.error("Error al enviar la evaluación. Por favor intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };
  
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
  
  // Helper to check if evaluation can be submitted
  const canSubmit = () => {
    if (!evaluation) return false;
    
    try {
      // Check date constraints
      const now = new Date();
      const startDate = evaluation.availableDate ? new Date(evaluation.availableDate) : now;
      const deadline = evaluation.deadlineDate ? new Date(evaluation.deadlineDate) : now;
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(deadline.getTime())) {
        return false;
      }
      
      // Check if attempt already exists and is graded
      if (attempt && attempt.reviewStatus === 'completed') return false;
      
      // Check if within the valid date range
      const isWithinDateRange = startDate <= now && now <= deadline;
      if (!isWithinDateRange) return false;

      // Check if all required questions have been answered
      const allQuestionsAnswered = evaluation.questions.every(question => {
        // All questions are required for now (as per renderQuestions where required is hardcoded to true)
        const answer = answers[question.identifier];
        return answer !== undefined && answer !== null && answer !== '';
      });

      return allQuestionsAnswered;
      
    } catch (error) {
      console.error('Error checking submission status:', error);
      return false;
    }
  };

  const renderQuestions = (questions: Evaluation['questions'], evaluationStatus: string) => {
    return questions.map((question, index) => (
      <EvaluationQuestion
        key={question.identifier}
        identifier={question.identifier}
        label={question.label}
        description={question.description}
        photoUrl={question.photo?.url}
        answerOptions={question.answerOptions}
        answerSelectedIdentifier={answers[question.identifier] as string | undefined}
        required={true} // hardcoded for now, todo: get from evaluation
        isReadOnly={evaluationStatus !== 'in-progress'}
        onAnswerChange={handleAnswerChange}
        index={index}
        type="radio_group"
        // isCorrect={attempt?.answeredQuestions.find(a => a.questionIdentifier === question.identifier)?.isRightAnswer}
      />
    ));
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
              <p className="mt-4 text-gray-600">Cargando evaluación...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
  // Error state
  if (error || !evaluation) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="mt-4 text-gray-600">{error || "No se pudo cargar la evaluación"}</p>
              <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/evaluations')}>
                Volver a evaluaciones
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
  // Determine evaluation status
  const getEvaluationStatus = () => {
    if (!evaluation) return "loading";
    
    if (attempt?.reviewStatus === 'evaluated') return "completed";
    if (attempt) return "submitted";
    
    try {
      const now = new Date();
      const startDate = evaluation.availableDate ? new Date(evaluation.availableDate) : now;
      const deadline = evaluation.deadlineDate ? new Date(evaluation.deadlineDate) : now;
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(deadline.getTime())) {
        return "in-progress"; // Default to in-progress if dates are invalid
      }
      
      if (now < startDate) return "upcoming";
      if (now > deadline) return "expired";
      return "in-progress";
    } catch (error) {
      console.error('Error determining evaluation status:', error);
      return "in-progress"; // Default to in-progress if there's an error
    }
  };
  
  const evaluationStatus = getEvaluationStatus();
  
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
                  <BreadcrumbLink href="/dashboard/evaluations">Evaluaciones</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{evaluation.name}</BreadcrumbPage>
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
                <Link href="/dashboard/evaluations">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Volver a evaluaciones
                </Link>
              </Button>
              
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-ooi-dark-blue">{evaluation.name}</h1>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={
                      evaluation.type === 'homework' ? 'bg-green-100 text-green-800' :
                      evaluation.type === 'exam' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {evaluation.type === 'homework' ? 'Tarea' :
                       evaluation.type === 'exam' ? 'Examen' : 'Práctica'}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Fecha límite: {formatDate(evaluation.deadlineDate)}</span>
                    </div>
                    
                    <Badge className={
                      evaluationStatus === 'completed' ? 'bg-green-100 text-green-800' : 
                      evaluationStatus === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      evaluationStatus === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                      evaluationStatus === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {evaluationStatus === 'completed' && 'Completado'}
                      {evaluationStatus === 'submitted' && 'Enviado'}
                      {evaluationStatus === 'in-progress' && 'En progreso'}
                      {evaluationStatus === 'expired' && 'Expirado'}
                      {evaluationStatus === 'upcoming' && 'Próximamente'}
                    </Badge>
                  </div>
                </div>
                
                {evaluationStatus === 'completed' && attempt?.score !== undefined && (
                  <div className="p-2 rounded-md bg-green-50 border border-green-200 text-center mt-4 md:mt-0">
                    <div className="text-2xl font-bold text-green-600">
                      {attempt.score}/{evaluation.maxScore}
                    </div>
                    <div className="text-sm text-green-700">
                      {((Number(attempt.score) / evaluation.maxScore) * 100).toFixed(1)}%
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
                    <TabsTrigger value="questions">
                      <FileText className="h-4 w-4 mr-2" />
                      Preguntas
                    </TabsTrigger>
                    <TabsTrigger value="results">
                      <Award className="h-4 w-4 mr-2" />
                      Resultados
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent className="px-6">
                  <TabsContent value="overview" className="mt-0 space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                      <p className="text-gray-700">{evaluation.description}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="questions" className="mt-0 space-y-6">
                    {evaluationStatus === 'in-progress' ? (
                      <>
                        <div className="mb-4">
                          <h2 className="text-lg font-semibold mb-2">Preguntas de la evaluación</h2>
                          <p className="text-gray-600">
                            Responde a todas las preguntas marcadas con * (obligatorias) antes de enviar.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          {renderQuestions(evaluation.questions || [], evaluationStatus)}
                        </div>
                        
                        <div className="pt-4 border-t flex justify-between items-center">
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Fecha límite: {formatDate(evaluation.deadlineDate)}
                          </div>
                          
                          <Button 
                              className="bg-ooi-second-blue hover:bg-ooi-blue-hover"
                              onClick={() => {
                                handleSubmit();
                              }}
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
                                  Enviar evaluación
                                </>
                              )}
                            </Button>
                        </div>
                      </>
                    ) : evaluationStatus === 'submitted' || evaluationStatus === 'completed' ? (
                      <div className="space-y-6">
                        <div className="rounded-md overflow-hidden border p-4 bg-blue-50">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-blue-800">Evaluación enviada</h3>
                              <p className="text-sm text-blue-600 mt-1">
                                {evaluationStatus === 'completed' ? 
                                  'Tu evaluación ha sido calificada. Puedes revisar tus respuestas y resultados a continuación.' : 
                                  'Tu evaluación ha sido enviada y está pendiente de calificación.'}
                              </p>
                              {attempt && (
                                <p className="text-sm text-blue-600 mt-1">
                                  Fecha de envío: {formatDate(attempt.deliveredDate)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {renderQuestions(evaluation.questions || [], evaluationStatus)}
                        </div>
                      </div>
                    ) : evaluationStatus === 'upcoming' ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Clock className="h-12 w-12 text-blue-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Esta evaluación aún no está disponible</h3>
                        <p className="text-gray-500 max-w-md">
                          Podrás acceder a las preguntas a partir del {formatDate(evaluation.availableDate)}.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Esta evaluación ha expirado</h3>
                        <p className="text-gray-500 max-w-md">
                          El plazo para enviar esta evaluación terminó el {formatDate(evaluation.deadlineDate)}.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="results" className="mt-0 space-y-6">
                    {evaluationStatus === 'completed' ? (
                      <>
                        <div>
                          <h2 className="text-lg font-semibold mb-2">Calificación</h2>
                          <div className="rounded-md overflow-hidden border">
                            <div className="bg-gray-50 p-3 border-b">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Puntaje total</span>
                                <div className="text-xl font-bold text-ooi-dark-blue">
                                  {attempt?.score || 0}/{evaluation.maxScore}
                                  <span className="text-sm text-gray-500 ml-2">
                                    ({((Number(attempt?.score) || 0) / evaluation.maxScore * 100).toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <Progress 
                                  value={((Number(attempt?.score) || 0) / evaluation.maxScore) * 100} 
                                  className="h-2" 
                                />
                              </div>
                            </div>
                            
                            {attempt?.notes && (
                              <div className="p-4">
                                <h3 className="font-medium mb-3">Retroalimentación</h3>
                                <p className="text-gray-700 p-3 bg-gray-50 rounded-md border">
                                  {attempt.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h2 className="text-lg font-semibold mb-2">Detalles de tus respuestas</h2>
                          <p className="text-gray-600 mb-4">
                            Puedes ver cada una de tus respuestas y la retroalimentación en la pestaña "Preguntas".
                          </p>
                          <Button variant="outline" onClick={() => setActiveTab('questions')}>
                            Ver tus respuestas
                          </Button>
                        </div>
                      </>
                    ) : evaluationStatus === 'submitted' ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Clock className="h-12 w-12 text-blue-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Evaluación pendiente de calificación</h3>
                        <p className="text-gray-500 max-w-md">
                          Tu evaluación ha sido enviada y está pendiente de calificación.
                          Los resultados estarán disponibles cuando el instructor complete la revisión.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No hay resultados disponibles</h3>
                        <p className="text-gray-500 max-w-md">
                          Los resultados estarán disponibles después de que completes y envíes 
                          la evaluación, y sea revisada por el instructor.
                        </p>
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