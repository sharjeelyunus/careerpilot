/**
 * @file popover.tsx
 * @description UI components for creating popovers, built on Radix UI Popover primitives.
 * Provides Popover, PopoverTrigger, PopoverContent, and PopoverAnchor.
 *
 * @module components/ui/Popover
 *
 * @see {@link https://www.radix-ui.com/primitives/docs/components/popover Radix UI Popover}
 *
 * @exports Popover - The root component for a popover.
 * @exports PopoverTrigger - The element that triggers the popover to open.
 * @exports PopoverContent - The content displayed within the popover.
 * @exports PopoverAnchor - An optional anchor point for the popover, used for positioning.
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @example
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button variant="outline">Open popover</Button>
 *   </PopoverTrigger>
 *   <PopoverContent className="w-80">
 *     <p>Popover content goes here.</p>
 *   </PopoverContent>
 * </Popover>
 *
 * @dependencies
 * - `react` for `forwardRef`.
 * - `@radix-ui/react-popover` for the base popover primitives.
 * - `@/lib/utils` for `cn` utility.
 *
 * @note Styled with Tailwind CSS, including animations for opening and closing.
 */
"use client"

import * as React from "react"
import type { JSX } from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

// Simple wrappers, Radix handles refs internally if needed for these.
const Popover = (props: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>) => (
  <PopoverPrimitive.Root {...props} />
)

const PopoverTrigger = (props: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>) => (
  <PopoverPrimitive.Trigger {...props} />
)

const PopoverAnchor = (props: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>) => (
  <PopoverPrimitive.Anchor {...props} />
)

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  ({ className, align = "center", sideOffset = 4, ...props }, ref): JSX.Element => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-[var(--radix-popover-content-transform-origin)] rounded-md border p-4 shadow-md outline-none max-h-[calc(100vh-30rem)] overflow-y-auto",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
