# 포켓체크 (Poke-Check)

포켓몬 도감과 TCG 카드 정보를 한글로 조회하고, 원하는 카드를 나만의 덱에 모아 관리하며 커뮤니티에서 정보를 나눌 수 있는 웹 서비스입니다.

- 개인 프로젝트 (기획 · Frontend · Backend 1인)
- 백엔드 프로젝트 과목 기말고사 대체 프로젝트

## 주요 기능

| 기능 | 설명 |
|---|---|
| 회원 | 회원가입 · 로그인 (Spring Security + JWT, BCrypt 비밀번호 암호화) |
| 포켓몬 도감 | PokéAPI 연동, 한글 이름 · 타입 · 능력치 조회 |
| 카드 | Pokémon TCG API 연동, 세트별 카드 목록 · 카드 상세 조회 |
| 커뮤니티 | 게시글 · 댓글 CRUD, 좋아요(중복 방지), 조회수 |
| My Deck | 카드 · 포켓몬을 내 컬렉션에 추가 · 조회 · 삭제 |

## 기술 스택

- **Backend**: Java 21, Spring Boot 3.3, Spring Security, JWT(jjwt), Spring Data JPA, MySQL
- **Frontend**: React 19, TypeScript, Vite, React Router
- **External API**: PokéAPI, Pokémon TCG API

## 프로젝트 구조

```
poke-check
├── backend    # Spring Boot (controller / service / repository / entity / dto / config)
└── frontend   # React + TypeScript + Vite (pages / components / api)
```

## DB 구조

| 테이블 | 설명 |
|---|---|
| users | 회원 (loginId, password, nickname, email, role) |
| posts | 커뮤니티 게시글 (title, content, viewCount, likeCount) |
| comments | 댓글 |
| post_likes | 좋아요 — (post_id, user_id) UNIQUE로 중복 방지 |
| collections | My Deck 카드 컬렉션 (itemType, itemId, itemName) |

## 주요 API

| Method | URL | 설명 |
|---|---|---|
| POST | /api/auth/join | 회원가입 |
| POST | /api/auth/login | 로그인 (JWT 발급) |
| GET / POST | /api/posts | 게시글 목록 / 작성 |
| GET / PUT / DELETE | /api/posts/{id} | 게시글 상세 / 수정 / 삭제 |
| POST | /api/posts/{id}/like | 좋아요 |
| GET / POST | /api/posts/{postId}/comments | 댓글 목록 / 작성 |
| PUT / DELETE | /api/comments/{id} | 댓글 수정 / 삭제 |
| GET / POST | /api/collection | 컬렉션 조회 / 추가 |
| DELETE | /api/collection/{id} | 컬렉션 삭제 |

## 실행 방법

### Backend
1. MySQL에 `pokecheck` 데이터베이스를 생성합니다.
2. `backend/src/main/resources/application-secret.properties.example`을 복사해 `application-secret.properties`로 이름을 바꾸고 값을 채웁니다.
3. IntelliJ에서 `PokeCheckApplication`을 실행합니다. (http://localhost:8080)

### Frontend
```bash
cd frontend
cp .env.example .env.local   # VITE_TCG_API_KEY 입력
npm install
npm run dev
```
