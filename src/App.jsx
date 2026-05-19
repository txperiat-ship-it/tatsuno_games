// ========================================
// メインアプリ
// ページの切り替えと全体の状態管理をここでやる
// ========================================

import { useState, useEffect } from 'react'
import { auth, loginAnonymously } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { usePlayer } from './hooks/usePlayer'

import Header from './components/Header'
import GachaPage from './components/GachaPage'
import DeckPage from './components/DeckPage'
import BattlePage from './components/BattlePage'

export default function App() {
  // ログイン中のユーザーID（Firebase の匿名ログイン）
  const [userId, setUserId] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // 表示するページ（'gacha' | 'deck' | 'battle'）
  const [page, setPage] = useState('gacha')

  // Firebase Auth の状態を監視する
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // すでにログイン済みならそのまま使う
        setUserId(user.uid)
      } else {
        // 未ログインなら匿名でログインする
        const newUser = await loginAnonymously()
        setUserId(newUser.uid)
      }
      setAuthLoading(false)
    })

    // コンポーネントが消えるときに監視を止める
    return unsubscribe
  }, [])

  // プレイヤーデータ（石の数、所持カード）
  const { player, loading, spendGems, addCards } = usePlayer(userId)

  // バトル勝利で石を獲得する
  async function gainGems(amount) {
    if (!userId || !player) return
    const newGems = player.gems + amount
    const ref = doc(db, 'players', userId)
    await updateDoc(ref, { gems: newGems })
    // usePlayer の state も更新する（リロード不要）
    player.gems = newGems  // 直接書き換え（簡易版）
    // 画面を強制再描画させるために page を一瞬リセット
    setPage(p => p)
  }

  // ローディング中の表示
  if (authLoading || loading) {
    return (
      <div style={styles.loading}>
        <div style={{ fontSize: '4rem' }}>⛩️</div>
        <p>神獣召喚記を起動中...</p>
      </div>
    )
  }

  return (
    <div style={styles.app}>
      {/* ヘッダー（全ページ共通） */}
      <Header
        page={page}
        setPage={setPage}
        gems={player?.gems}
      />

      {/* メインコンテンツ（ページに応じて切り替え） */}
      <main>
        {page === 'gacha' && (
          <GachaPage
            player={player}
            spendGems={spendGems}
            addCards={addCards}
          />
        )}
        {page === 'deck' && (
          <DeckPage
            cards={player?.cards ?? []}
          />
        )}
        {page === 'battle' && (
          <BattlePage
            cards={player?.cards ?? []}
            onGainGems={gainGems}
          />
        )}
      </main>
    </div>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#0f0a1e',
    color: '#fff',
    fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
  },
  loading: {
    minHeight: '100vh',
    backgroundColor: '#0f0a1e',
    color: '#a78bfa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    gap: '16px',
  },
}
