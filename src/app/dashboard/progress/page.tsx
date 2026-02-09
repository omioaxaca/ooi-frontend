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
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  UserPlus,
  CheckCircle2,
  Medal,
  Star,
  Clock,
  ArrowRight,
  Sparkles,
  History,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { fetchCurrentContestCycle, isSignupOpen } from "@/services/contestCycle";
import { fetchUserParticipations, createParticipation } from "@/services/participation";
import type { ContestCycle } from "@/types/dashboard/contestCycle";
import type { ParticipationListItem, NationalMedal } from "@/types/dashboard/participation";

// Helper to format dates in Spanish
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "No definida";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

// Helper to get medal display info
const getMedalInfo = (medal: NationalMedal | null) => {
  switch (medal) {
    case "GOLD":
      return { label: "Oro", color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: "🥇" };
    case "SILVER":
      return { label: "Plata", color: "bg-gray-100 text-gray-800 border-gray-300", icon: "🥈" };
    case "BRONZE":
      return { label: "Bronce", color: "bg-orange-100 text-orange-800 border-orange-300", icon: "🥉" };
    case "HONORIFICMENTION":
      return { label: "Mención Honorífica", color: "bg-blue-100 text-blue-800 border-blue-300", icon: "🏅" };
    case "PARTICIPATION":
      return { label: "Participación", color: "bg-green-100 text-green-800 border-green-300", icon: "📜" };
    default:
      return null;
  }
};

export default function ProgressPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [currentCycle, setCurrentCycle] = useState<ContestCycle | null>(null);
  const [participations, setParticipations] = useState<ParticipationListItem[]>([]);
  const [isRegisteredInCurrentCycle, setIsRegisteredInCurrentCycle] = useState(false);
  const [currentParticipation, setCurrentParticipation] = useState<ParticipationListItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch current cycle and user participations in parallel
        const [cycle, userParticipations] = await Promise.all([
          fetchCurrentContestCycle(),
          fetchUserParticipations()
        ]);

        setCurrentCycle(cycle);
        setParticipations(userParticipations);

        // Check if user is registered in current cycle
        if (cycle && userParticipations.length > 0) {
          const currentParticipationFound = userParticipations.find(
            (p) => p.contestCycle.id === cycle.id
          );
          setIsRegisteredInCurrentCycle(!!currentParticipationFound);
          setCurrentParticipation(currentParticipationFound || null);
        }
      } catch (error) {
        console.error("Error loading progress data:", error);
        toast.error("Error al cargar los datos de progreso");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleJoinCurrentCycle = async () => {
    if (!currentCycle || !user) return;

    setIsJoining(true);
    try {
      await createParticipation({
        user: user.id,
        contestCycle: currentCycle.id,
        signupDate: new Date().toISOString(),
      });

      // Refresh participations
      const updatedParticipations = await fetchUserParticipations();
      setParticipations(updatedParticipations);

      const newCurrentParticipation = updatedParticipations.find(
        (p) => p.contestCycle.id === currentCycle.id
      );
      setCurrentParticipation(newCurrentParticipation || null);
      setIsRegisteredInCurrentCycle(true);

      toast.success("¡Te has inscrito exitosamente!", {
        description: `Ahora eres parte de ${currentCycle.name}`
      });
    } catch (error) {
      console.error("Error joining cycle:", error);
      toast.error("Error al inscribirse", {
        description: "Por favor intenta nuevamente más tarde"
      });
    } finally {
      setIsJoining(false);
    }
  };

  // Separate past participations from current
  const pastParticipations = participations.filter(
    (p) => !currentCycle || p.contestCycle.id !== currentCycle.id
  );

  return (
    <>
      <SidebarTrigger />
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
                  <BreadcrumbPage>Mi Trayectoria</BreadcrumbPage>
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
            className="flex justify-between items-center mb-2"
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-ooi-second-blue" />
              <h1 className="text-2xl font-semibold text-ooi-dark-blue">Mi Trayectoria</h1>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <>
              {/* Join Current Cycle CTA - Only show if not registered */}
              {currentCycle && !isRegisteredInCurrentCycle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="border-2 border-ooi-second-blue bg-gradient-to-br from-ooi-second-blue/5 via-ooi-purple/5 to-transparent overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0">
                          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-ooi-second-blue to-ooi-purple flex items-center justify-center">
                            <Sparkles className="h-10 w-10 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                          <h2 className="text-xl font-bold text-ooi-dark-blue mb-2">
                            ¡Únete a {currentCycle.name}!
                          </h2>
                          <p className="text-gray-600 mb-3">
                            {currentCycle.description || "Una nueva edición de la Olimpiada Oaxaqueña de Informática está por comenzar. ¡No te quedes fuera!"}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4 justify-center md:justify-start">
                            {currentCycle.signupDeadline && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Inscripciones hasta: {formatDate(currentCycle.signupDeadline)}</span>
                              </div>
                            )}
                            {currentCycle.startClassesDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Inicio de clases: {formatDate(currentCycle.startClassesDate)}</span>
                              </div>
                            )}
                          </div>

                          {isSignupOpen(currentCycle) ? (
                            <Button
                              onClick={handleJoinCurrentCycle}
                              disabled={isJoining}
                              className="bg-ooi-second-blue hover:bg-ooi-dark-blue text-white"
                              size="lg"
                            >
                              {isJoining ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Inscribiendo...
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-5 w-5 mr-2" />
                                  Inscribirme ahora
                                  <ArrowRight className="h-5 w-5 ml-2" />
                                </>
                              )}
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-300">
                              Las inscripciones han cerrado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Current Cycle Participation */}
              {currentCycle && isRegisteredInCurrentCycle && currentParticipation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="border-green-200 bg-gradient-to-br from-green-50 to-transparent">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-lg text-ooi-dark-blue">
                            Participación Actual
                          </CardTitle>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          Inscrito
                        </Badge>
                      </div>
                      <CardDescription>
                        {currentCycle.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">Fecha de inscripción</span>
                          </div>
                          <p className="font-medium">{formatDate(currentParticipation.signupDate)}</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 border">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">Inicio de clases</span>
                          </div>
                          <p className="font-medium">{formatDate(currentCycle.startClassesDate)}</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 border">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">Examen diagnóstico</span>
                          </div>
                          <p className="font-medium">
                            {currentParticipation.diagnosticExamDone ? (
                              <span className="text-green-600">Completado ✓</span>
                            ) : (
                              <span className="text-yellow-600">Pendiente</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Achievements Section - Placeholder for future */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <Award className="h-5 w-5" />
                          <span className="font-medium">Logros y reconocimientos</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Tus logros, medallas y diplomas aparecerán aquí conforme avances en la olimpiada.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Past Participations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5 text-ooi-second-blue" />
                      <CardTitle className="text-lg text-ooi-dark-blue">
                        Historial de Participaciones
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Tu trayectoria en ediciones anteriores de la OOI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pastParticipations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>Aún no tienes participaciones en ediciones anteriores.</p>
                        <p className="text-sm mt-1">¡Esta será tu primera aventura en la OOI!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pastParticipations.map((participation, index) => (
                          <motion.div
                            key={participation.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-ooi-second-blue/10 flex items-center justify-center flex-shrink-0">
                                  <Trophy className="h-6 w-6 text-ooi-second-blue" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-ooi-dark-blue">
                                    {participation.contestCycle.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Inscrito: {formatDate(participation.signupDate)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 ml-16 md:ml-0">
                                {/* State Finalist Badge */}
                                {participation.isStateFinalist && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                                    <Star className="h-3 w-3 mr-1" />
                                    Finalista Estatal
                                  </Badge>
                                )}

                                {/* State Winner Badge */}
                                {participation.isStateWinner && participation.stateWinnerPlace && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                    <Medal className="h-3 w-3 mr-1" />
                                    {participation.stateWinnerPlace}° Lugar Estatal
                                  </Badge>
                                )}

                                {/* National Place Badge */}
                                {participation.nationalWinnerPlace && (
                                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">
                                    <Trophy className="h-3 w-3 mr-1" />
                                    {participation.nationalWinnerPlace}° Lugar Nacional
                                  </Badge>
                                )}

                                {/* Medal Badge */}
                                {participation.nationalMedalWon && getMedalInfo(participation.nationalMedalWon) && (
                                  <Badge
                                    variant="outline"
                                    className={getMedalInfo(participation.nationalMedalWon)?.color}
                                  >
                                    <span className="mr-1">{getMedalInfo(participation.nationalMedalWon)?.icon}</span>
                                    {getMedalInfo(participation.nationalMedalWon)?.label}
                                  </Badge>
                                )}

                                {/* No achievements yet */}
                                {!participation.isStateFinalist &&
                                 !participation.isStateWinner &&
                                 !participation.nationalWinnerPlace &&
                                 !participation.nationalMedalWon && (
                                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                                    Participante
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Future Stats Section - Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-gray-50 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-400 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Próximamente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-dashed border-gray-300 text-center">
                        <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-xl">🧩</span>
                        </div>
                        <p className="font-medium text-gray-400">Problemas Resueltos</p>
                        <p className="text-sm text-gray-300">Próximamente</p>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-dashed border-gray-300 text-center">
                        <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-xl">📜</span>
                        </div>
                        <p className="font-medium text-gray-400">Diplomas</p>
                        <p className="text-sm text-gray-300">Próximamente</p>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-dashed border-gray-300 text-center">
                        <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-xl">🏆</span>
                        </div>
                        <p className="font-medium text-gray-400">Logros</p>
                        <p className="text-sm text-gray-300">Próximamente</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </div>
      </SidebarInset>
    </>
  );
}