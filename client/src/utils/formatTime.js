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
 * Format seconds into decimal hours for Steam-like display.
 * Examples: 0 → "0", 3600 → "1.0", 5400 → "1.5", 360 → "0.1"
 */
export function formatHours(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '0'
  const hours = totalSeconds / 3600
  if (hours >= 10) return Math.round(hours).toString()
  return hours.toFixed(1)
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

/**
 * Format an ISO date string into a "last played" display like Steam.
 * Examples: "2026-08-10T..." → "10 Aug", "2026-01-05T..." → "5 Jan"
 */
export function formatLastPlayed(isoString) {
  if (!isoString) return 'never'
  const date = new Date(isoString)
  const day = date.getDate()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${day} ${months[date.getMonth()]}`
}

/**
 * Calculate a "level" from total seconds, like Steam's level system.
 * Every 5 hours = 1 level, min level 1.
 */
export function calculateLevel(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return 1
  return Math.max(1, Math.floor(totalSeconds / (3600 * 5)) + 1)
}
