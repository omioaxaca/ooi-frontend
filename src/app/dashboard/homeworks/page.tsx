"use client";

import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Award,
  Upload,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchUserHomeworkAttempts,
  fetchUserHomeworks,
  fetchUserHomeworksByContestCycle,
} from "@/services/homeworkService";
import { fetchAllContestCycles } from "@/services/contestCycle";
import { format } from "date-fns";

import type { Homework, HomeworkAttempt } from "@/types/dashboard/homework";
import type { ContestCycle } from "@/types/dashboard/contestCycle";

// Map from API data to our UI format
interface HomeworkRowView {
  id: number;
  title: string;
  status: string;
  deadline: string | null;
  submitDate: string | null;
  score: number | string | null;
  maxScore: number;
  feedback: string | null;
  description: string;
  url: string;
}

const mapApiToUiHomework = (
  apiHomework: Homework,
  apiHomeworkAttempts: HomeworkAttempt[],
): HomeworkRowView => {
  // Determine status based on user attempts and deadline
  const isInTheFuture = apiHomework.deadlineDate
    ? new Date(apiHomework.deadlineDate) > new Date()
    : false;
  const isExpired = apiHomework.deadlineDate
    ? new Date(apiHomework.deadlineDate) < new Date()
    : false;
  const userAttempts = apiHomeworkAttempts.filter(
    (attempt) => attempt.homework.id === apiHomework.id,
  );
  const isCompleted = userAttempts.length > 0;
  const isInProgress = !isExpired && !isCompleted;

  let status = "upcoming";
  if (isCompleted) {
    status = "completed";
  } else if (isExpired) {
    status = "expired";
  } else if (isInProgress) {
    status = "in-progress";
  }

  const lastIndex = userAttempts.length - 1;
  const lastAttempt = lastIndex >= 0 ? userAttempts[lastIndex] : null;

  return {
    id: apiHomework.id,
    title: apiHomework.name,
    status,
    deadline: apiHomework.deadlineDate
      ? format(new Date(apiHomework.deadlineDate), "dd MMMM, yyyy - HH:mm")
      : null,
    submitDate: lastAttempt?.deliveredDate
      ? format(new Date(lastAttempt.deliveredDate), "dd MMMM, yyyy - HH:mm")
      : null,
    score: lastAttempt?.score || null,
    maxScore: apiHomework.maxScore,
    feedback: lastAttempt?.notes || null,
    description: apiHomework.description || "",
    url: `/dashboard/homeworks/${apiHomework.documentId}`,
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

export default function HomeworksPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [homeworks, setHomeworks] = useState<HomeworkRowView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Contest cycle filter
  const [contestCycles, setContestCycles] = useState<ContestCycle[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string>("");

  // Fetch contest cycles when component mounts
  useEffect(() => {
    const getContestCycles = async () => {
      try {
        const cycles = await fetchAllContestCycles();
        setContestCycles(cycles);
        if (cycles.length > 0) {
          setSelectedCycleId(cycles[0].documentId);
        }
      } catch (error) {
        console.error("Failed to fetch contest cycles:", error);
      }
    };

    getContestCycles();
  }, []);

  // Fetch homeworks when selected cycle changes
  useEffect(() => {
    if (!selectedCycleId) return;

    const loadHomeworks = async () => {
      try {
        setLoading(true);
        let apiHomeworks: Homework[];
        if (selectedCycleId !== "all") {
          apiHomeworks =
            await fetchUserHomeworksByContestCycle(selectedCycleId);
        } else {
          apiHomeworks = await fetchUserHomeworks();
        }
        const apiHomeworkAttempts = await fetchUserHomeworkAttempts();
        const mappedHomeworks = apiHomeworks.map((homework) => {
          return mapApiToUiHomework(homework, apiHomeworkAttempts);
        });
        setHomeworks(mappedHomeworks);
      } catch (err) {
        setError("Failed to load homeworks. Please try again later.");
        console.error("Error loading homeworks:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeworks();
  }, [selectedCycleId]);

  const getFilteredHomeworks = (tabValue: string) => {
    return tabValue === "all"
      ? homeworks
      : homeworks.filter((item: HomeworkRowView) => item.status === tabValue);
  };

  // Reusable component for rendering homework cards
  const HomeworksList = ({ homeworks }: { homeworks: HomeworkRowView[] }) => (
    <>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ooi-second-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tareas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      ) : homeworks.length > 0 ? (
        homeworks.map((homework: HomeworkRowView) => (
          <Card
            key={homework.id}
            className={`mb-4 overflow-hidden border-l-4 ${
              homework.status === "completed"
                ? "border-l-green-500"
                : homework.status === "in-progress"
                  ? "border-l-yellow-500"
                  : homework.status === "expired"
                    ? "border-l-red-500"
                    : "border-l-blue-500"
            }`}
          >
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-indigo-100 text-indigo-800">
                      Tarea
                    </Badge>

                    <Badge
                      className={
                        homework.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : homework.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : homework.status === "expired"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                      }
                    >
                      {homework.status === "completed" && "Completado"}
                      {homework.status === "in-progress" && "En progreso"}
                      {homework.status === "expired" && "Expirado"}
                      {homework.status === "upcoming" && "Próximamente"}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-medium mb-1">{homework.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {homework.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Fecha límite: {homework.deadline}</span>
                    </div>

                    {homework.submitDate && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Entregado: {homework.submitDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                  {homework.status === "completed" &&
                  homework.score !== null ? (
                    <>
                      <div className="text-2xl font-bold text-green-600">
                        {homework.score}/{homework.maxScore}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(
                          (Number(homework.score) / homework.maxScore) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </>
                  ) : (
                    <Badge
                      className={
                        homework.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : homework.status === "expired"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }
                    >
                      {homework.status === "in-progress"
                        ? "Pendiente"
                        : homework.status === "expired"
                          ? "Expirado"
                          : "Próxima"}
                    </Badge>
                  )}

                  {homework.status === "in-progress" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-ooi-second-blue hover:bg-ooi-blue-hover"
                        asChild
                      >
                        <a href={homework.url}>
                          <Upload className="h-4 w-4 mr-1" />
                          Entregar
                        </a>
                      </Button>
                    </div>
                  )}

                  {homework.status === "completed" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={homework.url}>
                          <FileText className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {homework.feedback && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md border text-sm">
                  <p className="font-medium mb-1">Retroalimentación:</p>
                  <p className="text-gray-700">{homework.feedback}</p>
                </div>
              )}
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-12 text-gray-500">
          No hay tareas disponibles en esta categoría
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
                <BreadcrumbPage>Tareas</BreadcrumbPage>
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
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl text-ooi-dark-blue">
                      Tareas
                    </CardTitle>
                    <CardDescription>
                      Tareas, proyectos y actividades prácticas del curso
                    </CardDescription>
                  </div>
                  <Select
                    value={selectedCycleId}
                    onValueChange={setSelectedCycleId}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Ciclo de competencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los ciclos</SelectItem>
                      {contestCycles.map((cycle) => (
                        <SelectItem
                          key={cycle.documentId}
                          value={cycle.documentId}
                        >
                          {cycle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="all"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="in-progress">Pendientes</TabsTrigger>
                    <TabsTrigger value="completed">Completadas</TabsTrigger>
                    <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                    <TabsTrigger value="expired">Expiradas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-0">
                    <HomeworksList homeworks={getFilteredHomeworks("all")} />
                  </TabsContent>

                  <TabsContent value="in-progress" className="mt-0">
                    <HomeworksList
                      homeworks={getFilteredHomeworks("in-progress")}
                    />
                  </TabsContent>

                  <TabsContent value="completed" className="mt-0">
                    <HomeworksList
                      homeworks={getFilteredHomeworks("completed")}
                    />
                  </TabsContent>

                  <TabsContent value="upcoming" className="mt-0">
                    <HomeworksList
                      homeworks={getFilteredHomeworks("upcoming")}
                    />
                  </TabsContent>

                  <TabsContent value="expired" className="mt-0">
                    <HomeworksList
                      homeworks={getFilteredHomeworks("expired")}
                    />
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
