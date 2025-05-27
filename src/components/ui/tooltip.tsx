/**
 * @file tooltip.tsx
 * @description UI component for displaying a tooltip, built on Radix UI Tooltip primitives.
 * It provides styled versions of TooltipProvider, Tooltip, TooltipTrigger, and TooltipContent.
 *
 * @module components/ui/Tooltip
 *
 * @see {@link https://www.radix-ui.com/primitives/docs/components/tooltip Radix UI Tooltip}
 *
 * @exports TooltipProvider - Wraps the application or a part of it to provide context for tooltips.
 * @exports Tooltip - The root component for a tooltip.
 * @exports TooltipTrigger - The element that triggers the tooltip on hover or focus.
 * @exports TooltipContent - The content of the tooltip, styled with application-specific theming.
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @example
 * <TooltipProvider>
 *   <Tooltip delayDuration={300}>
 *     <TooltipTrigger asChild>
 *       <Button variant="outline">Hover me</Button>
 *     </TooltipTrigger>
 *     <TooltipContent>
 *       <p>This is a tooltip with a 300ms delay!</p>
 *     </TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 *
 * @dependencies
 * - `react` for `forwardRef`.
 * - `@radix-ui/react-tooltip` for the base tooltip primitives.
 * - `@/lib/utils` for `cn` utility.
 *
 * @note Styled with Tailwind CSS, including animations. `TooltipProvider` is necessary at a higher level in the component tree.
 */
"use client"

import * as React from "react"
import type { JSX } from "react"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = (
  props: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>
) => <TooltipPrimitive.Provider {...props} />

const Tooltip = (
  props: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>
) => <TooltipPrimitive.Root {...props} />

const TooltipTrigger = (
  props: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
) => <TooltipPrimitive.Trigger {...props} />

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref): JSX.Element => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border border-primary-200/20 bg-dark-200 px-3 py-1.5 text-sm text-light-100 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } 