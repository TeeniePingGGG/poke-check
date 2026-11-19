import { KOREAN_NAMES } from '../data/koreanNames'

const BASE = 'https://pokeapi.co/api/v2'

export const TYPE_KO: Record<string, string> = {
  normal:'노말', fire:'불꽃', water:'물', electric:'전기', grass:'풀',
  ice:'얼음', fighting:'격투', poison:'독', ground:'땅', flying:'비행',
  psychic:'에스퍼', bug:'벌레', rock:'바위', ghost:'고스트', dragon:'드래곤',
  dark:'악', steel:'강철', fairy:'페어리',
}

export const TYPE_COLOR: Record<string, string> = {
  normal:'#A8A878', fire:'#F08030', water:'#6890F0', electric:'#F8D030',
  grass:'#78C850', ice:'#98D8D8', fighting:'#C03028', poison:'#A040A0',
  ground:'#E0C068', flying:'#A890F0', psychic:'#F85888', bug:'#A8B820',
  rock:'#B8A038', ghost:'#705898', dragon:'#7038F8', dark:'#705848',
  steel:'#B8B8D0', fairy:'#EE99AC',
}

export const STAT_KO: Record<string, string> = {
  hp:'HP', attack:'공격', defense:'방어',
  'special-attack':'특공', 'special-defense':'특방', speed:'스피드',
}

export function getImageUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export interface PokemonListItem {
  id: number
  name: string
  koreanName: string
  types: string[]
  imageUrl: string
}

export interface PokemonDetail extends PokemonListItem {
  height: number
  weight: number
  abilities: string[]
  category: string
  description: string
  stats: { name: string; value: number }[]
  evolutionChain: { id: number; koreanName: string; imageUrl: string }[]
}

// 캐시
const cache = new Map<number, any>()
const speciesCache = new Map<number, string>() // id → 한국어 이름

async function fetchPoke(id: number) {
  if (cache.has(id)) return cache.get(id)
  const data = await fetch(`${BASE}/pokemon/${id}`).then(r => r.json())
  cache.set(id, data)
  return data
}

async function fetchKoreanName(id: number): Promise<string | null> {
  if (speciesCache.has(id)) return speciesCache.get(id)!
  if (KOREAN_NAMES[id]) {
    speciesCache.set(id, KOREAN_NAMES[id])
    return KOREAN_NAMES[id]
  }
  try {
    const data = await fetch(`${BASE}/pokemon-species/${id}`).then(r => r.json())
    const koName = data.names?.find((n: any) => n.language.name === 'ko')?.name ?? null
    if (koName) speciesCache.set(id, koName)
    return koName
  } catch {
    return null
  }
}

export async function fetchPokemonPage(offset: number, limit: number): Promise<PokemonListItem[]> {
  const ids = Array.from({ length: limit }, (_, i) => offset + i + 1)
  const results = await Promise.all(
    ids.map(id =>
      Promise.all([
        fetchPoke(id).catch(() => null),
        fetchKoreanName(id).catch(() => null),
      ])
    )
  )
  return results
    .filter(([p]) => p !== null)
    .map(([p, koName]: any) => ({
      id: p.id,
      name: p.name,
      koreanName: koName ?? p.name,
      types: p.types.map((t: any) => t.type.name),
      imageUrl: getImageUrl(p.id),
    }))
}

// 세대별 캐시
const genCache = new Map<string, PokemonListItem[]>()

export async function fetchGenRange(min: number, max: number): Promise<PokemonListItem[]> {
  const key = `${min}-${max}`
  if (genCache.has(key)) return genCache.get(key)!

  // 50개씩 청크로 나눠 병렬 요청 (rate limit 방지)
  const CHUNK = 50
  const chunks: Promise<PokemonListItem[]>[] = []
  for (let start = min; start <= max; start += CHUNK) {
    const end = Math.min(start + CHUNK - 1, max)
    chunks.push(fetchPokemonPage(start - 1, end - start + 1))
  }
  const results = (await Promise.all(chunks)).flat()
  genCache.set(key, results)
  return results
}

export async function fetchByType(typeName: string): Promise<number[]> {
  const data = await fetch(`${BASE}/type/${typeName}`).then(r => r.json())
  return data.pokemon
    .map((p: any) => {
      const parts = p.pokemon.url.split('/')
      return parseInt(parts[parts.length - 2])
    })
    .filter((id: number) => id <= 1025)
}

const detailSpeciesCache = new Map<number, any>()

export async function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  let speciesData = detailSpeciesCache.get(id)
  if (!speciesData) {
    speciesData = await fetch(`${BASE}/pokemon-species/${id}`).then(r => r.json())
    detailSpeciesCache.set(id, speciesData)
  }
  const [poke, species] = await Promise.all([fetchPoke(id), Promise.resolve(speciesData)])

  const koreanName =
    species.names?.find((n: any) => n.language.name === 'ko')?.name ??
    KOREAN_NAMES[id] ?? poke.name

  const description =
    species.flavor_text_entries
      ?.find((f: any) => f.language.name === 'ko')
      ?.flavor_text?.replace(/[\f\n]/g, ' ') ?? ''

  const category =
    species.genera?.find((g: any) => g.language.name === 'ko')?.genus ?? ''

  const stats = poke.stats.map((s: any) => ({
    name: STAT_KO[s.stat.name] ?? s.stat.name,
    value: s.base_stat,
  }))

  const abilities = poke.abilities.map((a: any) => a.ability.name)

  // Evolution chain
  let evolutionChain: { id: number; koreanName: string; imageUrl: string }[] = []
  try {
    const evoData = await fetch(species.evolution_chain.url).then(r => r.json())
    const nodes: number[] = []
    const traverse = (node: any) => {
      const parts = node.species.url.split('/')
      nodes.push(parseInt(parts[parts.length - 2]))
      node.evolves_to.forEach((e: any) => traverse(e))
    }
    traverse(evoData.chain)
    evolutionChain = nodes.map(nid => ({
      id: nid,
      koreanName: KOREAN_NAMES[nid] ?? `포켓몬 ${nid}`,
      imageUrl: getImageUrl(nid),
    }))
  } catch {}

  return {
    id: poke.id,
    name: poke.name,
    koreanName,
    types: poke.types.map((t: any) => t.type.name),
    imageUrl: getImageUrl(poke.id),
    height: poke.height,
    weight: poke.weight,
    abilities,
    category,
    description,
    stats,
    evolutionChain,
  }
}
