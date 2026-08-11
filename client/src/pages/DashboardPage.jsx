import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  getStats,
  getActiveSession,
  startSession,
  finishSession,
} from '../services/api'
import CategoryCard from '../components/CategoryCard'
import StatCard from '../components/StatCard'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [activeSession, setActiveSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, activeRes] = await Promise.all([
        getStats(),
        getActiveSession(),
      ])
      setStats(statsRes.data)
      setActiveSession(activeRes.data.session)
      setError('')
    } catch (err) {
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleStart = async (category) => {
    setActionLoading(true)
    setError('')
    try {
      const res = await startSession(category)
      setActiveSession(res.data.session)
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to start session.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  const handleFinish = async () => {
    if (!activeSession) return
    setActionLoading(true)
    setError('')
    try {
      await finishSession(activeSession.id)
      setActiveSession(null)
      // Re-fetch stats to update all totals
      const statsRes = await getStats()
      setStats(statsRes.data)
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to finish session.'
      )
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading your learning data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">
                Learning Tracker
              </h1>
              <p className="text-xs text-slate-500 leading-tight">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700/40 hover:border-slate-600 rounded-lg transition-all duration-200 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Welcome back
          </h2>
          <p className="text-slate-400 text-sm">
            Your personal learning activity overview
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Category Cards */}
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-8 sm:mb-10">
          <CategoryCard
            category="programming"
            totalSeconds={stats?.programmingTotal || 0}
            activeSession={
              activeSession?.category === 'programming' ? activeSession : null
            }
            isOtherActive={
              !!activeSession && activeSession.category !== 'programming'
            }
            onStart={() => handleStart('programming')}
            onFinish={handleFinish}
            isLoading={actionLoading}
          />
          <CategoryCard
            category="language"
            totalSeconds={stats?.languageTotal || 0}
            activeSession={
              activeSession?.category === 'language' ? activeSession : null
            }
            isOtherActive={
              !!activeSession && activeSession.category !== 'language'
            }
            onStart={() => handleStart('language')}
            onFinish={handleFinish}
            isLoading={actionLoading}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="h-px flex-1 bg-slate-800/60" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-slate-500">
            Statistics
          </span>
          <div className="h-px flex-1 bg-slate-800/60" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Today"
            seconds={stats?.todayTotal || 0}
            icon="📅"
          />
          <StatCard
            label="Past 2 Weeks"
            seconds={stats?.last14DaysTotal || 0}
            icon="📊"
          />
          <StatCard
            label="Total Hours"
            seconds={stats?.allTimeTotal || 0}
            icon="⏱️"
          />
        </div>
      </main>
    </div>
  )
}
