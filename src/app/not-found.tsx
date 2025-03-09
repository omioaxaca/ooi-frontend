"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function NotFoundContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-ooi-dark-blue">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Página no encontrada</h2>
        <p className="text-gray-600 mt-2">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="mt-8">
          <Button asChild className="bg-ooi-second-blue hover:bg-ooi-blue-hover">
            <Link href={from}>
              Regresar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ooi-second-blue"></div>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  );
} 