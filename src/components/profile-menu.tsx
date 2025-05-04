"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { BarChart2, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface ProfileMenuProps {
  expanded?: boolean
}

export function ProfileMenu({ expanded = false }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  
  // If no user is loaded yet, show a placeholder
  if (!user) {
    return (
      <div className="p-2 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (expanded) {
    // Expanded view for sidebar top
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative h-6 w-6 flex-shrink-0">
                <div className="absolute inset-0 rounded-full border border-gray-200 overflow-hidden">
                  <Image
                    src={user.avatar ? `https://api.omioaxaca.org${user.avatar.url}` : '/images/default-avatar.png'}
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.firstName}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
              <ChevronDown 
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                aria-hidden="true"
              />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">
                Hola, {user.firstName ? user.firstName.split(' ')[0] : 'Usuario'}!
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/progress" className="cursor-pointer flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Tu Progreso</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="cursor-pointer flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Mis Datos</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 hover:text-red-600">
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  
  // Original compact view for header (now unused but kept for reference)
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-200">
            <Image
              src={user.avatar ? `https://api.omioaxaca.org${user.avatar.url}` : '/images/default-avatar.png'}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.firstName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/progress" className="cursor-pointer flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Your Progress</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="cursor-pointer flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>My Information</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 hover:text-red-600">
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 