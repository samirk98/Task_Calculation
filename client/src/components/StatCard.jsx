import { formatDuration } from '../utils/formatTime'

export default function StatCard({ label, seconds, icon }) {
  return (
    <div className="steam-sidebar-item flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-sm">{icon}</span>}
        <span className="text-sm" style={{ color: '#8f98a0' }}>
          {label}
        </span>
      </div>
      <span className="text-sm font-semibold" style={{ color: '#c7d5e0' }}>
        {formatDuration(seconds)}
      </span>
    </div>
  )
}
