import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CommunityPage from './pages/CommunityPage'
import PostDetailPage from './pages/PostDetailPage'
import PostWritePage from './pages/PostWritePage'
import EncyclopediaPage from './pages/EncyclopediaPage'
import PokemonDetailPage from './pages/PokemonDetailPage'
import CardSetsPage from './pages/CardSetsPage'
import CardListPage from './pages/CardListPage'
import CardDetailPage from './pages/CardDetailPage'
import CollectionPage from './pages/CollectionPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/write" element={<PostWritePage />} />
        <Route path="/community/:id" element={<PostDetailPage />} />
        <Route path="/community/:id/edit" element={<PostWritePage />} />
        <Route path="/encyclopedia" element={<EncyclopediaPage />} />
        <Route path="/encyclopedia/:id" element={<PokemonDetailPage />} />
        <Route path="/cards" element={<CardSetsPage />} />
        <Route path="/cards/:setId" element={<CardListPage />} />
        <Route path="/cards/:setId/:cardId" element={<CardDetailPage />} />
        <Route path="/collection" element={<CollectionPage />} />
      </Routes>
    </BrowserRouter>
  )
}
