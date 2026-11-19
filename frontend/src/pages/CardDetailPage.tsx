import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { getCard, TYPE_KO, TYPE_COLOR, type Card } from '../api/cardApi'
import { addToCollection, removeFromCollection, checkInCollection, type CollectionItem } from '../api/collectionApi'
import './CardDetailPage.css'

export default function CardDetailPage() {
  const { setId, cardId } = useParams<{ setId: string; cardId: string }>()
  const navigate = useNavigate()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [colItem, setColItem] = useState<CollectionItem | null>(null)
  const [colLoading, setColLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (!cardId) return
    setLoading(true)
    getCard(cardId).then(async c => {
      if (!c) { navigate('/cards'); return }
      setCard(c)
      setLoading(false)
      if (user) {
        const item = await checkInCollection(c.id)
        setColItem(item)
      }
    })
  }, [cardId])

  const handleCollection = async () => {
    if (!card) return
    if (!user) { navigate('/login'); return }
    setColLoading(true)
    try {
      if (colItem) {
        await removeFromCollection(colItem.id)
        setColItem(null)
      } else {
        const item = await addToCollection({ itemType:'CARD', itemId:card.id, itemName:card.nameKo })
        setColItem(item)
      }
    } finally { setColLoading(false) }
  }

  if (loading) return (
    <div className="card-detail-page">
      <Header />
      <div className="card-detail-wrap"><p style={{ color:'#9ca3af', marginTop:60, textAlign:'center' }}>카드 불러오는 중...</p></div>
    </div>
  )
  if (!card) return null

  return (
    <div className="card-detail-page">
      <Header />
      <div className="card-detail-wrap">
        <button className="back-btn" onClick={() => navigate(`/cards/${setId}`)}>
          ← 목록으로 돌아가기
        </button>

        <div className="card-detail-layout">
          {/* 왼쪽 */}
          <div className="card-left-panel">
            <div className="card-img-box">
              <img src={card.imageUrl} alt={card.nameKo} />
            </div>
            <div className="card-left-meta">
              <span className="card-meta-label">No.{card.number} • {card.setNameKo} 세트</span>
              <h2 className="card-ko-name">{card.nameKo}</h2>
              <span className="card-en-name">{card.nameEn}</span>
              <div className="card-types">
                <span className="type-energy" style={{ background: TYPE_COLOR[card.type] ?? '#aaa' }}>
                  {TYPE_KO[card.type] ?? card.type}
                </span>
              </div>
            </div>
            <button
              className={`col-btn ${colItem ? 'added' : ''} ${!user ? 'disabled-btn' : ''}`}
              onClick={handleCollection}
              disabled={colLoading}
            >
              {!user ? '🔒 로그인이 필요합니다' : colItem ? '✓ 컬렉션에서 제거' : '+ 컬렉션에 추가'}
            </button>
          </div>

          {/* 오른쪽 */}
          <div className="card-right-panel">
            <div className="card-info-section">
              <h3>카드 정보</h3>
              <div className="card-hp-row">
                <span className="hp-label">HP</span>
                <span className="hp-val">{card.hp}</span>
              </div>

              {card.moves.map((move, i) => (
                <div key={i} className="move-row">
                  <div className="move-header">
                    <div className="move-energies">
                      {move.energyTypes.map((e, j) => (
                        <span key={j} className="energy-dot" style={{ background: TYPE_COLOR[e] ?? '#aaa' }} />
                      ))}
                    </div>
                    <span className="move-name">{move.name}</span>
                    {move.damage && <span className="move-damage">{move.damage}</span>}
                  </div>
                </div>
              ))}

              <div className="card-attr-grid">
                <div className="card-attr">
                  <span className="attr-label">약점</span>
                  <span className="attr-val">
                    {card.weakness
                      ? <span className="type-tag" style={{ background: TYPE_COLOR[card.weakness] }}>
                          {TYPE_KO[card.weakness] ?? card.weakness} ×2
                        </span>
                      : '—'}
                  </span>
                </div>
                <div className="card-attr">
                  <span className="attr-label">저항력</span>
                  <span className="attr-val">
                    {card.resistance
                      ? <span className="type-tag" style={{ background: TYPE_COLOR[card.resistance] }}>
                          {TYPE_KO[card.resistance] ?? card.resistance} -30
                        </span>
                      : '—'}
                  </span>
                </div>
                <div className="card-attr">
                  <span className="attr-label">후퇴비용</span>
                  <span className="attr-val retreat-cost">
                    {card.retreatCost === 0 ? '—' : Array.from({ length: card.retreatCost }).map((_, i) => (
                      <span key={i} className="energy-dot small" style={{ background:'#aaa' }} />
                    ))}
                  </span>
                </div>
                <div className="card-attr">
                  <span className="attr-label">일러스트</span>
                  <span className="attr-val">{card.illustrator || '—'}</span>
                </div>
              </div>
            </div>

            <div className="price-section">
              <h3>시장 가격 (TCGPlayer 기준)</h3>
              {card.priceAvg > 0 ? (
                <div className="price-grid">
                  <div className="price-item">
                    <span className="price-label">최저</span>
                    <span className="price-val">₩{card.priceMin.toLocaleString()}</span>
                  </div>
                  <div className="price-item">
                    <span className="price-label">평균</span>
                    <span className="price-val avg">₩{card.priceAvg.toLocaleString()}</span>
                  </div>
                  <div className="price-item">
                    <span className="price-label">최고가</span>
                    <span className="price-val">₩{card.priceMax.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <p style={{ color:'#9ca3af', fontSize:14 }}>가격 정보가 없습니다.</p>
              )}
              <div className={`price-notice ${user ? 'info' : 'warn'}`}>
                {user
                  ? '💡 TCGPlayer 기준 USD 시세를 원화(×1380)로 환산한 참고 가격입니다.'
                  : '🔒 로그인 후 컬렉션에 추가할 수 있습니다.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
