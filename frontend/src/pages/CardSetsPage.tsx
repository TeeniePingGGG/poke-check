import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { fetchSets, type CardSet } from '../api/cardApi'
import './CardSetsPage.css'

const SERIES_ORDER = [
  'Scarlet & Violet', 'Sword & Shield', 'Sun & Moon',
  'XY', 'Black & White', 'HeartGold & SoulSilver',
  'Platinum', 'Diamond & Pearl', 'EX', 'e-Card',
  'Neo', 'Gym', 'Base',
]

export default function CardSetsPage() {
  const navigate = useNavigate()
  const [sets, setSets] = useState<CardSet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openSeries, setOpenSeries] = useState<string>('Scarlet & Violet')

  useEffect(() => {
    fetchSets()
      .then(data => { setSets(data); setLoading(false) })
      .catch(() => { setError('세트 목록을 불러오지 못했습니다.'); setLoading(false) })
  }, [])

  // 시리즈별 그룹핑
  const grouped: Record<string, CardSet[]> = {}
  for (const s of sets) {
    const key = s.series || '기타'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(s)
  }

  const seriesList = [
    ...SERIES_ORDER.filter(s => grouped[s]),
    ...Object.keys(grouped).filter(s => !SERIES_ORDER.includes(s)),
  ]

  return (
    <div className="sets-page">
      <Header />
      <div className="sets-wrap">
        <div className="sets-header">
          <div className="sets-icon">🃏</div>
          <div>
            <h2>카드 도감</h2>
            <p>모든 TCG 세트 카드 정보와 시장 가격을 확인하세요.</p>
          </div>
        </div>

        {loading && (
          <div className="sets-skeleton-list">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="set-skeleton" />
            ))}
          </div>
        )}
        {error && <p className="sets-error">{error}</p>}

        {!loading && !error && seriesList.map(series => (
          <div key={series} className="series-group">
            <button
              className={`series-title ${openSeries === series ? 'open' : ''}`}
              onClick={() => setOpenSeries(openSeries === series ? '' : series)}
            >
              <span>{series}</span>
              <span className="series-count">{grouped[series].length}개 세트</span>
              <span className="series-arrow">{openSeries === series ? '▲' : '▼'}</span>
            </button>

            {openSeries === series && (
              <div className="sets-grid">
                {grouped[series].map(s => (
                  <div key={s.id} className="set-card" onClick={() => navigate(`/cards/${s.id}`)}>
                    <div className="set-logo-wrap">
                      {s.logoUrl
                        ? <img src={s.logoUrl} alt={s.nameEn} className="set-logo" loading="lazy" />
                        : <span className="set-logo-placeholder">📦</span>
                      }
                    </div>
                    <div className="set-card-info">
                      <h3>{s.nameKo}</h3>
                      {s.nameKo !== s.nameEn && <span className="set-card-en">{s.nameEn}</span>}
                      <div className="set-card-meta">
                        <span>총 {s.total}장</span>
                        <span>{s.releaseDate}</span>
                      </div>
                    </div>
                    {s.symbolUrl && (
                      <img src={s.symbolUrl} alt="" className="set-symbol" loading="lazy" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
