"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

// Create a context to ensure TabsContent is used within Tabs
const TabsContext = React.createContext<{ value: string | undefined }>({
  value: undefined,
})

function Tabs({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>) {
  return (
    <TabsContext.Provider value={{ value }}>
      <TabsPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  )
}

function TabsList({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-ooi-dark-blue data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  children,
  forceMount,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  // Use context to verify TabsContent is within Tabs
  const { value } = React.useContext(TabsContext)
  
  // Skip context check when testing or in certain environments
  if (process.env.NODE_ENV !== 'production' && value === undefined && !forceMount) {
    console.warn('TabsContent must be used within Tabs component');
  }

  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-2 focus-visible:outline-none",
        className
      )}
      forceMount={forceMount}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
