export interface Post {
  id: number
  title: string
  content: string
  authorNickname: string
  viewCount: number
  likeCount: number
  createdAt: string
}

export interface PostPage {
  content: Post[]
  totalElements: number
  totalPages: number
  number: number
}

export interface Comment {
  id: number
  content: string
  authorNickname: string
  postId: number
  createdAt: string
}

function authHeader(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getPosts(page = 0, size = 10): Promise<PostPage> {
  const res = await fetch(`/api/posts?page=${page}&size=${size}`)
  if (!res.ok) throw new Error('게시글 목록을 불러오지 못했습니다.')
  return res.json()
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`)
  if (!res.ok) throw new Error('게시글을 찾을 수 없습니다.')
  return res.json()
}

export async function createPost(data: { title: string; content: string }): Promise<Post> {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  })
  const text = await res.text()
  const body = text ? JSON.parse(text) : {}
  if (!res.ok) throw new Error(body.message || '게시글 작성에 실패했습니다.')
  return body
}

export async function updatePost(id: number, data: { title: string; content: string }): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  })
  const text = await res.text()
  const body = text ? JSON.parse(text) : {}
  if (!res.ok) throw new Error(body.message || '게시글 수정에 실패했습니다.')
  return body
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
  if (!res.ok) throw new Error('게시글 삭제에 실패했습니다.')
}

export async function getComments(postId: number): Promise<Comment[]> {
  const res = await fetch(`/api/posts/${postId}/comments`)
  if (!res.ok) throw new Error('댓글을 불러오지 못했습니다.')
  return res.json()
}

export async function createComment(postId: number, content: string): Promise<Comment> {
  const res = await fetch(`/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ content }),
  })
  const text = await res.text()
  const body = text ? JSON.parse(text) : {}
  if (!res.ok) throw new Error(body.message || '댓글 작성에 실패했습니다.')
  return body
}

export async function deleteComment(id: number): Promise<void> {
  const res = await fetch(`/api/comments/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  })
  if (!res.ok) throw new Error('댓글 삭제에 실패했습니다.')
}

export async function likePost(id: number): Promise<{ likeCount: number; liked: boolean }> {
  const res = await fetch(`/api/posts/${id}/like`, {
    method: 'POST',
    headers: authHeader(),
  })
  if (!res.ok) throw new Error('좋아요 처리에 실패했습니다.')
  return res.json()
}
