/**
 * Format seconds into a human-readable duration string for stats display.
 * Examples: 30 → "30s", 300 → "5m", 5100 → "1h 25m", 153000 → "42h 30m"
 */
export function formatDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '0m'

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    if (minutes > 0) return `${hours}h ${minutes}m`
    return `${hours}h`
  }

  if (minutes > 0) return `${minutes}m`

  return `${seconds}s`
}

/**
 * Format seconds into HH:MM:SS for live timer display.
 * Examples: 0 → "00:00:00", 8077 → "02:14:37"
 */
export function formatTimer(totalSeconds) {
  if (!totalSeconds || totalSeconds < 0) totalSeconds = 0

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((v) => String(v).padStart(2, '0'))
    .join(':')
}
