import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { fetchPokemonDetail, TYPE_KO, TYPE_COLOR, type PokemonDetail } from '../api/pokeApi'
import { addToCollection, removeFromCollection, checkInCollection, type CollectionItem } from '../api/collectionApi'
import './PokemonDetailPage.css'

const STAT_COLORS: Record<string, string> = {
  HP:'#e53935', 공격:'#FB8C00', 방어:'#FDD835', 특공:'#1E88E5', 특방:'#43A047', 스피드:'#00ACC1',
}

const TYPE_BG: Record<string, string> = {
  fire:'#fff3e0', water:'#e3f2fd', electric:'#fffde7', grass:'#e8f5e9',
  psychic:'#fce4ec', normal:'#f5f5f5', fighting:'#fbe9e7', poison:'#f3e5f5',
  ghost:'#ede7f6', dragon:'#e8eaf6', ice:'#e0f7fa', dark:'#efebe9',
  steel:'#eceff1', fairy:'#fce4ec', bug:'#f9fbe7', rock:'#efebe9',
  ground:'#fff8e1', flying:'#e8eaf6',
}

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [colItem, setColItem] = useState<CollectionItem | null>(null)
  const [colLoading, setColLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    const pid = Number(id)
    setLoading(true)
    fetchPokemonDetail(pid)
      .then(p => { setPokemon(p); setLoading(false) })
      .catch(() => { navigate('/encyclopedia'); setLoading(false) })

    if (user) checkInCollection(String(pid)).then(setColItem)
  }, [id])

  const handleCollection = async () => {
    if (!pokemon) return
    if (!user) { navigate('/login'); return }
    setColLoading(true)
    try {
      if (colItem) {
        await removeFromCollection(colItem.id)
        setColItem(null)
      } else {
        const item = await addToCollection({
          itemType: 'POKEMON',
          itemId: String(pokemon.id),
          itemName: pokemon.koreanName,
        })
        setColItem(item)
      }
    } finally { setColLoading(false) }
  }

  if (loading) return <div className="detail-poke-page"><Header /><div className="poke-loading">불러오는 중...</div></div>
  if (!pokemon) return null

  const mainType = pokemon.types[0]
  const bgColor = TYPE_BG[mainType] ?? '#f8fafc'
  const totalStat = pokemon.stats.reduce((s, v) => s + v.value, 0)

  return (
    <div className="detail-poke-page">
      <Header />
      <div className="detail-poke-wrap">
        <button className="back-btn" onClick={() => navigate('/encyclopedia')}>
          ← 도감으로 돌아가기
        </button>

        <div className="detail-poke-layout">
          {/* 왼쪽 */}
          <div className="poke-left-panel" style={{ background: bgColor }}>
            <div className="poke-number-big">#{String(pokemon.id).padStart(3,'0')}</div>
            <img className="poke-big-img" src={pokemon.imageUrl} alt={pokemon.koreanName} />
            <div className="poke-left-info">
              <span className="poke-num-label">No.{String(pokemon.id).padStart(3,'0')}</span>
              <h2 className="poke-korean-name">{pokemon.koreanName}</h2>
              <span className="poke-en-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
              <div className="poke-type-badges">
                {pokemon.types.map(t => (
                  <span key={t} className="type-badge-lg" style={{ background: TYPE_COLOR[t] }}>
                    {TYPE_KO[t] ?? t}
                  </span>
                ))}
              </div>
            </div>
            {pokemon.description && (
              <p className="poke-desc">{pokemon.description}</p>
            )}
            <button
              className={`col-btn ${colItem ? 'added' : ''} ${!user ? 'disabled' : ''}`}
              onClick={handleCollection}
              disabled={colLoading}
            >
              {!user ? '🔒 로그인이 필요합니다' : colItem ? '✓ 도감에서 제거' : '+ 나의 도감에 추가'}
            </button>
          </div>

          {/* 오른쪽 */}
          <div className="poke-right-panel">
            {/* 기본 정보 */}
            <section className="info-section">
              <h3>기본 정보</h3>
              <div className="info-grid">
                <div className="info-item"><span className="info-label">신장</span><span className="info-val">{(pokemon.height / 10).toFixed(1)}m</span></div>
                <div className="info-item"><span className="info-label">체중</span><span className="info-val">{(pokemon.weight / 10).toFixed(1)}kg</span></div>
                {pokemon.category && <div className="info-item"><span className="info-label">분류</span><span className="info-val">{pokemon.category}</span></div>}
                <div className="info-item">
                  <span className="info-label">특성</span>
                  <span className="info-val ability-list">
                    {pokemon.abilities.map((a, i) => <span key={i} className="ability-chip">{a}</span>)}
                  </span>
                </div>
              </div>
            </section>

            {/* 종족값 */}
            <section className="info-section">
              <h3>종족값</h3>
              <div className="stat-list">
                {pokemon.stats.map(s => (
                  <div key={s.name} className="stat-row">
                    <span className="stat-name">{s.name}</span>
                    <span className="stat-val">{s.value}</span>
                    <div className="stat-bar-bg">
                      <div
                        className="stat-bar"
                        style={{ width:`${Math.min((s.value/255)*100,100)}%`, background: STAT_COLORS[s.name] ?? '#e53935' }}
                      />
                    </div>
                  </div>
                ))}
                <div className="stat-total">
                  <span>합계</span>
                  <span className="total-val">{totalStat}</span>
                </div>
              </div>
            </section>

            {/* 진화 */}
            {pokemon.evolutionChain.length > 1 && (
              <section className="info-section">
                <h3>진화</h3>
                <div className="evo-chain">
                  {pokemon.evolutionChain.map((e, i) => (
                    <div key={e.id} className="evo-item-wrap">
                      {i > 0 && <span className="evo-arrow">›</span>}
                      <div
                        className={`evo-item ${e.id === pokemon.id ? 'current' : ''}`}
                        onClick={() => navigate(`/encyclopedia/${e.id}`)}
                      >
                        <img src={e.imageUrl} alt={e.koreanName} />
                        <span className="evo-num">No.{String(e.id).padStart(3,'0')}</span>
                        <span className="evo-name">{e.koreanName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
