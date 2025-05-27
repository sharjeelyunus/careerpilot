/**
 * @file skeleton.tsx
 * @description A simple skeleton loader component used to indicate loading states.
 * It displays an animated pulsing block, typically used as a placeholder for content being loaded.
 *
 * @module components/ui/Skeleton
 *
 * @param {SkeletonProps} props - Props for the Skeleton component.
 * @param {string} [props.className] - Optional additional CSS classes for custom styling and sizing.
 * @param {React.HTMLAttributes<HTMLDivElement>} ...props - Other standard HTML div attributes.
 *
 * @returns {JSX.Element} The Skeleton component.
 *
 * @example
 * <Skeleton className="h-4 w-1/2 rounded-md" />
 * <Skeleton className="h-20 w-full" />
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @dependencies
 * - `react` for component definition and types.
 * - `@/lib/utils` for `cn` utility.
 *
 * @note The pulsing animation is achieved using Tailwind CSS `animate-pulse`.
 * The component is a simple styled `div`.
 */

// React/Next.js
import type { HTMLAttributes, JSX } from "react"; // Use type-only import for JSX

// Utilities
import { cn } from "@/lib/utils";

// Type Definitions
interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps): JSX.Element {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton }; 