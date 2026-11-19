import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import heroImg from '../assets/hero.png'
import './MainPage.css'

const FEATURES = [
  {
    icon: '📖',
    color: '#e53935',
    title: '포켓몬 도감',
    desc: '모든 포켓몬의 타입, 능력치, 진화 정보를 상세히 탐색해보세요.',
    to: '/encyclopedia',
  },
  {
    icon: '🃏',
    color: '#5c6bc0',
    title: '카드 도감',
    desc: '최신 TCG 세트 정보와 시장 실시간 가격을 한눈에 확인하세요.',
    to: '/cards',
  },
  {
    icon: '💬',
    color: '#43a047',
    title: '커뮤니티',
    desc: '트레이너들과 소통하고 나만의 컬렉션과 팁을 공유해보세요.',
    to: '/community',
  },
]

export default function MainPage() {
  const navigate = useNavigate()

  return (
    <div className="main-page">
      <Header />

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>
              포켓몬의 모든 것,<br />
              <span className="highlight">포켓체크</span>에서<br />
              확인하세요!
            </h1>
            <p>
              최신 포켓몬 정보부터 TCG 카드 가격, 커뮤니티 소식까지 한 곳에서 편리하게
              확인하세요. 나만의 도감을 만들고 다른 트레이너들과 공유해보세요.
            </p>
            <button className="hero-btn" onClick={() => navigate('/encyclopedia')}>
              시작하기
            </button>
          </div>
          <div className="hero-image">
            <img src={heroImg} alt="포켓몬 일러스트" />
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="features-section">
        <div className="features-inner">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="feature-card"
              onClick={() => navigate(f.to)}
            >
              <div className="feature-icon" style={{ background: f.color }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-inner">
          <span className="footer-logo">Poke-Check</span>
          <p>
            포켓몬 트레이너들을 위한 최고의 정보 공유 플랫폼입니다.<br />
            전 세계 카드, 시세와 포켓몬 도감을 탐색하세요.
          </p>
        </div>
      </footer>
    </div>
  )
}
