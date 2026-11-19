export interface LoginRequest {
  loginId: string
  password: string
}

export interface AuthResponse {
  token: string
  loginId: string
  nickname: string
  role: string
}

export interface SignupRequest {
  loginId: string
  password: string
  nickname: string
  email: string
}

export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const res = await fetch('/api/auth/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const text = await res.text()
  const body = text ? JSON.parse(text) : {}
  if (!res.ok) throw new Error(body.message || '회원가입에 실패했습니다.')
  return body
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const text = await res.text()
  const body = text ? JSON.parse(text) : {}
  if (!res.ok) throw new Error(body.message || '로그인에 실패했습니다.')
  return body
}
