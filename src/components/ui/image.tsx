/**
 * @file image.tsx
 * @description An optimized image component that wraps Next.js's Image component.
 * It provides a loading skeleton and smooth transition once the image is loaded.
 *
 * @module components/ui/OptimizedImage
 *
 * @param {string} src - The source URL of the image.
 * @param {string} alt - The alt text for the image.
 * @param {string} [className] - Optional additional CSS classes for the NextImage component.
 * @param {string} [containerClassName] - Optional additional CSS classes for the container div.
 * @param {(result: { naturalWidth: number; naturalHeight: number }) => void} [onLoadingComplete] - Callback function when image loading is complete.
 * @param {Omit<ComponentProps<typeof NextImage>, 'src' | 'alt' | 'className' | 'onLoadingComplete'>} ...props - Other props supported by Next.js Image.
 *
 * @returns {JSX.Element} The OptimizedImage component.
 *
 * @example
 * <OptimizedImage
 *   src="/path/to/image.jpg"
 *   alt="Descriptive alt text"
 *   width={500}
 *   height={300}
 *   containerClassName="rounded-lg"
 * />
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @dependencies
 * - `next/image` for optimized image handling.
 * - `react` for component logic.
 * - `@/lib/utils` for `cn` utility.
 *
 * @note The component handles its own loading state internally using `useState`.
 * It applies a pulse animation to a placeholder while the image is loading.
 */

// React/Next.js
import NextImage from "next/image";
import { useState } from "react";
import type { ComponentProps, JSX } from "react";

// Utilities
import { cn } from "@/lib/utils";

// Type Definitions
export interface OptimizedImageProps extends ComponentProps<typeof NextImage> {
  containerClassName?: string;
}

/**
 * An image component optimized with Next.js Image, featuring a loading skeleton.
 * @param {OptimizedImageProps} props - The props for the component.
 * @returns {JSX.Element} The rendered optimized image.
 */
export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  onLoadingComplete,
  ...props
}: OptimizedImageProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <NextImage
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        onLoadingComplete={(result) => {
          setIsLoading(false);
          if (onLoadingComplete) {
            onLoadingComplete(result);
          }
        }}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}
