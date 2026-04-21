import { useEffect, useRef, useState } from 'react'

export function useMinimumLoaderDelay(isLoading, minimumDuration = 300) {
  const [keepVisible, setKeepVisible] = useState(isLoading)
  const startedAtRef = useRef(0)

  useEffect(() => {
    let timeoutId

    if (isLoading) {
      startedAtRef.current = Date.now()
      timeoutId = setTimeout(() => setKeepVisible(true), 0)
      return () => clearTimeout(timeoutId)
    }

    const elapsed = Date.now() - startedAtRef.current
    const remaining = Math.max(0, minimumDuration - elapsed)
    timeoutId = setTimeout(() => setKeepVisible(false), remaining)

    return () => clearTimeout(timeoutId)
  }, [isLoading, minimumDuration])

  return isLoading || keepVisible
}
