// ========================================
// 神獣一覧ページ
// 所持している神獣カードを一覧表示する
// ========================================

import { useState } from 'react'
import BeastCard from './BeastCard'
import { RARITY_STYLE } from '../data/beasts'

export default function DeckPage({ cards }) {
  // フィルター（全表示 or レアリティ絞り込み）
  const [filter, setFilter] = useState('ALL')

  // フィルターに合わせてカードを絞り込む
  const filtered = filter === 'ALL'
    ? cards
    : cards.filter(c => c.rarity === filter)

  // レアリティの内訳をカウントする
  const counts = {
    SSR: cards.filter(c => c.rarity === 'SSR').length,
    SR: cards.filter(c => c.rarity === 'SR').length,
    R: cards.filter(c => c.rarity === 'R').length,
  }

  // カードが1枚もない場合
  if (cards.length === 0) {
    return (
      <div style={styles.page}>
        <h2 style={styles.heading}>📜 神獣一覧</h2>
        <div style={styles.empty}>
          <p>まだ神獣がいません</p>
          <p style={{ color: '#6d7280', fontSize: '0.9rem' }}>ガチャで召喚しよう！</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📜 神獣一覧</h2>

      {/* 所持数サマリー */}
      <div style={styles.summary}>
        <span style={{ color: '#fff' }}>合計 {cards.length} 体</span>
        <span style={{ color: '#FFD700' }}>SSR: {counts.SSR}</span>
        <span style={{ color: '#a78bfa' }}>SR: {counts.SR}</span>
        <span style={{ color: '#CD7F32' }}>R: {counts.R}</span>
      </div>

      {/* フィルターボタン */}
      <div style={styles.filterRow}>
        {['ALL', 'SSR', 'SR', 'R'].map(f => (
          <button
            key={f}
            style={filter === f ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter(f)}
          >
            {f} {f !== 'ALL' && `(${counts[f]})`}
          </button>
        ))}
      </div>

      {/* カード一覧 */}
      <div style={styles.cardGrid}>
        {filtered.map((card) => (
          <BeastCard key={card.uniqueId} card={card} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6d7280' }}>
          {filter} のカードはまだありません
        </p>
      )}
    </div>
  )
}

const styles = {
  page: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  heading: {
    color: '#FFD700',
    textAlign: 'center',
    fontSize: '1.8rem',
    margin: '0 0 16px',
  },
  summary: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#1e1035',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontWeight: 'bold',
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    backgroundColor: '#2d1b69',
    color: '#c4b5fd',
    border: '1px solid #6d28d9',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  filterActive: {
    backgroundColor: '#6d28d9',
    color: '#fff',
    border: '1px solid #a78bfa',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  cardGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#fff',
    padding: '60px',
    border: '2px dashed #374151',
    borderRadius: '12px',
    fontSize: '1.2rem',
  },
}
