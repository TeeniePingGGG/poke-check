import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Header.css'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Encyclopedia', to: '/encyclopedia' },
  { label: 'Cards', to: '/cards' },
  { label: 'Community', to: '/community' },
  { label: 'My Deck', to: '/collection' },
]

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">Poke-Check</Link>

        <nav className="header-nav">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-user">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar">{user.nickname[0].toUpperCase()}</div>
              <div className="user-dropdown">
                <span className="user-name">{user.nickname}</span>
                <button onClick={handleLogout} className="logout-btn">로그아웃</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-link">로그인</Link>
          )}
        </div>
      </div>
    </header>
  )
}
