"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function HomeworksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarProvider>{children}</SidebarProvider>;
} 