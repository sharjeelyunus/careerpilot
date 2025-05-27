/**
 * @file input.tsx
 * @description A reusable, styled input component for text entry.
 * This component wraps the native HTML input element and applies consistent styling using Tailwind CSS.
 *
 * @module components/ui/Input
 *
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - Standard HTML input attributes.
 * @param {string} [props.className] - Optional additional CSS classes for custom styling.
 * @param {string} [props.type] - The type of the input (e.g., 'text', 'password', 'email').
 *
 * @returns {JSX.Element} The Input component.
 *
 * @example
 * <Input type="text" placeholder="Enter your name" />
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @dependencies
 * - `react` for forwardRef.
 * - `@/lib/utils` for `cn` utility.
 *
 * @note Applies focus, invalid, and disabled states styling.
 */

// React/Next.js
import * as React from "react";
import type { JSX } from "react"; // Added for JSX.Element return type

// Utilities
import { cn } from "@/lib/utils";

// Type Definitions
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * A styled input component.
 * @param {InputProps} props - The props for the component.
 * @returns {JSX.Element} The rendered input element.
 */
const Input = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ className, type, ...props }, ref): JSX.Element => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
