"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar, SidebarFooter } from "@/components/ui/sidebar"
import { 
  Calendar, 
  Bell, 
  Home, 
  FileText, 
  Video, 
  BarChart2, 
  Book, 
  Code, 
  GraduationCap, 
  ChevronRight,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Logo } from "@/components/ui/logo"
import { ProfileMenu } from "@/components/profile-menu"
import { useAuth } from "@/contexts/auth-context"

export function AppSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  
  // Navigation groups
  const navItems = [
    {
      title: "Class 2025",
      items: [
        {
          title: "Welcome",
          href: "/dashboard",
          icon: Home,
        },
        {
          title: "Notifications",
          href: "/dashboard/notifications",
          icon: Bell,
        },
        {
          title: "Calendar",
          href: "/dashboard/calendar",
          icon: Calendar,
        },
        {
          title: "Your Progress",
          href: "/dashboard/progress",
          icon: BarChart2,
        },
        {
          title: "Class Recordings",
          href: "/dashboard/recordings",
          icon: Video,
        },
        {
          title: "Evaluations",
          href: "/dashboard/evaluations",
          icon: FileText,
        },
      ],
    },
    {
      title: "Syllabus",
      items: [
        {
          title: "Beginner",
          href: "/dashboard/syllabus/beginner",
          icon: Book,
        },
        {
          title: "Advanced",
          href: "/dashboard/syllabus/advanced",
          icon: GraduationCap,
        },
      ],
    },
    {
      title: "Exercises",
      items: [
        {
          title: "All Problems",
          href: "/dashboard/exercises",
          icon: Code,
        },
      ],
    },
  ]

  return (
    <Sidebar className="border-r">
      <div className="flex h-16 items-center justify-center border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Logo className="h-12 w-auto" />
        </Link>
      </div>
      
      <div className="p-4 border-b">
        <ProfileMenu expanded={true} />
      </div>
      
      <ScrollArea className="flex-1 py-2">
        {navItems.map((group, i) => (
          <div key={i} className="px-4 py-2">
            <h2 className="mb-2 text-xs font-semibold text-gray-500">
              {group.title}
            </h2>
            <div className="space-y-1">
              {group.items.map((item, j) => (
                <Link
                  key={j}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100",
                    pathname === item.href
                      ? "bg-gray-100 text-ooi-second-blue"
                      : "text-gray-700"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                  {pathname === item.href && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
      
      <SidebarFooter>
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 text-gray-700 hover:text-red-600 hover:border-red-200"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
