import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { createPost, updatePost, getPost } from '../api/postApi'
import './PostWritePage.css'

export default function PostWritePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login')
      return
    }
    if (isEdit) {
      getPost(Number(id)).then(p => {
        setTitle(p.title)
        setContent(p.content)
      })
    }
  }, [id])

  const titleError = title.length > 0 && title.length < 5 ? '제목은 5자 이상이어야 합니다.' : ''
  const contentError = content.length > 0 && content.length < 10 ? '내용은 10자 이상이어야 합니다.' : ''
  const canSubmit = title.length >= 5 && title.length <= 100 && content.length >= 10

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      if (isEdit) {
        await updatePost(Number(id), { title, content })
        navigate(`/community/${id}`)
      } else {
        const post = await createPost({ title, content })
        navigate(`/community/${post.id}`)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="write-page">
      <Header />
      <div className="write-wrap">

        <button className="back-btn" onClick={() => navigate('/community')}>
          ← 목록으로 돌아가기
        </button>

        <div className="write-header">
          <h2>{isEdit ? '게시글 수정' : '게시글 작성'}</h2>
          <p>다른 트레이너들과 정보를 공유해보세요.</p>
        </div>

        {error && <div className="write-error">{error}</div>}

        <div className="write-card">
          {/* 제목 */}
          <div className="field-group">
            <label>
              제목 <span className="required">*</span>
            </label>
            <div className="input-wrap">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value.slice(0, 100))}
                placeholder="제목을 입력하세요 (5자 이상, 100자 이하)"
                className={titleError ? 'invalid' : ''}
              />
              <span className={`char-count ${title.length >= 100 ? 'max' : ''}`}>
                {title.length} / 100
              </span>
            </div>
            {titleError && <span className="field-error">{titleError}</span>}
          </div>

          {/* 내용 */}
          <div className="field-group">
            <label>
              내용 <span className="required">*</span>
            </label>
            <div className="textarea-wrap">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={'내용을 입력하세요 (10자 이상)\n\n마크다운 문법을 사용할 수 있습니다.\n**굵게**, *기울임*, - 목록 등'}
                rows={14}
                className={contentError ? 'invalid' : ''}
              />
              <span className={`char-count-bottom ${contentError ? 'error' : ''}`}>
                {content.length}자
              </span>
            </div>
            {contentError && <span className="field-error">{contentError}</span>}
          </div>

          {/* 작성 가이드 */}
          <div className="write-guide">
            <span className="guide-icon">ℹ️</span>
            <div>
              <strong>작성 가이드</strong>
              <ul>
                <li>욕설, 비방, 광고성 게시글은 삭제될 수 있습니다.</li>
                <li>다른 사람자를 존중하는 내용으로 작성해주세요.</li>
                <li>카드 시세, 덱 구성, 게임 팁 등 유익한 정보를 공유해주세요.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="write-actions">
          <button className="cancel-btn" onClick={() => navigate('/community')}>
            ✕ 취소
          </button>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
          >
            ✔ {loading ? '저장 중...' : isEdit ? '수정 완료' : '작성 완료'}
          </button>
        </div>

      </div>
    </div>
  )
}
