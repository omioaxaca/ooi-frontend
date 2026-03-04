"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCog, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  getIncompleteProfileFields,
  shouldShowProfileReminder,
  dismissProfileReminder,
} from "@/services/userService";

const fieldLabels: Record<string, string> = {
  omegaupUserId: "usuario de OmegaUp",
  discordUserId: "usuario de Discord",
};

export function ProfileCompletionReminder() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    if (shouldShowProfileReminder(user)) {
      const { missingFields: fields } = getIncompleteProfileFields(user);
      setMissingFields(fields);
      setVisible(true);
    }
  }, [user]);

  const handleDismiss = () => {
    dismissProfileReminder();
    setVisible(false);
  };

  if (!visible || missingFields.length === 0) return null;

  const missingLabels = missingFields.map((f) => fieldLabels[f] || f);
  const missingText =
    missingLabels.length === 1
      ? missingLabels[0]
      : `${missingLabels.slice(0, -1).join(", ")} y ${missingLabels[missingLabels.length - 1]}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="relative flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <UserCog className="h-4 w-4 text-amber-600" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-amber-900">
              Tu perfil está incompleto — falta tu{" "}
              <span className="font-medium">{missingText}</span>.
            </p>
          </div>

          <Link href="/dashboard/profile">
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-amber-300 text-amber-800 hover:bg-amber-100 text-xs h-7"
            >
              Completar perfil
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>

          <button
            onClick={handleDismiss}
            className="shrink-0 text-amber-400 hover:text-amber-600 transition-colors"
            aria-label="Descartar recordatorio"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
