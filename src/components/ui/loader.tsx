/**
 * @file loader.tsx
 * @description A simple spinner loader component for indicating loading states.
 * It displays a circular spinner animation.
 *
 * @module components/ui/SpinnerLoader
 *
 * @param {SpinnerLoaderProps} props - Props for the SpinnerLoader component.
 * @param {string} [props.className] - Optional additional CSS classes for the container div.
 *
 * @returns {JSX.Element} The SpinnerLoader component.
 *
 * @example
 * <SpinnerLoader className="my-4" />
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @dependencies
 * - `react` for functional component definition.
 * - `@/lib/utils` for `cn` utility.
 *
 * @note The animation is achieved using Tailwind CSS `animate-spin` utility.
 */

// React/Next.js
import type { FC, JSX } from 'react';

// Utilities
import { cn } from "@/lib/utils";

// Type Definitions
interface SpinnerLoaderProps {
  className?: string;
}

const SpinnerLoader: FC<SpinnerLoaderProps> = ({ className }): JSX.Element => { // Using FC directly
  return (
    <div className={cn('flex justify-center items-center', className)}>
      <div className='w-10 h-10 animate-spin rounded-full border-t-2 border-b-2 border-primary-100' />
    </div>
  );
};

export default SpinnerLoader;
