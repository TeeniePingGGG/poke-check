import { TYPE_KO, TYPE_COLOR } from './pokeApi'
import { KOREAN_NAMES } from '../data/koreanNames'
import { fetchMoveNameKo } from '../data/moveNames'

const POKE_BASE = 'https://pokeapi.co/api/v2'
const koNameCache = new Map<number, string>()

async function fetchKoName(dexNum: number): Promise<string | null> {
  if (koNameCache.has(dexNum)) return koNameCache.get(dexNum)!
  if (KOREAN_NAMES[dexNum]) { koNameCache.set(dexNum, KOREAN_NAMES[dexNum]); return KOREAN_NAMES[dexNum] }
  try {
    const data = await fetch(`${POKE_BASE}/pokemon-species/${dexNum}`).then(r => r.json())
    const name = data.names?.find((n: any) => n.language.name === 'ko')?.name ?? null
    if (name) koNameCache.set(dexNum, name)
    return name
  } catch { return null }
}

// "Charizard ex" → "ex", "Pikachu VMAX" → "VMAX", "Pikachu" → ""
function extractSuffix(enName: string): string {
  const m = enName.match(/\s+(ex|EX|GX|V|VMAX|VSTAR|VUNION|LV\.X|BREAK|Prime|Legend)$/)
  return m ? m[1] : ''
}

async function buildKoNames(rawCards: any[]): Promise<Record<number, string>> {
  const dexNums = [...new Set<number>(
    rawCards.flatMap((c: any) => c.nationalPokedexNumbers ?? [])
  )]
  const entries = await Promise.all(
    dexNums.map(async num => {
      const name = await fetchKoName(num).catch(() => null)
      return name ? [num, name] as [number, string] : null
    })
  )
  return Object.fromEntries(entries.filter(Boolean) as [number, string][])
}

async function translateMoves(cards: Card[]): Promise<Card[]> {
  const allMoveNames = [...new Set(cards.flatMap(c => c.moves.map(m => m.name)))]
  const translated: Record<string, string> = {}
  await Promise.all(
    allMoveNames.map(async name => {
      translated[name] = await fetchMoveNameKo(name).catch(() => name)
    })
  )
  return cards.map(card => ({
    ...card,
    moves: card.moves.map(m => ({ ...m, name: translated[m.name] ?? m.name })),
  }))
}

export interface CardSet {
  id: string
  nameKo: string
  nameEn: string
  series: string
  total: number
  releaseDate: string
  logoUrl: string
  symbolUrl: string
}

export interface Card {
  id: string
  number: string
  nameKo: string
  nameEn: string
  setId: string
  setNameKo: string
  type: string
  rarity: string
  rarityColor: string
  hp: number
  imageUrl: string
  imageUrlSmall: string
  moves: { name: string; damage: string; energyTypes: string[] }[]
  weakness: string
  resistance: string
  retreatCost: number
  illustrator: string
  priceMin: number
  priceAvg: number
  priceMax: number
}

// Pokémon TCG API 키는 frontend/.env.local 의 VITE_TCG_API_KEY 에서 불러옵니다 (Git에 올라가지 않음)
const TCG_API_KEY = import.meta.env.VITE_TCG_API_KEY ?? ''
const TCG_BASE = 'https://api.pokemontcg.io/v2'

function tcgHeaders(): HeadersInit {
  return TCG_API_KEY ? { 'X-Api-Key': TCG_API_KEY } : {}
}

// 한국어 세트명 매핑 (알려진 세트만)
const KO_SET_NAMES: Record<string, string> = {
  'sv1':   '진홍의 섬광',        'sv2':   '팔데아의 진화',
  'sv3':   '흑염의 지배자',      'sv3pt5':'151',
  'sv4':   '패러독스 리프트',    'sv4pt5':'쌍벽의 투사',
  'sv5':   '시간의 연옥',        'sv6':   '마스크의 황혼',
  'sv6pt5':'증기의 시련',        'sv7':   '스텔라 미라클',
  'sv7pt5':'빛나는 보물',        'sv8':   '하늘빛 디스크',
  'sv8pt5':'레인지 스톰프',      'sv9':   '여행의 시작',
  'swsh1': '소드·실드',          'swsh2': '반란의 크래쉬',
  'swsh3': '어메이징 볼트',      'swsh4': '배틀 스타일',
  'swsh5': '차이징 퍼펙션',      'swsh6': '에볼루션 스카이',
  'swsh7': '후시기바나 오브 더 정글', 'swsh8':'퓨전 아츠',
  'swsh9': '스타 버스',          'swsh10':'시공의 어울림',
  'swsh11':'로스트 어비스',       'swsh12':'파라다이스 드래곤',
  'swsh12pt5':'크라운 제닛',
  'sm1':   '태양·달',            'sm2':   '가디언 라이징',
  'sm3':   '불타는 섀도',        'sm4':   '크림슨 인베이전',
  'sm5':   '울트라 프리즘',      'sm6':   '포비든 라이트',
  'sm7':   '셀레스티얼 스톰',    'sm8':   '드래곤 마제스티',
  'sm9':   '팀 업',              'sm10':  '언브로큰 본드',
  'sm11':  '유니피드 마인즈',    'sm12':  '코즈믹 이클립스',
  'base1': '베이스 세트',        'base2': '정글',
  'base3': '화석',               'base4': '베이스 세트 2',
  'gym1':  '제이관장의 도전',    'gym2':  '로켓단의 반격',
  'neo1':  '네오 제네시스',      'neo2':  '네오 디스커버리',
  'neo3':  '네오 레버레이션',    'neo4':  '네오 데스티니',
}

// 세트 목록 캐시
let setsCache: CardSet[] | null = null

export async function fetchSets(): Promise<CardSet[]> {
  if (setsCache) return setsCache

  const res = await fetch(
    `${TCG_BASE}/sets?orderBy=-releaseDate&pageSize=250`,
    { headers: tcgHeaders() }
  )
  if (!res.ok) throw new Error('세트 목록을 불러오지 못했습니다.')
  const json = await res.json()

  setsCache = (json.data ?? []).map((s: any) => ({
    id: s.id,
    nameKo: KO_SET_NAMES[s.id] ?? s.name,
    nameEn: s.name,
    series: s.series ?? '',
    total: s.total ?? s.printedTotal ?? 0,
    releaseDate: (s.releaseDate ?? '').replace(/\//g, '.'),
    logoUrl: s.images?.logo ?? '',
    symbolUrl: s.images?.symbol ?? '',
  }))

  return setsCache!
}

// 하위 호환용 — getCards 내부에서 세트명 조회에 사용
export const CARD_SETS_KO = KO_SET_NAMES

const RARITY_MAP: Record<string, { rarity: string; rarityColor: string }> = {
  'Common':       { rarity:'common',   rarityColor:'#9e9e9e' },
  'Uncommon':     { rarity:'uncommon', rarityColor:'#43a047' },
  'Rare':         { rarity:'rare',     rarityColor:'#1e88e5' },
  'Rare Holo':    { rarity:'rare',     rarityColor:'#1e88e5' },
  'Double Rare':  { rarity:'rare',     rarityColor:'#1e88e5' },
  'Ultra Rare':   { rarity:'ultra',    rarityColor:'#ffd600' },
  'Illustration Rare':       { rarity:'ultra', rarityColor:'#ffd600' },
  'Special Illustration Rare':{ rarity:'secret', rarityColor:'#e91e63' },
  'Hyper Rare':   { rarity:'secret',   rarityColor:'#e91e63' },
  'Secret Rare':  { rarity:'secret',   rarityColor:'#e91e63' },
}

const TYPE_MAP: Record<string, string> = {
  Grass:'grass', Fire:'fire', Water:'water', Lightning:'electric',
  Psychic:'psychic', Fighting:'fighting', Darkness:'dark', Metal:'steel',
  Dragon:'dragon', Fairy:'fairy', Colorless:'normal',
}

function toKrPrice(usd: number) {
  return Math.round(usd * 1380)
}

function parseCard(raw: any, koNames: Record<number, string> = {}): Card {
  const rarityInfo = RARITY_MAP[raw.rarity ?? ''] ?? { rarity:'common', rarityColor:'#9e9e9e' }
  const mainType = raw.types?.[0] ?? 'Colorless'
  const pokeType = TYPE_MAP[mainType] ?? 'normal'

  const market = raw.tcgplayer?.prices
  let priceMin = 0, priceAvg = 0, priceMax = 0
  if (market) {
    const tier = market.holofoil ?? market.normal ?? market['1stEditionNormal'] ?? Object.values(market)[0] as any
    if (tier) {
      priceMin = toKrPrice(tier.low ?? 0)
      priceAvg = toKrPrice(tier.mid ?? 0)
      priceMax = toKrPrice(tier.high ?? 0)
    }
  }

  const moves = (raw.attacks ?? []).map((a: any) => ({
    name: a.name,
    damage: a.damage ?? '',
    energyTypes: (a.cost ?? []).map((c: string) => TYPE_MAP[c] ?? 'normal'),
  }))

  const weakness = raw.weaknesses?.[0]?.type ? (TYPE_MAP[raw.weaknesses[0].type] ?? '') : ''
  const resistance = raw.resistances?.[0]?.type ? (TYPE_MAP[raw.resistances[0].type] ?? '') : ''
  const retreatCost = raw.retreatCost?.length ?? 0

  const setId = raw.set?.id ?? ''

  const dexNum = raw.nationalPokedexNumbers?.[0] ?? null
  const koBase = dexNum ? (koNames[dexNum] ?? null) : null
  const suffix = extractSuffix(raw.name)
  const nameKo = koBase ? (suffix ? `${koBase} ${suffix}` : koBase) : raw.name

  return {
    id: raw.id,
    number: raw.number ?? '',
    nameKo,
    nameEn: raw.name,
    setId,
    setNameKo: KO_SET_NAMES[setId] ?? raw.set?.name ?? '',
    type: pokeType,
    ...rarityInfo,
    hp: parseInt(raw.hp ?? '0') || 0,
    imageUrl: raw.images?.large ?? raw.images?.small ?? '',
    imageUrlSmall: raw.images?.small ?? raw.images?.large ?? '',
    moves,
    weakness,
    resistance,
    retreatCost,
    illustrator: raw.artist ?? '',
    priceMin,
    priceAvg,
    priceMax,
  }
}

// 세트별 카드 캐시
const setCache = new Map<string, Card[]>()

export async function getCards(setId: string, type?: string, rarity?: string): Promise<Card[]> {
  if (!setCache.has(setId)) {
    const res = await fetch(
      `${TCG_BASE}/cards?q=set.id:${setId}&pageSize=250&orderBy=number`,
      { headers: tcgHeaders() }
    )
    if (!res.ok) throw new Error('카드 데이터를 불러오지 못했습니다.')
    const json = await res.json()
    const rawCards = json.data ?? []
    const koNames = await buildKoNames(rawCards)
    const parsed = rawCards.map((c: any) => parseCard(c, koNames))
    setCache.set(setId, await translateMoves(parsed))
  }

  let cards = setCache.get(setId)!
  if (type && type !== 'all') cards = cards.filter(c => c.type === type)
  if (rarity && rarity !== 'all') cards = cards.filter(c => c.rarity === rarity)
  return cards
}

// 단일 카드 캐시
const cardCache = new Map<string, Card>()

export async function getCard(cardId: string): Promise<Card | null> {
  if (cardCache.has(cardId)) return cardCache.get(cardId)!
  try {
    const res = await fetch(`${TCG_BASE}/cards/${cardId}`, { headers: tcgHeaders() })
    if (!res.ok) return null
    const json = await res.json()
    const rawCard = json.data
    const koNames = await buildKoNames([rawCard])
    const parsed = parseCard(rawCard, koNames)
    const [card] = await translateMoves([parsed])
    cardCache.set(cardId, card)
    return card
  } catch {
    return null
  }
}

export const RARITY_KO: Record<string, string> = {
  common:'커먼', uncommon:'언커먼', rare:'레어',
  ultra:'울트라 레어', secret:'시크릿 레어',
}

export { TYPE_KO, TYPE_COLOR }
