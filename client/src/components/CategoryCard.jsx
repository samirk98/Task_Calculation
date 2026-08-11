import { formatDuration, formatTimer } from '../utils/formatTime'
import { useTimer } from '../hooks/useTimer'

export default function CategoryCard({
  category,
  totalSeconds,
  activeSession,
  isOtherActive,
  onStart,
  onFinish,
  isLoading,
}) {
  const isProgramming = category === 'programming'
  const elapsed = useTimer(activeSession?.startedAt)
  const isActive = !!activeSession

  const label = isProgramming ? 'PROGRAMMING' : 'LANGUAGE'
  const icon = isProgramming ? '💻' : '🌍'

  return (
    <div
      className={`
        relative rounded-2xl border overflow-hidden
        transition-all duration-500 ease-out
        ${isActive
          ? isProgramming
            ? 'border-blue-500/40 shadow-[0_0_40px_-12px_rgba(59,130,246,0.3)] bg-gradient-to-b from-blue-950/40 to-slate-900/90'
            : 'border-violet-500/40 shadow-[0_0_40px_-12px_rgba(139,92,246,0.3)] bg-gradient-to-b from-violet-950/40 to-slate-900/90'
          : isProgramming
            ? 'border-slate-700/40 bg-gradient-to-b from-slate-900/90 to-slate-900/60 hover:border-blue-500/20'
            : 'border-slate-700/40 bg-gradient-to-b from-slate-900/90 to-slate-900/60 hover:border-violet-500/20'
        }
        backdrop-blur-sm p-8 md:p-10
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <span
            className={`
              inline-block w-2 h-2 rounded-full animate-pulse
              ${isProgramming ? 'bg-blue-400' : 'bg-violet-400'}
            `}
          />
          <span className="text-[11px] text-slate-400 uppercase tracking-widest font-medium">
            Active
          </span>
        </div>
      )}

      {/* Category label */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-2xl">{icon}</span>
        <h2
          className={`
            text-xs font-bold tracking-[0.25em] uppercase
            ${isProgramming ? 'text-blue-400' : 'text-violet-400'}
          `}
        >
          {label}
        </h2>
      </div>

      {/* Time display */}
      <div className="text-center mb-10">
        {isActive ? (
          <div
            className={`
              text-5xl sm:text-6xl md:text-7xl font-bold tabular-nums tracking-tight
              ${isProgramming ? 'text-blue-200' : 'text-violet-200'}
            `}
          >
            {formatTimer(elapsed)}
          </div>
        ) : (
          <>
            <div
              className={`
                text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight
                ${totalSeconds > 0
                  ? isProgramming
                    ? 'text-blue-50'
                    : 'text-violet-50'
                  : 'text-slate-500'
                }
              `}
            >
              {formatDuration(totalSeconds)}
            </div>
            <p className="text-slate-500 text-sm mt-3 tracking-wide">
              {totalSeconds > 0 ? 'hours on record' : 'no sessions yet'}
            </p>
          </>
        )}
      </div>

      {/* Action button */}
      <div className="flex justify-center">
        {isActive ? (
          <button
            onClick={onFinish}
            disabled={isLoading}
            className={`
              px-10 py-3.5 rounded-xl font-semibold text-sm tracking-wider uppercase
              transition-all duration-200 cursor-pointer
              ${isProgramming
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.97]
            `}
          >
            {isLoading ? 'Saving...' : 'Finish'}
          </button>
        ) : (
          <button
            onClick={onStart}
            disabled={isOtherActive || isLoading}
            className={`
              px-10 py-3.5 rounded-xl font-semibold text-sm tracking-wider uppercase
              transition-all duration-200 cursor-pointer
              ${isOtherActive
                ? 'bg-slate-800/60 text-slate-600 cursor-not-allowed border border-slate-700/30'
                : isProgramming
                  ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/25 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/10'
                  : 'bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/25 hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/10'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.97]
            `}
          >
            {isLoading ? 'Starting...' : 'Start'}
          </button>
        )}
      </div>
    </div>
  )
}
