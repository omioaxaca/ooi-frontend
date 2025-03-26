"use client";

import { useState, useEffect } from "react";
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
import { fetchUserEvaluationAttempts, fetchUserEvaluations } from "@/services/evaluationService";
import { format } from "date-fns";

import type { Evaluation, EvaluationAttempt, EvaluationRowView } from "@/types/dashboard/evaluations";

// Map from API data to our UI format
const mapApiToUiEvaluation = (apiEvaluation: Evaluation, apiEvaluationAttempts: EvaluationAttempt[]): EvaluationRowView => {
  // Determine status based on user attempts and deadline

  const isInTheFuture = new Date(apiEvaluation.availableDate) > new Date();
  const isExpired = new Date(apiEvaluation.deadlineDate) < new Date();
  const isCompleted = apiEvaluationAttempts.length > 0;
  const isInProgress = !isInTheFuture && !isExpired && !isCompleted;
  
  let status = "upcoming";
  if (isCompleted) {
    status = "completed";
  } else if (isExpired) {
    status = "expired";
  } else if (isInProgress) {
    status = "in-progress";
  }

  const lastIndex = apiEvaluationAttempts.length - 1;
  const lastAttempt = lastIndex >= 0 ? apiEvaluationAttempts[lastIndex] : null;
  const userAttempt = {
    score: lastAttempt ? lastAttempt.score : null ,
    feedback: lastAttempt ? lastAttempt.notes : null,
    submitDate: lastAttempt ? lastAttempt.deliveredDate : null,
  };

  return {
    id: apiEvaluation.id,
    title: apiEvaluation.name,
    type: apiEvaluation.type || "exam",
    status,
    deadline: apiEvaluation.deadlineDate ? format(new Date(apiEvaluation.deadlineDate), "dd MMMM, yyyy - HH:mm") : null,
    submitDate: userAttempt.submitDate ? 
      format(new Date(userAttempt.submitDate), "dd MMMM, yyyy - HH:mm") : null,
    score: userAttempt.score,
    maxScore: apiEvaluation.maxScore || 100,
    feedback: userAttempt.feedback || null,
    description: apiEvaluation.description || "",
    url: `/dashboard/evaluations/${apiEvaluation.documentId}`
  };
};

// Helper function to get current user ID - same as in service
const getCurrentUserId = (): number => {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id;
  }
  return 0;
};

export default function EvaluationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [evaluations, setEvaluations] = useState<EvaluationRowView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        setLoading(true);
        const apiEvaluations = await fetchUserEvaluations();
        const apiEvaluationsAttempts = await fetchUserEvaluationAttempts();
        const mappedEvaluations = apiEvaluations.map(evaluation => {
          const attempts = apiEvaluationsAttempts.filter(attempt => attempt.evaluation.id === evaluation.id);
          return mapApiToUiEvaluation(evaluation, attempts);
        });
        setEvaluations(mappedEvaluations);
      } catch (err) {
        setError("Failed to load evaluations. Please try again later.");
        console.error("Error loading evaluations:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvaluations();
  }, []);

  const getFilteredEvaluations = (tabValue: string) => {
    return tabValue === "all"
      ? evaluations
      : evaluations.filter((item: EvaluationRowView) => 
          item.type === tabValue || (tabValue === "upcoming" && item.status === "upcoming"));
  };

  // Reusable component for rendering evaluation cards
  const EvaluationsList = ({ evaluations }: { evaluations: EvaluationRowView[] }) => (
    <>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ooi-second-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando evaluaciones...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      ) : evaluations.length > 0 ? (
        evaluations.map((evaluation: EvaluationRowView) => (
          <Card
            key={evaluation.id}
            className={`mb-4 overflow-hidden border-l-4 ${
              evaluation.status === 'completed' 
                ? 'border-l-green-500' 
                : evaluation.status === 'in-progress'
                ? 'border-l-yellow-500'
                : evaluation.status === 'expired'
                ? 'border-l-red-500'
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
                      {evaluation.type === 'practice' && 'Practica'}
                    </Badge>
                    
                    <Badge className={
                      evaluation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      evaluation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                      evaluation.status === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {evaluation.status === 'completed' && 'Completado'}
                      {evaluation.status === 'in-progress' && 'En progreso'}
                      {evaluation.status === 'expired' && 'Expirado'}
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
                        {((Number.parseInt(evaluation.score as string) || 0) / (evaluation.maxScore || 1) * 100).toFixed(1)}%
                      </div>
                    </>
                  ) : (
                    <Badge className={
                      evaluation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      evaluation.status === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {evaluation.status === 'in-progress' ? 'Pendiente' : 
                       evaluation.status === 'expired' ? 'Expirado' : 'Próxima'}
                    </Badge>
                  )}
                  
                  {(evaluation.status === 'in-progress' || evaluation.status === 'completed') && (
                    <Button size="sm" className="mt-2" asChild>
                      <a href={evaluation.url}>
                        {evaluation.status === 'completed' ? 'Ver Resultados' : 'Empezar'}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  )}

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
    <>
      <SidebarTrigger />
      <AppSidebar />
      <SidebarInset>
        <div className="container mx-auto p-6">
          <Breadcrumb className="mb-6">
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
            className="space-y-6"
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
                    <TabsTrigger value="practice">Prácticas</TabsTrigger>
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
                  
                  <TabsContent value="practice" className="mt-0">
                    <EvaluationsList evaluations={getFilteredEvaluations("practice")} />
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
    </>
  );
} 