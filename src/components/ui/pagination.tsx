/**
 * @file pagination.tsx
 * @description A set of components for rendering pagination controls.
 * Includes container, content list, items, links (styled as buttons), previous/next buttons, and ellipsis for skipped pages.
 *
 * @module components/ui/Pagination
 *
 * @exports Pagination - The main navigation container for pagination (`<nav>`).
 * @exports PaginationContent - The list container for pagination items (`<ul>`).
 * @exports PaginationItem - A list item wrapper for pagination elements (`<li>`).
 * @exports PaginationLink - A link component (`<a>`), styled as a button, for page numbers and prev/next.
 * @exports PaginationPrevious - A specialized PaginationLink for the "previous page" button.
 * @exports PaginationNext - A specialized PaginationLink for the "next page" button.
 * @exports PaginationEllipsis - A component to indicate skipped pages (`<span>`).
 *
 * @version 1.0.1
 * @date 2023-10-30 (Placeholder, actual date may vary)
 *
 * @example
 * <Pagination>
 *   <PaginationContent>
 *     <PaginationItem>
 *       <PaginationPrevious href="#" />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="#" isActive>1</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="#">2</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationEllipsis />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationNext href="#" />
 *     </PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 *
 * @dependencies
 * - `react` for core React functionalities like `forwardRef`.
 * - `lucide-react` for icons (ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon).
 * - `@/lib/utils` for `cn` utility.
 * - `@/components/ui/button` for button styling (via `buttonVariants`).
 *
 * @note Leverages `buttonVariants` for consistent button styling.
 * Provides `isActive` prop for `PaginationLink` to indicate the current page.
 */
"use client";

// React/Next.js
import * as React from "react";
import type { JSX } from "react"; // Added for JSX.Element return type

// External Libraries
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

// Utilities & Constants
import { cn } from "@/lib/utils";
import { buttonVariants, type ButtonProps } from "@/components/ui/button"; // Imported ButtonProps

// Component Type Definitions

/**
 * Props for the Pagination root component (`<nav>` element).
 */
type PaginationProps = React.ComponentPropsWithoutRef<"nav">;

/**
 * Props for the PaginationContent component (`<ul>` element).
 */
type PaginationContentProps = React.ComponentPropsWithoutRef<"ul">;

/**
 * Props for the PaginationItem component (`<li>` element).
 */
type PaginationItemProps = React.ComponentPropsWithoutRef<"li">;

/**
 * Props for the PaginationLink component (`<a>` element).
 * Extends ButtonProps for styling and standard anchor attributes.
 */
type PaginationLinkProps = {
  isActive?: boolean;
  href?: string; // href is optional for potential button-like usage without navigation
} & Pick<ButtonProps, "size"> &
  Omit<React.ComponentPropsWithoutRef<"a">, "href">;

/**
 * Props for the PaginationEllipsis component (`<span>` element).
 */
type PaginationEllipsisProps = React.ComponentPropsWithoutRef<"span">;

// Pagination Components

const Pagination = React.forwardRef<
  HTMLElement,
  PaginationProps
>(({ className, ...props }, ref): JSX.Element => (
  <nav
    ref={ref}
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
));
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  PaginationContentProps
>(({ className, ...props }, ref): JSX.Element => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1 list-none", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  PaginationItemProps
>(({ className, ...props }, ref): JSX.Element => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = React.forwardRef<
  HTMLAnchorElement,
  PaginationLinkProps
>(({ className, isActive, size = "icon", href, ...props }, ref): JSX.Element => (
  <a
    ref={ref}
    aria-current={isActive ? "page" : undefined}
    data-active={isActive} // For styling based on active state if needed
    href={href}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
));
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  Omit<PaginationLinkProps, "children" | "aria-label" | "size"> // Omitting props set internally
>(({ className, ...props }, ref): JSX.Element => (
  <PaginationLink
    ref={ref}
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
    {...props}
  >
    <ChevronLeftIcon className="size-4" />
    <span className="hidden sm:block">Previous</span>
  </PaginationLink>
));
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  Omit<PaginationLinkProps, "children" | "aria-label" | "size"> // Omitting props set internally
>(({ className, ...props }, ref): JSX.Element => (
  <PaginationLink
    ref={ref}
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
    {...props}
  >
    <span className="hidden sm:block">Next</span>
    <ChevronRightIcon className="size-4" />
  </PaginationLink>
));
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  PaginationEllipsisProps
>(({ className, ...props }, ref): JSX.Element => (
  <span
    ref={ref}
    aria-hidden
    className={cn("flex size-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontalIcon className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
));
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
