import { formatHours, formatTimer, formatLastPlayed } from '../utils/formatTime'
import { useTimer } from '../hooks/useTimer'

export default function CategoryCard({
  category,
  totalSeconds,
  activeSession,
  isOtherActive,
  onStart,
  onFinish,
  isLoading,
  lastPlayed,
}) {
  const isProgramming = category === 'programming'
  const elapsed = useTimer(activeSession?.startedAt)
  const isActive = !!activeSession

  const label = isProgramming ? 'Programming' : 'Language Learning'
  const icon = isProgramming ? '💻' : '🌍'
  const accentColor = isProgramming ? '#66c0f4' : '#b388ff'

  const hoursDisplay = formatHours(totalSeconds)

  return (
    <div
      className={`steam-game-entry rounded-sm p-4 ${isActive ? 'steam-active-glow' : ''}`}
    >
      <div className="flex gap-4">
        {/* Game icon / banner */}
        <div
          className="flex-shrink-0 w-[120px] h-[45px] rounded-sm flex items-center justify-center text-2xl"
          style={{
            background: isProgramming
              ? 'linear-gradient(135deg, #1a3a5c 0%, #0d2137 100%)'
              : 'linear-gradient(135deg, #3d1a5c 0%, #1f0d37 100%)',
          }}
        >
          <span className="drop-shadow-lg">{icon}</span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3
              className="text-sm font-medium truncate"
              style={{ color: '#c7d5e0' }}
            >
              {label}
            </h3>
            <div className="flex-shrink-0 text-right">
              <div className="text-xs" style={{ color: '#8f98a0' }}>
                {hoursDisplay} hrs on record
              </div>
              {!isActive && (
                <div className="text-xs" style={{ color: '#8f98a0' }}>
                  last played on {formatLastPlayed(lastPlayed)}
                </div>
              )}
            </div>
          </div>

          {/* Active timer */}
          {isActive && (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full steam-pulse"
                  style={{ backgroundColor: '#57cbde' }}
                />
                <span
                  className="text-xs font-medium tabular-nums"
                  style={{ color: '#57cbde' }}
                >
                  {formatTimer(elapsed)}
                </span>
              </div>
            </div>
          )}

          {/* Achievement progress bar (decorative, represents total time) */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[11px]" style={{ color: '#8f98a0' }}>
              Progress
            </span>
            <div className="steam-progress-bar flex-1">
              <div
                className="steam-progress-fill"
                style={{
                  width: `${Math.min(100, (totalSeconds / (3600 * 100)) * 100)}%`,
                  background: accentColor,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action button row */}
      <div className="mt-3 flex justify-end">
        {isActive ? (
          <button
            onClick={onFinish}
            disabled={isLoading}
            className="steam-btn steam-btn-finish"
          >
            {isLoading ? 'Saving...' : '■ Stop Session'}
          </button>
        ) : (
          <button
            onClick={onStart}
            disabled={isOtherActive || isLoading}
            className="steam-btn"
          >
            {isLoading ? 'Starting...' : '▶ Start Session'}
          </button>
        )}
      </div>
    </div>
  )
}
