import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { getCards, fetchSets, RARITY_KO, TYPE_KO, TYPE_COLOR, type Card, type CardSet } from '../api/cardApi'
import './CardListPage.css'

const PAGE_SIZE = 20

export default function CardListPage() {
  const { setId = 'sv7' } = useParams<{ setId: string }>()
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState('all')
  const [selectedRarity, setSelectedRarity] = useState('all')
  const [allCards, setAllCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  const [setInfo, setSetInfo] = useState<CardSet | null>(null)

  useEffect(() => {
    fetchSets().then(sets => setSetInfo(sets.find(s => s.id === setId) ?? null))
  }, [setId])

  useEffect(() => {
    setLoading(true)
    setError('')
    setPage(1)
    getCards(setId)
      .then(data => { setAllCards(data); setLoading(false) })
      .catch(() => { setError('카드 데이터를 불러오지 못했습니다.'); setLoading(false) })
  }, [setId])

  // 필터 바뀌면 1페이지로 초기화
  useEffect(() => { setPage(1) }, [selectedType, selectedRarity])

  const filtered = allCards.filter(c => {
    if (selectedType !== 'all' && c.type !== selectedType) return false
    if (selectedRarity !== 'all' && c.rarity !== selectedRarity) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageCards = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const types = ['all', ...Array.from(new Set(allCards.map(c => c.type)))]
  const rarities = ['all', ...Array.from(new Set(allCards.map(c => c.rarity)))]

  return (
    <div className="cardlist-page">
      <Header />
      <div className="cardlist-wrap">
        <button className="back-btn" onClick={() => navigate('/cards')}>
          ← 컬렉션으로 돌아가기
        </button>

        <div className="set-header">
          <div className="set-icon">
            {setInfo?.logoUrl
              ? <img src={setInfo.logoUrl} alt={setInfo.nameEn} style={{ width:80, height:36, objectFit:'contain' }} />
              : '📦'}
          </div>
          <div>
            <h2>{setInfo?.nameKo ?? setId}</h2>
            {setInfo && setInfo.nameKo !== setInfo.nameEn && <span className="set-en">{setInfo.nameEn}</span>}
          </div>
        </div>

        {!loading && !error && (
          <div className="filter-row">
            <div className="filter-chips">
              {types.map(t => (
                <button key={t} className={`chip ${selectedType === t ? 'active' : ''}`}
                  style={selectedType === t && t !== 'all' ? { background: TYPE_COLOR[t], borderColor: TYPE_COLOR[t], color:'#fff' } : {}}
                  onClick={() => setSelectedType(t)}>
                  {t === 'all' ? '전체' : (TYPE_KO[t] ?? t)}
                </button>
              ))}
            </div>
            <div className="filter-chips" style={{ marginTop:8 }}>
              {rarities.map(r => (
                <button key={r} className={`chip ${selectedRarity === r ? 'active' : ''}`}
                  onClick={() => setSelectedRarity(r)}>
                  {r === 'all' ? '전체' : (RARITY_KO[r] ?? r)}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="card-grid">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="tcg-card skeleton">
                <div className="skeleton-img" />
                <div className="skeleton-info">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line mid" />
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <div className="error-msg">{error}</div>}

        {!loading && !error && (
          <>
            <p className="result-count">
              총 <strong>{filtered.length}</strong>개 · {page}/{totalPages} 페이지
            </p>
            <div className="card-grid">
              {pageCards.map(card => (
                <div key={card.id} className="tcg-card" onClick={() => navigate(`/cards/${setId}/${card.id}`)}>
                  <div className="tcg-img-wrap">
                    <span className="rarity-dot" style={{ background: card.rarityColor }} />
                    <img src={card.imageUrlSmall} alt={card.nameKo} loading="lazy" decoding="async" />
                  </div>
                  <div className="tcg-info">
                    <span className="tcg-num">No.{card.number}</span>
                    <span className="tcg-name-ko">{card.nameKo}</span>
                    <span className="tcg-name-en">{card.nameEn}</span>
                    <span className="tcg-price">
                      {card.priceAvg > 0 ? `₩${card.priceAvg.toLocaleString()}` : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => { setPage(1); scrollTo(0,0) }} disabled={page === 1}>«</button>
                <button className="page-btn" onClick={() => { setPage(p => p - 1); scrollTo(0,0) }} disabled={page === 1}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce<(number | '...')[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i-1] as number) > 1) acc.push('...')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === '...'
                      ? <span key={`dot-${i}`} className="page-dot">…</span>
                      : <button key={p} className={`page-btn ${page === p ? 'active' : ''}`}
                          onClick={() => { setPage(p as number); scrollTo(0,0) }}>{p}</button>
                  )
                }
                <button className="page-btn" onClick={() => { setPage(p => p + 1); scrollTo(0,0) }} disabled={page === totalPages}>›</button>
                <button className="page-btn" onClick={() => { setPage(totalPages); scrollTo(0,0) }} disabled={page === totalPages}>»</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
