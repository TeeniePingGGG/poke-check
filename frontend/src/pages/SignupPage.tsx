import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api/authApi'
import './LoginPage.css'

interface FormState {
  loginId: string
  password: string
  passwordConfirm: string
  nickname: string
  email: string
}

interface FormErrors {
  loginId?: string
  password?: string
  passwordConfirm?: string
  nickname?: string
  email?: string
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    loginId: '', password: '', passwordConfirm: '', nickname: '', email: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (form.loginId.length < 4) next.loginId = '아이디는 4자 이상이어야 합니다.'
    if (form.password.length < 6) next.password = '비밀번호는 6자 이상이어야 합니다.'
    if (form.password !== form.passwordConfirm) next.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    if (form.nickname.trim().length < 2) next.nickname = '닉네임은 2자 이상이어야 합니다.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = '올바른 이메일 형식이 아닙니다.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      const data = await signup({
        loginId: form.loginId,
        password: form.password,
        nickname: form.nickname,
        email: form.email,
      })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({
        loginId: data.loginId,
        nickname: data.nickname,
        role: data.role,
      }))
      navigate('/')
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">P</div>
          <h2 className="auth-title">회원가입</h2>
          <p className="auth-sub">포케체크 계정을 만들어보세요</p>
        </div>

        {serverError && <div className="auth-error">{serverError}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <div className="auth-field">
              <span className="auth-field-icon">👤</span>
              <input className="auth-input" name="loginId" type="text" placeholder="아이디 (4자 이상)" value={form.loginId} onChange={handleChange} required autoFocus />
            </div>
            {errors.loginId && <span className="field-error">{errors.loginId}</span>}
          </div>

          <div>
            <div className="auth-field">
              <span className="auth-field-icon">✏️</span>
              <input className="auth-input" name="nickname" type="text" placeholder="닉네임 (2자 이상)" value={form.nickname} onChange={handleChange} required />
            </div>
            {errors.nickname && <span className="field-error">{errors.nickname}</span>}
          </div>

          <div>
            <div className="auth-field">
              <span className="auth-field-icon">📧</span>
              <input className="auth-input" name="email" type="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div>
            <div className="auth-field">
              <span className="auth-field-icon">🔒</span>
              <input className="auth-input" name="password" type="password" placeholder="비밀번호 (6자 이상)" value={form.password} onChange={handleChange} required />
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div>
            <div className="auth-field">
              <span className="auth-field-icon">🔒</span>
              <input className="auth-input" name="passwordConfirm" type="password" placeholder="비밀번호 확인" value={form.passwordConfirm} onChange={handleChange} required />
            </div>
            {errors.passwordConfirm && <span className="field-error">{errors.passwordConfirm}</span>}
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="auth-footer">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="auth-link">로그인</Link>
        </div>
      </div>
    </div>
  )
}
