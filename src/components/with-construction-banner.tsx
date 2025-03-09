"use client";

import { ReactNode } from "react";
import { ConstructionBanner } from "@/components/construction-banner";

interface WithConstructionBannerProps {
  children: ReactNode;
  isUnderConstruction?: boolean;
}

export function WithConstructionBanner({ 
  children, 
  isUnderConstruction = true 
}: WithConstructionBannerProps) {
  return (
    <div className="relative w-full h-full flex-1 flex flex-col">
      {children}
      {isUnderConstruction && <ConstructionBanner />}
    </div>
  );
} 