/**
 * @file switch.tsx
 * @description A toggle switch component, built on Radix UI Switch primitives.
 * It provides a styled switch for boolean on/off states, often used in forms or settings.
 *
 * @module components/ui/Switch
 *
 * @see {@link https://www.radix-ui.com/primitives/docs/components/switch Radix UI Switch}
 *
 * @param {SwitchProps} props - Props for the Switch component.
 * @param {string} [props.className] - Optional additional CSS classes for the root switch element.
 * @param {React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>} ...props - Other Radix Switch Root props.
 *
 * @returns {JSX.Element} The Switch component.
 *
 * @example
 * <div style={{ display: 'flex', alignItems: 'center' }}>
 *   <Switch id="airplane-mode" />
 *   <Label htmlFor="airplane-mode" style={{ marginLeft: 8 }}>Airplane Mode</Label>
 * </div>
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @dependencies
 * - `react` for `forwardRef`.
 * - `@radix-ui/react-switch` for the base switch primitives.
 * - `@/lib/utils` for `cn` utility.
 *
 * @note Includes styling for checked, unchecked, focused, and disabled states.
 * The thumb animation is handled by CSS transitions.
 */
"use client"

import * as React from "react"
import type { JSX } from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

export type SwitchProps =
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, ...props }, ref): JSX.Element => (
  <SwitchPrimitive.Root
    data-slot="switch"
    className={cn(
      "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch }
