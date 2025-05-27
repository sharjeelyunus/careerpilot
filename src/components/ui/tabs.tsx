/**
 * @file tabs.tsx
 * @description UI component for creating tabbed interfaces, built on Radix UI Tabs primitives.
 * It provides styled versions of Tabs, TabsList, TabsTrigger, and TabsContent.
 *
 * @module components/ui/Tabs
 *
 * @see {@link https://www.radix-ui.com/primitives/docs/components/tabs Radix UI Tabs}
 *
 * @exports Tabs - The root component for a tabbed interface.
 * @exports TabsList - The container for tab triggers.
 * @exports TabsTrigger - An individual tab button that activates its associated content.
 * @exports TabsContent - The container for the content associated with a tab trigger.
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @example
 * <Tabs defaultValue="account" className="w-[400px]">
 *   <TabsList className="grid w-full grid-cols-2">
 *     <TabsTrigger value="account">Account</TabsTrigger>
 *     <TabsTrigger value="password">Password</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">
 *     Make changes to your account here. Lorem ipsum dolor sit amet...
 *   </TabsContent>
 *   <TabsContent value="password">
 *     Change your password here. Lorem ipsum dolor sit amet...
 *   </TabsContent>
 * </Tabs>
 *
 * @dependencies
 * - `react` for `forwardRef`.
 * - `@radix-ui/react-tabs` for the base tabs primitives.
 * - `@/lib/utils` for `cn` utility.
 *
 * @note Components are styled with Tailwind CSS and Radix UI data attributes for states (e.g., `data-[state=active]`).
 */
"use client"

import * as React from "react"
import type { JSX } from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref): JSX.Element => (
  <TabsPrimitive.Root
    ref={ref}
    data-slot="tabs"
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref): JSX.Element => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    className={cn(
      "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref): JSX.Element => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tabs-trigger"
    className={cn(
      "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref): JSX.Element => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    className={cn("flex-1 outline-none", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent }
