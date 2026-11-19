import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login({ loginId, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({
        loginId: data.loginId,
        nickname: data.nickname,
        role: data.role,
      }))
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">P</div>
          <h2 className="auth-title">로그인</h2>
          <p className="auth-sub">포케체크에 오신 것을 환영합니다</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <span className="auth-field-icon">👤</span>
            <input
              className="auth-input"
              type="text"
              placeholder="아이디"
              value={loginId}
              onChange={e => setLoginId(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="auth-field">
            <span className="auth-field-icon">🔒</span>
            <input
              className="auth-input"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <label className="remember-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="remember-check"
            />
            <span className="remember-box" />
            <span className="remember-text">로그인 상태 유지</span>
          </label>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="auth-footer">
          아직 계정이 없으신가요?{' '}
          <Link to="/signup" className="auth-link">회원가입</Link>
        </div>
      </div>
    </div>
  )
}
