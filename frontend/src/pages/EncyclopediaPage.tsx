import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { fetchGenRange, fetchByType, TYPE_KO, TYPE_COLOR, type PokemonListItem } from '../api/pokeApi'
import './EncyclopediaPage.css'

const PAGE_SIZE = 20

const GEN_RANGES = [
  { label:'전체',  min:1,   max:1025 },
  { label:'1세대', min:1,   max:151  },
  { label:'2세대', min:152, max:251  },
  { label:'3세대', min:252, max:386  },
  { label:'4세대', min:387, max:493  },
  { label:'5세대', min:494, max:649  },
  { label:'6세대', min:650, max:721  },
  { label:'7세대', min:722, max:809  },
  { label:'8세대', min:810, max:905  },
  { label:'9세대', min:906, max:1025 },
]

export default function EncyclopediaPage() {
  const navigate = useNavigate()
  const [genPokemon, setGenPokemon] = useState<PokemonListItem[]>([])
  const [displayed, setDisplayed] = useState<PokemonListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedGen, setSelectedGen] = useState(1) // 기본값: 1세대
  const [page, setPage] = useState(0)

  // 세대 변경 시 해당 범위 로드
  useEffect(() => {
    setLoading(true)
    setKeyword('')
    setSelectedType('all')
    setPage(0)
    const gen = GEN_RANGES[selectedGen]
    fetchGenRange(gen.min, gen.max)
      .then(list => { setGenPokemon(list); setLoading(false) })
      .catch(() => setLoading(false))
  }, [selectedGen])

  // 타입 필터 or 검색어 변경 시 필터 적용
  useEffect(() => {
    if (loading) return
    applyFilters()
  }, [genPokemon, selectedType, keyword])

  const applyFilters = async () => {
    let list = [...genPokemon]

    if (selectedType !== 'all') {
      try {
        const ids = await fetchByType(selectedType)
        const idSet = new Set(ids)
        list = list.filter(p => idSet.has(p.id))
      } catch {}
    }

    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase()
      list = list.filter(p =>
        p.koreanName.includes(kw) ||
        p.name.toLowerCase().includes(kw) ||
        String(p.id) === kw
      )
    }

    setDisplayed(list)
    setPage(0)
  }

  const pageItems = displayed.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(displayed.length / PAGE_SIZE)

  const goPage = (p: number) => {
    setPage(p)
    scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pageNums = Array.from({ length: totalPages }, (_, i) => i)
    .filter(i => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 2)
    .reduce<(number | '...')[]>((acc, i, idx, arr) => {
      if (idx > 0 && i - (arr[idx - 1] as number) > 1) acc.push('...')
      acc.push(i)
      return acc
    }, [])

  return (
    <div className="enc-page">
      <Header />
      <div className="enc-wrap">
        <div className="enc-header">
          <div className="enc-icon">📕</div>
          <div>
            <h2>포켓몬 도감</h2>
            <p>모든 포켓몬의 타입, 능력치, 진화 정보를 탐색해보세요.</p>
          </div>
        </div>

        <div className="enc-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="포켓몬 이름 또는 번호를 검색하세요"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          {keyword && <button className="search-clear" onClick={() => setKeyword('')}>✕</button>}
        </div>

        <div className="filter-section">
          <span className="filter-label">세대</span>
          <div className="filter-chips">
            {GEN_RANGES.map((g, i) => (
              <button key={i} className={`chip ${selectedGen === i ? 'active' : ''}`}
                onClick={() => setSelectedGen(i)}>{g.label}</button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <span className="filter-label">타입</span>
          <div className="filter-chips">
            <button className={`chip ${selectedType === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedType('all')}>전체</button>
            {Object.entries(TYPE_KO).map(([en, ko]) => (
              <button key={en}
                className={`chip ${selectedType === en ? 'active' : ''}`}
                style={selectedType === en ? { background: TYPE_COLOR[en], borderColor: TYPE_COLOR[en], color:'#fff' } : {}}
                onClick={() => setSelectedType(en)}>{ko}</button>
            ))}
          </div>
        </div>

        {!loading && (
          <p className="result-count">
            총 <strong>{displayed.length}</strong>마리
            {totalPages > 1 && <> · <strong>{page + 1}</strong>/{totalPages} 페이지</>}
          </p>
        )}

        {loading ? (
          <>
            <p className="enc-loading-label">
              {GEN_RANGES[selectedGen].label} 불러오는 중... ({GEN_RANGES[selectedGen].max - GEN_RANGES[selectedGen].min + 1}마리)
            </p>
            <div className="poke-grid">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="poke-card skeleton">
                  <div className="skeleton-img" />
                  <div className="skeleton-info">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line mid" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="poke-grid">
              {pageItems.map(p => (
                <div key={p.id} className="poke-card" onClick={() => navigate(`/encyclopedia/${p.id}`)}>
                  <div className="poke-img-wrap">
                    <img src={p.imageUrl} alt={p.koreanName} loading="lazy" decoding="async" />
                  </div>
                  <div className="poke-info">
                    <span className="poke-num">No.{String(p.id).padStart(3,'0')}</span>
                    <span className="poke-name">{p.koreanName}</span>
                    <div className="poke-types">
                      {p.types.map(t => (
                        <span key={t} className="type-badge" style={{ background: TYPE_COLOR[t] ?? '#aaa' }}>
                          {TYPE_KO[t] ?? t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => goPage(0)} disabled={page === 0}>«</button>
                <button className="page-btn" onClick={() => goPage(page - 1)} disabled={page === 0}>‹</button>
                {pageNums.map((p, i) =>
                  p === '...'
                    ? <span key={`dot-${i}`} className="page-dot">…</span>
                    : <button key={p} className={`page-btn ${page === p ? 'active' : ''}`}
                        onClick={() => goPage(p as number)}>{(p as number) + 1}</button>
                )}
                <button className="page-btn" onClick={() => goPage(page + 1)} disabled={page === totalPages - 1}>›</button>
                <button className="page-btn" onClick={() => goPage(totalPages - 1)} disabled={page === totalPages - 1}>»</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
