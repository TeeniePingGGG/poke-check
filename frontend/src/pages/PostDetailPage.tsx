import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import {
  getPost, deletePost, likePost,
  getComments, createComment, deleteComment,
  type Post, type Comment,
} from '../api/postApi'
import './PostDetailPage.css'

function formatDateTime(iso: string) {
  return iso.slice(0, 16).replace('T', ' ').replace(/-/g, '.')
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const postId = Number(id)

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const fetchedRef = useRef(false)

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    Promise.all([getPost(postId), getComments(postId)])
      .then(([p, c]) => {
        setPost(p)
        setLikeCount(p.likeCount)
        setComments(c)
      })
      .catch(() => navigate('/community'))
      .finally(() => setLoading(false))
  }, [postId])

  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    try {
      const result = await likePost(postId)
      setLikeCount(result.likeCount)
      setLiked(result.liked)
    } catch {
      alert('좋아요 처리 중 오류가 발생했습니다.')
    }
  }

  const handleComment = async () => {
    if (!commentText.trim()) return
    if (!user) { navigate('/login'); return }
    const c = await createComment(postId, commentText.trim())
    setComments(prev => [...prev, c])
    setCommentText('')
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제할까요?')) return
    await deleteComment(commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  const handleDeletePost = async () => {
    if (!confirm('게시글을 삭제할까요?')) return
    await deletePost(postId)
    navigate('/community')
  }

  if (loading) return <div className="detail-page"><Header /><div className="loading">불러오는 중...</div></div>
  if (!post) return null

  return (
    <div className="detail-page">
      <Header />
      <div className="detail-wrap">

        <button className="back-btn" onClick={() => navigate('/community')}>
          ← 목록으로 돌아가기
        </button>

        {/* 게시글 */}
        <div className="post-card">
          <h1 className="post-title">{post.title}</h1>

          <div className="post-meta">
            <div className="meta-left">
              <div className="author-avatar">{post.authorNickname[0].toUpperCase()}</div>
              <div>
                <span className="author-name">{post.authorNickname}</span>
                <span className="post-date">{formatDateTime(post.createdAt)}</span>
              </div>
            </div>
            <div className="meta-right">
              <span>👁 {post.viewCount}</span>
              <span>🤍 {likeCount}</span>
              <span>💬 {comments.length}</span>
              {user?.nickname === post.authorNickname && (
                <div className="post-actions">
                  <button onClick={() => navigate(`/community/${postId}/edit`)}>수정</button>
                  <button className="delete" onClick={handleDeletePost}>삭제</button>
                </div>
              )}
            </div>
          </div>

          <div className="post-content">{post.content}</div>

          <div className="like-area">
            <button
              className={`like-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {liked ? '❤️' : '🤍'} 좋아요 {likeCount}
            </button>
          </div>
        </div>

        {/* 댓글 */}
        <div className="comment-section">
          <h3 className="comment-heading">댓글 <span>{comments.length}</span></h3>

          {comments.length === 0 ? (
            <p className="no-comment">첫 댓글을 남겨보세요!</p>
          ) : (
            <ul className="comment-list">
              {comments.map(c => (
                <li key={c.id} className="comment-item">
                  <div className="comment-avatar">{c.authorNickname[0].toUpperCase()}</div>
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-author">{c.authorNickname}</span>
                      <span className="comment-date">{formatDateTime(c.createdAt)}</span>
                      {user?.nickname === c.authorNickname && (
                        <button
                          className="comment-delete"
                          onClick={() => handleDeleteComment(c.id)}
                        >삭제</button>
                      )}
                    </div>
                    <p className="comment-text">{c.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* 댓글 입력 */}
          <div className="comment-input-row">
            <div className="comment-input-avatar">
              {user ? user.nickname[0].toUpperCase() : '?'}
            </div>
            <input
              className="comment-input"
              type="text"
              placeholder={user ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleComment() }}
              disabled={!user}
            />
            <button
              className="comment-submit"
              onClick={handleComment}
              disabled={!user || !commentText.trim()}
            >
              💬 댓글 작성
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
