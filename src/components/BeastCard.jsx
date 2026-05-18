// ========================================
// 神獣カードコンポーネント
// ガチャ結果や一覧で使う共通のカード表示
// ========================================

import { RARITY_STYLE } from '../data/beasts'

export default function BeastCard({ card, size = 'normal' }) {
  const style = RARITY_STYLE[card.rarity]
  const isLarge = size === 'large'

  return (
    <div style={{
      ...styles.card,
      background: style.bg,
      border: `2px solid ${style.border}`,
      width: isLarge ? '160px' : '130px',
    }}>
      {/* レアリティ表示 */}
      <div style={{ ...styles.rarityLabel, color: style.border }}>
        {style.label}
      </div>

      {/* 絵文字（キャラクターアイコン代わり） */}
      <div style={{ fontSize: isLarge ? '4rem' : '3rem', textAlign: 'center' }}>
        {card.emoji}
      </div>

      {/* 属性バッジ */}
      <div style={styles.element}>{card.element}</div>

      {/* 名前 */}
      <div style={styles.name}>{card.name}</div>
      <div style={styles.title}>{card.title}</div>

      {/* ステータス */}
      <div style={styles.stats}>
        <span>❤️ {card.hp}</span>
        <span>⚔️ {card.attack}</span>
      </div>

      {/* スキル名 */}
      <div style={styles.skill}>✨ {card.skill}</div>
    </div>
  )
}

const styles = {
  card: {
    borderRadius: '12px',
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
    cursor: 'default',
    transition: 'transform 0.2s',
  },
  rarityLabel: {
    fontSize: '0.65rem',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
  },
  element: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#fff',
    fontSize: '0.7rem',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
  },
  title: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.65rem',
  },
  stats: {
    display: 'flex',
    gap: '10px',
    color: '#fff',
    fontSize: '0.75rem',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '3px 8px',
    borderRadius: '8px',
  },
  skill: {
    color: '#FFD700',
    fontSize: '0.7rem',
    fontWeight: 'bold',
  },
}
