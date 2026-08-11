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
import { formatHours, formatDuration, calculateLevel } from '../utils/formatTime'

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

  // Derived values
  const allTimeTotal = stats?.allTimeTotal || 0
  const level = calculateLevel(allTimeTotal)
  const userName = user?.email?.split('@')[0] || 'Learner'
  const totalHours = formatHours(allTimeTotal)
  const past2WeeksHours = formatHours(stats?.last14DaysTotal || 0)

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#1b2838' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-2 rounded-full animate-spin"
            style={{
              borderColor: 'rgba(102, 192, 244, 0.3)',
              borderTopColor: '#66c0f4',
            }}
          />
          <p className="text-sm" style={{ color: '#8f98a0' }}>
            Loading your learning data...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1b2838' }}>
      {/* ===== STEAM TOP NAV BAR ===== */}
      <header
        className="border-b"
        style={{
          backgroundColor: '#171a21',
          borderColor: '#2a475e',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📚</span>
            <span
              className="text-sm font-semibold"
              style={{ color: '#c7d5e0' }}
            >
              Learning Tracker
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: '#8f98a0' }}>
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 text-xs rounded-sm transition-all duration-200 cursor-pointer"
              style={{
                color: '#8f98a0',
                border: '1px solid #2a475e',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#c7d5e0'
                e.target.style.borderColor = '#3d6c8e'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#8f98a0'
                e.target.style.borderColor = '#2a475e'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-0">
        {/* ===== PROFILE HEADER ===== */}
        <div
          className="flex flex-col sm:flex-row gap-6 py-6 border-b"
          style={{ borderColor: '#2a475e' }}
        >
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div
              className="w-[84px] h-[84px] rounded-sm flex items-center justify-center text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #1a9fff 0%, #0d5aa7 100%)',
                color: '#fff',
                border: '2px solid #2a475e',
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Profile info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-0.5">
                  {userName}
                </h1>
                <p className="text-xs" style={{ color: '#8f98a0' }}>
                  {user?.email}
                </p>
                <p
                  className="text-xs mt-1 italic"
                  style={{ color: '#8f98a0' }}
                >
                  Learning is a lifelong journey. 📖
                </p>
              </div>

              {/* Level & XP section */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-sm font-medium"
                    style={{ color: '#8f98a0' }}
                  >
                    Level
                  </span>
                  <div className="steam-level-badge">{level}</div>
                </div>

                {/* XP badge */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-sm"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <span className="text-sm">🏆</span>
                  <div>
                    <div
                      className="text-xs font-medium"
                      style={{ color: '#c7d5e0' }}
                    >
                      {totalHours} Total Hours
                    </div>
                    <div className="text-[10px]" style={{ color: '#8f98a0' }}>
                      {level * 50} XP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-sm p-3 mt-4"
            style={{
              background: 'rgba(255, 70, 70, 0.1)',
              border: '1px solid rgba(255, 70, 70, 0.2)',
            }}
          >
            <p className="text-sm" style={{ color: '#ff6b6b' }}>
              {error}
            </p>
          </div>
        )}

        {/* ===== TWO-COLUMN LAYOUT ===== */}
        <div className="flex flex-col lg:flex-row gap-0 mt-4">
          {/* ===== LEFT COLUMN — Recent Activity ===== */}
          <div
            className="flex-1 lg:border-r lg:pr-6"
            style={{ borderColor: '#2a475e' }}
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="steam-section-header flex-1 mb-0 pb-0 border-b-0">
                Recent Activity
              </h2>
              <span className="text-xs" style={{ color: '#8f98a0' }}>
                {past2WeeksHours} hours past 2 weeks
              </span>
            </div>
            <div
              className="mb-5"
              style={{
                height: '1px',
                background: '#2a475e',
              }}
            />

            {/* Category game entries */}
            <div className="flex flex-col gap-4 mb-6">
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

            {/* View links (decorative, like Steam) */}
            <div className="flex items-center gap-1 mb-6">
              <span className="text-xs" style={{ color: '#8f98a0' }}>
                View
              </span>
              <span
                className="text-xs font-medium cursor-pointer hover:underline"
                style={{ color: '#c7d5e0' }}
              >
                All Activity
              </span>
              <span className="text-xs" style={{ color: '#8f98a0' }}>
                |
              </span>
              <span
                className="text-xs font-medium cursor-pointer hover:underline"
                style={{ color: '#c7d5e0' }}
              >
                History
              </span>
              <span className="text-xs" style={{ color: '#8f98a0' }}>
                |
              </span>
              <span
                className="text-xs font-medium cursor-pointer hover:underline"
                style={{ color: '#c7d5e0' }}
              >
                Statistics
              </span>
            </div>
          </div>

          {/* ===== RIGHT COLUMN — Sidebar ===== */}
          <div className="lg:w-[280px] lg:pl-6">
            {/* Online status */}
            <div className="mb-4">
              <span
                className="text-sm font-medium italic"
                style={{ color: '#57cbde' }}
              >
                {activeSession ? 'Currently Learning' : 'Currently Online'}
              </span>
            </div>

            <div
              className="mb-4"
              style={{
                height: '1px',
                background: '#2a475e',
              }}
            />

            {/* Stats section */}
            <div className="mb-5">
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

            <div
              className="mb-4"
              style={{
                height: '1px',
                background: '#2a475e',
              }}
            />

            {/* Badges section */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-sm"
                  style={{ color: '#8f98a0' }}
                >
                  Badges
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: '#c7d5e0' }}
                >
                  {level}
                </span>
              </div>
              <div className="flex gap-2">
                {/* Decorative badge icons */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                  style={{
                    background: 'rgba(26, 159, 255, 0.15)',
                    border: '1px solid rgba(26, 159, 255, 0.3)',
                  }}
                  title="Beginner Learner"
                >
                  🎓
                </div>
                {allTimeTotal >= 3600 && (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                    style={{
                      background: 'rgba(102, 192, 244, 0.15)',
                      border: '1px solid rgba(102, 192, 244, 0.3)',
                    }}
                    title="1 Hour Club"
                  >
                    ⭐
                  </div>
                )}
                {allTimeTotal >= 18000 && (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                    style={{
                      background: 'rgba(179, 136, 255, 0.15)',
                      border: '1px solid rgba(179, 136, 255, 0.3)',
                    }}
                    title="5 Hour Dedication"
                  >
                    💎
                  </div>
                )}
                {allTimeTotal >= 36000 && (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                    style={{
                      background: 'rgba(255, 215, 0, 0.15)',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                    }}
                    title="10 Hour Master"
                  >
                    🏅
                  </div>
                )}
              </div>
            </div>

            <div
              className="mb-4"
              style={{
                height: '1px',
                background: '#2a475e',
              }}
            />

            {/* Categories / Games count */}
            <div className="space-y-0">
              <div className="steam-sidebar-item flex items-center justify-between px-2">
                <span className="text-sm" style={{ color: '#8f98a0' }}>
                  Categories
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: '#c7d5e0' }}
                >
                  2
                </span>
              </div>
              <div className="steam-sidebar-item flex items-center justify-between px-2">
                <span className="text-sm" style={{ color: '#8f98a0' }}>
                  Programming
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: '#66c0f4' }}
                >
                  {formatHours(stats?.programmingTotal || 0)} hrs
                </span>
              </div>
              <div className="steam-sidebar-item flex items-center justify-between px-2">
                <span className="text-sm" style={{ color: '#8f98a0' }}>
                  Language
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: '#b388ff' }}
                >
                  {formatHours(stats?.languageTotal || 0)} hrs
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
