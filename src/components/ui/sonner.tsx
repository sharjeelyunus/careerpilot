/**
 * @file sonner.tsx
 * @description Provides a themed Toaster component for displaying notifications (toasts)
 * using the `sonner` library. It adapts to the current theme (light/dark) provided by `next-themes`.
 *
 * @module components/ui/Toaster (Sonner)
 *
 * @see {@link https://sonner.emilkowal.ski/ Sonner Documentation}
 * @see {@link https://github.com/pacocoursey/next-themes next-themes Documentation}
 *
 * @param {CustomToasterProps} props - Props for the Sonner Toaster, excluding `theme`, `className`, and `style` which are managed by this component.
 * @param {Omit<SonnerToasterProps, 'theme' | 'className' | 'style'>} ...props - Other props from `sonner` ToasterProps.
 *
 * @returns {JSX.Element} The configured Toaster component.
 *
 * @example
 * // In your main layout or provider component (e.g., Providers.tsx):
 * <Toaster position="top-right" richColors />
 *
 * // To show a toast from another component:
 * import { toast } from "sonner";
 * toast.success("Event has been created!");
 * toast.error("Failed to save changes.");
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @dependencies
 * - `react` (implicitly used by Next.js components, explicit import not strictly needed for JSX in modern Next.js but good for clarity).
 * - `next-themes` for theme detection.
 * - `sonner` for the toast functionality.
 *
 * @note This component ensures that toast notifications align with the application's theme.
 * It applies custom classNames for deeper styling integration with Tailwind CSS.
 * The CSS variables mentioned in a previous version of this file's comment (`--normal-bg`, etc.) are not directly used here;
 * styling is achieved via Tailwind classes and Sonner's `classNames` prop.
 */
"use client";

// React/Next.js
// import * as React from "react"; // No longer explicitly needed for JSX return type if not using other React specific APIs like forwardRef, etc.
import type { JSX } from "react"; // Added for JSX.Element return type

// External Libraries
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps as SonnerToasterProps } from "sonner";

// Type Definitions
/**
 * Props for the custom Toaster component, omitting ones it controls internally.
 */
type CustomToasterProps = Omit<SonnerToasterProps, 'theme' | 'className' | 'style'>;

const Toaster = ({ ...props }: CustomToasterProps): JSX.Element => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as SonnerToasterProps["theme"]} // Cast theme to the expected type
      className="toaster group" // Base classes for the toaster container
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          // Add other classNames as needed for error, success, etc.
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
