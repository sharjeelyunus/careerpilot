/**
 * @file label.tsx
 * @description A styled label component for form elements, built on Radix UI Label primitives.
 * It enhances accessibility by associating text with form inputs.
 *
 * @module components/ui/Label
 *
 * @param {React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>} props - Props for the Radix Label Root component.
 * @param {string} [props.className] - Optional additional CSS classes for custom styling.
 *
 * @returns {JSX.Element} The Label component.
 *
 * @example
 * <Label htmlFor="email">Email Address</Label>
 * <Input type="email" id="email" />
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @dependencies
 * - `react` for `forwardRef`.
 * - `@radix-ui/react-label` for the underlying label primitive.
 * - `@/lib/utils` for `cn` utility.
 *
 * @note Uses `peer-disabled` and `group-data-[disabled=true]` for styling based on associated input's disabled state.
 */
"use client"

import * as React from "react"
import type { JSX } from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

// Component Props
export type LabelProps = React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
>;

/**
 * A styled label component.
 * @param {LabelProps} props - The props for the component.
 * @returns {JSX.Element} The rendered label element.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref): JSX.Element => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    className={cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label }
