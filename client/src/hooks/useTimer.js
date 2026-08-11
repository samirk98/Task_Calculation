import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for the live timer display.
 * Uses the stored startedAt timestamp to calculate elapsed time,
 * ensuring accuracy even if the browser tab was inactive or throttled.
 *
 * @param {string|null} startedAt - ISO timestamp of when the session started
 * @returns {number} - elapsed seconds
 */
export function useTimer(startedAt) {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!startedAt) {
      setElapsed(0)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const startTime = new Date(startedAt).getTime()

    const updateElapsed = () => {
      const now = Date.now()
      const diff = Math.floor((now - startTime) / 1000)
      setElapsed(Math.max(0, diff))
    }

    // Calculate immediately, then update every second
    updateElapsed()
    intervalRef.current = setInterval(updateElapsed, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [startedAt])

  return elapsed
}
