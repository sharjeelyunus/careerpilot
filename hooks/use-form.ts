import { useState, useCallback } from 'react'
import { useMemoizedCallback } from '@/lib/performance'
import { validateForm } from '@/lib/validation'
import { z } from 'zod'

type FormState<T> = {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
}

type UseFormOptions<T> = {
  initialValues: T
  validationSchema: z.ZodType<T>
  onSubmit: (values: T) => Promise<void>
}

export function useForm<T>({ initialValues, validationSchema, onSubmit }: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  })

  const validate = useMemoizedCallback((values: unknown) => {
    const result = validateForm(validationSchema, values)
    return result
  }, [validationSchema])

  const handleChange = useCallback(
    (name: keyof T) => (value: T[keyof T]) => {
      setState(prev => {
        const newValues = { ...prev.values, [name]: value }
        const { errors } = validate(newValues)
        return {
          ...prev,
          values: newValues,
          errors: errors || {},
          touched: { ...prev.touched, [name]: true },
        }
      })
    },
    [validate]
  )

  const handleBlur = useCallback((name: keyof T) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: true },
    }))
  }, [])

  const handleSubmit = useMemoizedCallback(async () => {
    const result = validate(state.values)
    setState(prev => ({ ...prev, errors: result.errors || {}, isSubmitting: true }))

    if (result.success) {
      try {
        await onSubmit(state.values)
      } catch (error) {
        setState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            _: error instanceof Error ? error.message : 'An error occurred',
          },
        }))
      } finally {
        setState(prev => ({ ...prev, isSubmitting: false }))
      }
    } else {
      setState(prev => ({ ...prev, isSubmitting: false }))
    }
  }, [state.values, validate, onSubmit])

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  }
} 