import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getMyCollection, removeFromCollection, type CollectionItem } from '../api/collectionApi'
import { getCard, type Card } from '../api/cardApi'
import { getImageUrl } from '../api/pokeApi'
import { KOREAN_NAMES } from '../data/koreanNames'
import './CollectionPage.css'

export default function CollectionPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [items, setItems] = useState<CollectionItem[]>([])
  const [cardMap, setCardMap] = useState<Record<string, Card>>({})
  const [tab, setTab] = useState<'POKEMON' | 'CARD'>('POKEMON')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    getMyCollection().then(async data => {
      setItems(data)
      const cardItems = data.filter(i => i.itemType === 'CARD')
      const entries = await Promise.all(
        cardItems.map(async i => {
          const c = await getCard(i.itemId)
          return c ? [i.itemId, c] as [string, Card] : null
        })
      )
      setCardMap(Object.fromEntries(entries.filter(Boolean) as [string, Card][]))
      setLoading(false)
    })
  }, [])

  const pokeItems = items.filter(i => i.itemType === 'POKEMON')
  const cardItems = items.filter(i => i.itemType === 'CARD')
  const displayed = tab === 'POKEMON' ? pokeItems : cardItems

  const handleRemove = async (id: number) => {
    await removeFromCollection(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="col-page">
      <Header />
      <div className="col-wrap">
        <div className="col-page-header">
          <div className="col-page-icon">📚</div>
          <div>
            <h2>나만의 도감</h2>
            <p>나만의 포켓몬과 카드 컬렉션을 관리하세요.</p>
          </div>
        </div>

        <div className="col-tabs">
          <button className={`col-tab ${tab === 'POKEMON' ? 'active' : ''}`} onClick={() => setTab('POKEMON')}>
            포켓몬 도감 <span className="tab-count">{pokeItems.length}</span>
          </button>
          <button className={`col-tab ${tab === 'CARD' ? 'active' : ''}`} onClick={() => setTab('CARD')}>
            카드 컬렉션 <span className="tab-count">{cardItems.length}</span>
          </button>
        </div>

        {loading ? (
          <div className="col-loading">불러오는 중...</div>
        ) : displayed.length === 0 ? (
          <div className="col-empty">
            <div className="empty-icon">{tab === 'POKEMON' ? '🔍' : '🃏'}</div>
            <p>{tab === 'POKEMON' ? '아직 추가된 포켓몬이 없어요.' : '아직 추가된 카드가 없어요.'}</p>
            <button className="go-btn" onClick={() => navigate(tab === 'POKEMON' ? '/encyclopedia' : '/cards')}>
              {tab === 'POKEMON' ? '포켓몬 도감 보기' : '카드 목록 보기'}
            </button>
          </div>
        ) : (
          <div className={tab === 'POKEMON' ? 'poke-grid' : 'card-col-grid'}>
            {tab === 'POKEMON'
              ? pokeItems.map(item => {
                  const id = parseInt(item.itemId)
                  const nameKo = KOREAN_NAMES[id] ?? item.itemName
                  return (
                    <div key={item.id} className="col-poke-card" onClick={() => navigate(`/encyclopedia/${id}`)}>
                      <div className="col-poke-img">
                        <img src={getImageUrl(id)} alt={nameKo} loading="lazy" />
                      </div>
                      <div className="col-poke-info">
                        <span className="col-poke-num">No.{String(id).padStart(3,'0')}</span>
                        <span className="col-poke-name">{nameKo}</span>
                      </div>
                      <button className="remove-btn" onClick={e => { e.stopPropagation(); handleRemove(item.id) }}>✕</button>
                    </div>
                  )
                })
              : cardItems.map(item => {
                  const card = cardMap[item.itemId]
                  return (
                    <div key={item.id} className="col-tcg-card"
                      onClick={() => card && navigate(`/cards/${card.setId}/${card.id}`)}>
                      <div className="col-tcg-img">
                        {card
                          ? <img src={card.imageUrlSmall} alt={item.itemName} loading="lazy" />
                          : <span style={{ color:'#ccc', fontSize:12 }}>로딩 중</span>
                        }
                      </div>
                      <div className="col-tcg-info">
                        <span className="col-tcg-name">{item.itemName}</span>
                        {card && <span className="col-tcg-set">{card.setNameKo}</span>}
                      </div>
                      <button className="remove-btn" onClick={e => { e.stopPropagation(); handleRemove(item.id) }}>✕</button>
                    </div>
                  )
                })
            }
          </div>
        )}
      </div>
    </div>
  )
}
