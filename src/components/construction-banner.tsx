"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConstructionBannerProps {
  className?: string;
}

export function ConstructionBanner({ className }: ConstructionBannerProps) {
  return (
    <motion.div
      className="absolute inset-0 backdrop-blur-sm bg-white/70 z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={`bg-amber-50 border-2 border-amber-300 rounded-lg p-6 shadow-lg max-w-md mx-auto text-center ${className}`}
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ 
          duration: 0.4,
          delay: 0.2,
          type: "spring",
          stiffness: 100 
        }}
      >
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-amber-800 mb-2">
          Sección en Construcción
        </h3>
        <p className="text-amber-700">
          Estamos trabajando para terminar esta sección. Pronto estará disponible.
        </p>
      </motion.div>
    </motion.div>
  );
} 