import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getPosts, type Post } from '../api/postApi'
import './CommunityPage.css'

function formatDate(iso: string) {
  return iso.slice(0, 10).replace(/-/g, '.')
}

export default function CommunityPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const isLoggedIn = !!localStorage.getItem('user')

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return }
    setLoading(true)
    getPosts(page, 10)
      .then(data => {
        setPosts(data.content)
        setTotalPages(data.totalPages)
      })
      .finally(() => setLoading(false))
  }, [page, isLoggedIn])

  const filtered = keyword.trim()
    ? posts.filter(p =>
        p.title.includes(keyword) || p.authorNickname.includes(keyword)
      )
    : posts

  const handleWrite = () => {
    const user = localStorage.getItem('user')
    if (!user) { navigate('/login'); return }
    navigate('/community/write')
  }

  if (!isLoggedIn) {
    return (
      <div className="community-page">
        <Header />
        <div className="community-wrap">
          <div className="page-header">
            <div className="page-icon">💬</div>
            <div>
              <h2>커뮤니티</h2>
              <p>트레이너들과 소통하고 나만의 컬렉션과 팁 구성을 공유하세요.</p>
            </div>
          </div>
          <div className="login-required">
            <div className="login-required-icon">🔒</div>
            <p className="login-required-text">커뮤니티를 이용하려면 로그인해 주세요.</p>
            <button className="login-required-btn" onClick={() => navigate('/login')}>
              로그인하러 가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="community-page">
      <Header />
      <div className="community-wrap">

        {/* 페이지 헤더 */}
        <div className="page-header">
          <div className="page-icon">💬</div>
          <div>
            <h2>커뮤니티</h2>
            <p>트레이너들과 소통하고 나만의 컬렉션과 팁 구성을 공유하세요.</p>
          </div>
        </div>

        {/* 툴바 */}
        <div className="post-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="제목 또는 작성자로 검색"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <button className="write-btn" onClick={handleWrite}>
            ✏️ 글쓰기
          </button>
        </div>

        {/* 테이블 */}
        <div className="post-table-wrap">
          <table className="post-table">
            <thead>
              <tr>
                <th className="col-num">번호</th>
                <th className="col-title">제목</th>
                <th className="col-author">작성자</th>
                <th className="col-date">날짜</th>
                <th className="col-view">조회수</th>
                <th className="col-like">좋아요</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="empty">불러오는 중...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="empty">게시글이 없습니다.</td></tr>
              ) : (
                filtered.map((post, idx) => (
                  <tr key={post.id} onClick={() => navigate(`/community/${post.id}`)}>
                    <td className="col-num">{page * 10 + idx + 1}</td>
                    <td className="col-title">
                      <span className="post-title">{post.title}</span>
                    </td>
                    <td className="col-author">{post.authorNickname}</td>
                    <td className="col-date">{formatDate(post.createdAt)}</td>
                    <td className="col-view">👁 {post.viewCount}</td>
                    <td className="col-like">🤍 {post.likeCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${page === i ? 'active' : ''}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
