import { useState, useEffect } from 'react'
import { useMemoizedCallback } from '@/lib/performance'

type FetchState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

type Cache = {
  [key: string]: {
    data: unknown
    timestamp: number
  }
}

const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes
const cache: Cache = {}

export function useFetch<T>(
  url: string,
  options?: RequestInit
): FetchState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useMemoizedCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      // Check cache first
      const cached = cache[url]
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
        setState({
          data: cached.data as T,
          loading: false,
          error: null,
        })
        return
      }

      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Update cache
      cache[url] = {
        data,
        timestamp: Date.now(),
      }

      setState({
        data,
        loading: false,
        error: null,
      })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('An error occurred'),
      })
    }
  }, [url, options])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
} 