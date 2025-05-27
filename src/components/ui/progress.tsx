/**
 * @file progress.tsx
 * @description A progress bar component, built on Radix UI Progress primitives.
 * It displays a visual indicator of progress towards completion.
 *
 * @module components/ui/Progress
 *
 * @see {@link https://www.radix-ui.com/primitives/docs/components/progress Radix UI Progress}
 *
 * @param {ProgressProps} props - Props for the Progress component.
 * @param {string} [props.className] - Optional additional CSS classes for the root element.
 * @param {number | null | undefined} [props.value] - The current progress value (0-100). If null or undefined, the bar appears indeterminate (filled).
 * @param {Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, 'value'>} ...props - Other Radix Progress Root props.
 *
 * @returns {JSX.Element} The Progress component.
 *
 * @example
 * <Progress value={33} className="w-[60%]" />
 * <Progress value={null} /> // Indeterminate
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @dependencies
 * - `react` for `forwardRef`.
 * - `@radix-ui/react-progress` for the base progress primitives.
 * - `@/lib/utils` for `cn` utility.
 *
 * @note The `value` prop controls the fill percentage. The indicator's `transformX` style is used for the fill animation.
 */
"use client"

import * as React from "react"
import type { JSX } from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number | null
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, ...props }, ref): JSX.Element => (
  <ProgressPrimitive.Root
    ref={ref}
    data-slot="progress"
    className={cn(
      "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className="bg-primary h-full w-full flex-1 transition-all"
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress }
