// ========================================
// ガチャページ
// 石を使ってカードを引く画面
// ========================================

import { useState } from 'react'
import { useGacha, GACHA_COST_SINGLE, GACHA_COST_TEN } from '../hooks/useGacha'
import BeastCard from './BeastCard'

export default function GachaPage({ player, spendGems, addCards }) {
  const { drawSingle, drawTen } = useGacha()

  // 引いたカードの結果を保持する（最初はnull＝まだ引いてない）
  const [results, setResults] = useState(null)
  // アニメーション中かどうか
  const [isAnimating, setIsAnimating] = useState(false)

  // ガチャを引く共通処理
  async function handleGacha(type) {
    const cost = type === 'single' ? GACHA_COST_SINGLE : GACHA_COST_TEN

    // 石が足りない場合はアラートを出して終了
    if (player.gems < cost) {
      alert(`石が足りません！\n必要: ${cost}個 / 所持: ${player.gems}個`)
      return
    }

    // アニメーション開始（ボタンを無効にする）
    setIsAnimating(true)
    setResults(null)

    // 石を消費
    const success = await spendGems(cost)
    if (!success) {
      setIsAnimating(false)
      return
    }

    // カードを抽選
    const drawn = type === 'single' ? drawSingle() : drawTen()

    // 少し待ってから結果を表示（演出）
    await new Promise(r => setTimeout(r, 800))

    // 結果を画面に表示
    setResults(drawn)

    // Firestoreに保存
    await addCards(drawn)

    setIsAnimating(false)
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>🎰 神獣召喚ガチャ</h2>
      <p style={styles.subtext}>石を使って神獣を召喚しよう！</p>

      {/* 確率表示 */}
      <div style={styles.rateBox}>
        <span style={{ color: '#FFD700' }}>SSR 3%</span>
        <span style={{ color: '#a78bfa' }}>SR 12%</span>
        <span style={{ color: '#CD7F32' }}>R 85%</span>
        <span style={{ color: '#4ade80', fontSize: '0.75rem' }}>※10連はSR以上1枚確定</span>
      </div>

      {/* ガチャボタン */}
      <div style={styles.buttonRow}>
        <button
          style={isAnimating ? styles.btnDisabled : styles.btnSingle}
          onClick={() => handleGacha('single')}
          disabled={isAnimating}
        >
          {isAnimating ? '召喚中...' : `1回召喚\n💎 ${GACHA_COST_SINGLE}個`}
        </button>

        <button
          style={isAnimating ? styles.btnDisabled : styles.btnTen}
          onClick={() => handleGacha('ten')}
          disabled={isAnimating}
        >
          {isAnimating ? '召喚中...' : `10回召喚\n💎 ${GACHA_COST_TEN}個`}
        </button>
      </div>

      {/* アニメーション中の演出 */}
      {isAnimating && (
        <div style={styles.animating}>
          <div style={styles.spinner}>⛩️</div>
          <p>神獣召喚中...</p>
        </div>
      )}

      {/* ガチャ結果 */}
      {results && !isAnimating && (
        <div>
          <h3 style={styles.resultHeading}>
            ✨ 召喚結果 ✨
            {results.some(c => c.rarity === 'SSR') && (
              <span style={{ color: '#FFD700', marginLeft: '8px' }}>SSR登場！！</span>
            )}
          </h3>
          <div style={styles.cardGrid}>
            {results.map((card) => (
              <BeastCard key={card.uniqueId} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* まだ引いていないときのメッセージ */}
      {!results && !isAnimating && (
        <div style={styles.placeholder}>
          <p>⬆ ボタンを押して神獣を召喚しよう！</p>
        </div>
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
    margin: '0 0 8px',
  },
  subtext: {
    color: '#a78bfa',
    textAlign: 'center',
    margin: '0 0 16px',
  },
  rateBox: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#1e1035',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  buttonRow: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  btnSingle: {
    background: 'linear-gradient(135deg, #6d28d9, #4c1d95)',
    color: '#fff',
    border: '2px solid #a78bfa',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '1rem',
    cursor: 'pointer',
    whiteSpace: 'pre-line',
    textAlign: 'center',
    lineHeight: '1.6',
    fontWeight: 'bold',
    minWidth: '140px',
  },
  btnTen: {
    background: 'linear-gradient(135deg, #b45309, #78350f)',
    color: '#fff',
    border: '2px solid #FFD700',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '1rem',
    cursor: 'pointer',
    whiteSpace: 'pre-line',
    textAlign: 'center',
    lineHeight: '1.6',
    fontWeight: 'bold',
    minWidth: '140px',
  },
  btnDisabled: {
    background: '#374151',
    color: '#9ca3af',
    border: '2px solid #4b5563',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '1rem',
    cursor: 'not-allowed',
    minWidth: '140px',
  },
  animating: {
    textAlign: 'center',
    color: '#a78bfa',
    fontSize: '1.2rem',
  },
  spinner: {
    fontSize: '4rem',
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
  },
  resultHeading: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: '16px',
  },
  cardGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
  },
  placeholder: {
    textAlign: 'center',
    color: '#6d7280',
    padding: '40px',
    border: '2px dashed #374151',
    borderRadius: '12px',
    fontSize: '1.1rem',
  },
}
