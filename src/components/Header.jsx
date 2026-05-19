// ========================================
// ヘッダーコンポーネント
// 画面上部に常に表示されるナビゲーション
// ========================================

export default function Header({ page, setPage, gems }) {
  return (
    <header style={styles.header}>
      {/* タイトル */}
      <h1 style={styles.title}>⛩️ 神獣召喚記</h1>

      {/* ガチャ石の残数表示 */}
      <div style={styles.gems}>
        💎 {gems ?? '---'} 個
      </div>

      {/* ナビゲーションボタン */}
      <nav style={styles.nav}>
        <button
          style={page === 'gacha' ? styles.activeBtn : styles.btn}
          onClick={() => setPage('gacha')}
        >
          🎰 ガチャ
        </button>
        <button
          style={page === 'deck' ? styles.activeBtn : styles.btn}
          onClick={() => setPage('deck')}
        >
          📜 神獣一覧
        </button>
        <button
          style={page === 'battle' ? styles.activeBtn : styles.btn}
          onClick={() => setPage('battle')}
        >
          ⚔️ バトル
        </button>
      </nav>
    </header>
  )
}

// スタイル（CSS を JavaScript のオブジェクトで書く）
const styles = {
  header: {
    backgroundColor: '#1a0a2e',
    borderBottom: '2px solid #FFD700',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '1.4rem',
    color: '#FFD700',
    flexShrink: 0,
  },
  gems: {
    backgroundColor: '#2d1b69',
    color: '#a78bfa',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    border: '1px solid #6d28d9',
  },
  nav: {
    display: 'flex',
    gap: '8px',
    marginLeft: 'auto',
    flexWrap: 'wrap',
  },
  btn: {
    backgroundColor: '#2d1b69',
    color: '#c4b5fd',
    border: '1px solid #6d28d9',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  activeBtn: {
    backgroundColor: '#6d28d9',
    color: '#fff',
    border: '1px solid #a78bfa',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
}
