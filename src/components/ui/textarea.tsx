/**
 * @file textarea.tsx
 * @description A styled textarea component for multi-line text input.
 * It provides a consistent look and feel for text areas across the application.
 *
 * @module components/ui/Textarea
 *
 * @param {TextareaProps} props - Props for the Textarea component.
 * @param {string} [props.className] - Optional additional CSS classes for custom styling.
 * @param {React.TextareaHTMLAttributes<HTMLTextAreaElement>} ...props - Other standard HTML textarea attributes.
 *
 * @returns {JSX.Element} The Textarea component.
 *
 * @example
 * <Textarea placeholder="Type your message here." rows={4} />
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @dependencies
 * - `react` for `forwardRef`.
 * - `@/lib/utils` for `cn` utility.
 *
 * @note Includes styling for focus, invalid, and disabled states.
 * Uses `field-sizing-content` for auto-resizing based on content, if supported by the browser, with a `min-h-16`.
 */

// React/Next.js
import * as React from "react";
import type { JSX } from "react"; // Added for JSX.Element return type

// Utilities
import { cn } from "@/lib/utils";

// Type Definitions
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, ...props }, ref): JSX.Element => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
