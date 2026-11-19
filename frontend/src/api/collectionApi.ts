export interface CollectionItem {
  id: number
  itemType: 'POKEMON' | 'CARD'
  itemId: string
  itemName: string
  addedAt: string
}

function authHeader(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getMyCollection(): Promise<CollectionItem[]> {
  const res = await fetch('/api/collection', { headers: authHeader() })
  if (!res.ok) throw new Error('컬렉션을 불러오지 못했습니다.')
  return res.json()
}

export async function addToCollection(data: {
  itemType: string; itemId: string; itemName: string
}): Promise<CollectionItem> {
  const res = await fetch('/api/collection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.message || '추가에 실패했습니다.')
  return body
}

export async function removeFromCollection(id: number): Promise<void> {
  const res = await fetch(`/api/collection/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
  if (!res.ok) throw new Error('삭제에 실패했습니다.')
}

export async function checkInCollection(itemId: string): Promise<CollectionItem | null> {
  try {
    const list = await getMyCollection()
    return list.find(i => i.itemId === itemId) ?? null
  } catch {
    return null
  }
}
