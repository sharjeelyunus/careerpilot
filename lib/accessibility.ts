import { useCallback, useEffect, useRef, useState } from 'react'

export function useFocusTrap() {
  const containerRef = useRef<HTMLElement>(null)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Tab') return

    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (!focusableElements?.length) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        event.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        event.preventDefault()
      }
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return containerRef
}

export function useAriaLive(priority: 'polite' | 'assertive' = 'polite') {
  const [message, setMessage] = useState<string>('')

  const announce = useCallback((text: string) => {
    setMessage(text)
  }, [])

  return {
    message,
    announce,
    ariaLiveProps: {
      'aria-live': priority,
      'aria-atomic': 'true',
    },
  }
}

export function useKeyboardNavigation() {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        const nextElement = target.nextElementSibling as HTMLElement
        if (nextElement) {
          nextElement.focus()
          event.preventDefault()
        }
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        const prevElement = target.previousElementSibling as HTMLElement
        if (prevElement) {
          prevElement.focus()
          event.preventDefault()
        }
        break
      case 'Home':
        const firstElement = target.parentElement?.firstElementChild as HTMLElement
        if (firstElement) {
          firstElement.focus()
          event.preventDefault()
        }
        break
      case 'End':
        const lastElement = target.parentElement?.lastElementChild as HTMLElement
        if (lastElement) {
          lastElement.focus()
          event.preventDefault()
        }
        break
    }
  }, [])

  return handleKeyDown
}

export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)

  const handleFocus = useCallback((event: FocusEvent) => {
    setFocusedElement(event.target as HTMLElement)
  }, [])

  const handleBlur = useCallback(() => {
    setFocusedElement(null)
  }, [])

  return {
    focusedElement,
    handleFocus,
    handleBlur,
  }
} 