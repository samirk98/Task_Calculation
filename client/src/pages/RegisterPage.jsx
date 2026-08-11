import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(email, password)
    } catch (err) {
      setError(
        err.response?.data?.error || 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#1b2838' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📚</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Learning Tracker
          </h1>
          <p style={{ color: '#8f98a0' }}>
            Start tracking your learning journey.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-sm p-8"
          style={{
            backgroundColor: '#171a21',
            border: '1px solid #2a475e',
          }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            Create Account
          </h2>

          {error && (
            <div
              className="rounded-sm p-3 mb-5"
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="register-email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#c7d5e0' }}
              >
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-sm text-white transition-colors focus:outline-none"
                style={{
                  backgroundColor: '#2a475e',
                  border: '1px solid #3d6c8e',
                  color: '#c7d5e0',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#66c0f4'
                  e.target.style.boxShadow = '0 0 5px rgba(102, 192, 244, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3d6c8e'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#c7d5e0' }}
              >
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-sm text-white transition-colors focus:outline-none"
                style={{
                  backgroundColor: '#2a475e',
                  border: '1px solid #3d6c8e',
                  color: '#c7d5e0',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#66c0f4'
                  e.target.style.boxShadow = '0 0 5px rgba(102, 192, 244, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3d6c8e'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-sm text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
              style={{
                background: 'linear-gradient(to right, #47bfff 5%, #1a44c2 60%)',
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  'linear-gradient(to right, #6fd4ff 5%, #2d5fe0 60%)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  'linear-gradient(to right, #47bfff 5%, #1a44c2 60%)'
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: '#8f98a0' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium transition-colors hover:underline"
              style={{ color: '#66c0f4' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
