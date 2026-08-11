import { formatDuration } from '../utils/formatTime'

export default function StatCard({ label, seconds, icon }) {
  return (
    <div className="rounded-xl border border-slate-700/30 bg-slate-900/50 backdrop-blur-sm p-6 text-center transition-colors hover:border-slate-600/40">
      <div className="flex items-center justify-center gap-2 mb-3">
        {icon && <span className="text-base">{icon}</span>}
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-400">
          {label}
        </span>
      </div>
      <div className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
        {formatDuration(seconds)}
      </div>
    </div>
  )
}
