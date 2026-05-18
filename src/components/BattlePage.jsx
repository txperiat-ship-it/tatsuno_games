// ========================================
// バトルページ
// 所持カードで敵と戦う画面
// ========================================

import { useState } from 'react'

// 敵キャラクターのデータ
const ENEMIES = [
  { id: 'e1', name: 'ザコ鬼', emoji: '👺', hp: 300,  attack: 40,  reward: 10 },
  { id: 'e2', name: '大蛇',   emoji: '🐍', hp: 600,  attack: 80,  reward: 20 },
  { id: 'e3', name: '土蜘蛛', emoji: '🕷️', hp: 900,  attack: 120, reward: 30 },
  { id: 'e4', name: '鵺',     emoji: '🐯', hp: 1500, attack: 160, reward: 50 },
]

// バトルのステータス
const STATUS = {
  IDLE: 'idle',       // 待機中（敵を選ぶ）
  FIGHTING: 'fighting', // 戦闘中
  WIN: 'win',         // 勝利
  LOSE: 'lose',       // 敗北
}

export default function BattlePage({ cards, onGainGems }) {
  const [status, setStatus] = useState(STATUS.IDLE)
  const [selectedEnemy, setSelectedEnemy] = useState(null)
  const [battleLog, setBattleLog] = useState([])   // 戦闘ログ
  const [playerHp, setPlayerHp] = useState(0)
  const [enemyHp, setEnemyHp] = useState(0)

  // カードが1枚もない場合
  if (cards.length === 0) {
    return (
      <div style={styles.page}>
        <h2 style={styles.heading}>⚔️ バトル</h2>
        <div style={styles.empty}>
          <p>神獣がいません！</p>
          <p style={{ color: '#6d7280', fontSize: '0.9rem' }}>まずガチャで召喚しよう</p>
        </div>
      </div>
    )
  }

  // 自分のパーティーを作る（所持カードの中から強い順に3枚）
  const party = [...cards]
    .sort((a, b) => b.attack - a.attack)
    .slice(0, 3)

  // パーティーの合計HP・攻撃力
  const partyTotalHp = party.reduce((sum, c) => sum + c.hp, 0)
  const partyTotalAtk = party.reduce((sum, c) => sum + c.attack, 0)

  // バトル開始ボタンを押したとき
  function startBattle(enemy) {
    setSelectedEnemy(enemy)
    setStatus(STATUS.FIGHTING)
    setBattleLog([])
    setPlayerHp(partyTotalHp)
    setEnemyHp(enemy.hp)

    // バトルをシミュレーションする（自動戦闘）
    simulateBattle(enemy, partyTotalHp, partyTotalAtk)
  }

  // バトルのシミュレーション（ターン制）
  async function simulateBattle(enemy, myHp, myAtk) {
    let currentMyHp = myHp
    let currentEnemyHp = enemy.hp
    const log = []
    let turn = 1

    while (currentMyHp > 0 && currentEnemyHp > 0) {
      // プレイヤーの攻撃
      const myDamage = Math.floor(myAtk * (0.8 + Math.random() * 0.4))  // 80%〜120%のランダム
      currentEnemyHp -= myDamage
      log.push(`ターン${turn}: あなたの攻撃！ ${enemy.emoji}に ${myDamage} ダメージ！`)

      if (currentEnemyHp <= 0) {
        log.push(`✨ ${enemy.name}を倒した！`)
        break
      }

      // 敵の攻撃
      const enemyDamage = Math.floor(enemy.attack * (0.8 + Math.random() * 0.4))
      currentMyHp -= enemyDamage
      log.push(`ターン${turn}: ${enemy.emoji}の反撃！ ${enemyDamage} のダメージを受けた！`)

      turn++
      if (turn > 20) break  // 無限ループ防止（20ターンで強制終了）
    }

    // 最終的なHPを更新
    setEnemyHp(Math.max(0, currentEnemyHp))
    setPlayerHp(Math.max(0, currentMyHp))
    setBattleLog(log)

    // 勝敗判定
    if (currentEnemyHp <= 0) {
      setStatus(STATUS.WIN)
      // 報酬の石を獲得
      onGainGems(enemy.reward)
    } else {
      setStatus(STATUS.LOSE)
    }
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>⚔️ バトル</h2>

      {/* 自分のパーティー表示 */}
      <div style={styles.partyBox}>
        <h3 style={styles.partyTitle}>あなたのパーティー（強い順3体）</h3>
        <div style={styles.partyRow}>
          {party.map(card => (
            <div key={card.uniqueId} style={styles.partyCard}>
              <div style={{ fontSize: '2rem' }}>{card.emoji}</div>
              <div style={styles.partyName}>{card.name}</div>
              <div style={styles.partyStat}>❤️{card.hp} ⚔️{card.attack}</div>
            </div>
          ))}
        </div>
        <div style={styles.partyTotal}>
          合計 ❤️{partyTotalHp} / ⚔️{partyTotalAtk}
        </div>
      </div>

      {/* 敵選択（待機中のとき） */}
      {status === STATUS.IDLE && (
        <div>
          <h3 style={styles.subHeading}>敵を選んでバトル開始！</h3>
          <div style={styles.enemyGrid}>
            {ENEMIES.map(enemy => (
              <button
                key={enemy.id}
                style={styles.enemyBtn}
                onClick={() => startBattle(enemy)}
              >
                <div style={{ fontSize: '2.5rem' }}>{enemy.emoji}</div>
                <div style={styles.enemyName}>{enemy.name}</div>
                <div style={styles.enemyStat}>❤️{enemy.hp} ⚔️{enemy.attack}</div>
                <div style={styles.reward}>報酬 💎{enemy.reward}個</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* バトル結果 */}
      {status !== STATUS.IDLE && (
        <div style={styles.resultBox}>
          {/* 勝敗バナー */}
          {status === STATUS.WIN && (
            <div style={styles.winBanner}>🎉 勝利！ 💎{selectedEnemy.reward}個獲得！</div>
          )}
          {status === STATUS.LOSE && (
            <div style={styles.loseBanner}>💀 敗北... また挑戦しよう！</div>
          )}
          {status === STATUS.FIGHTING && (
            <div style={styles.fightingBanner}>⚔️ 戦闘中...</div>
          )}

          {/* HP バー */}
          <div style={styles.hpSection}>
            <HpBar label="あなた" current={playerHp} max={partyTotalHp} color="#4ade80" />
            <HpBar label={selectedEnemy?.name} current={enemyHp} max={selectedEnemy?.hp} color="#f87171" />
          </div>

          {/* 戦闘ログ */}
          <div style={styles.logBox}>
            {battleLog.map((line, i) => (
              <p key={i} style={{
                margin: '4px 0',
                color: line.includes('倒した') ? '#FFD700' : '#d1d5db',
                fontWeight: line.includes('倒した') ? 'bold' : 'normal',
              }}>
                {line}
              </p>
            ))}
          </div>

          {/* もう一度ボタン */}
          {(status === STATUS.WIN || status === STATUS.LOSE) && (
            <button
              style={styles.retryBtn}
              onClick={() => setStatus(STATUS.IDLE)}
            >
              ← 敵選択に戻る
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// HPバーコンポーネント
function HpBar({ label, current, max, color }) {
  const pct = max > 0 ? Math.max(0, (current / max) * 100) : 0
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '4px' }}>
        {label}: {Math.max(0, current)} / {max}
      </div>
      <div style={{ backgroundColor: '#374151', borderRadius: '6px', height: '16px', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          backgroundColor: color,
          height: '100%',
          transition: 'width 0.5s ease',
          borderRadius: '6px',
        }} />
      </div>
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
  subHeading: {
    color: '#a78bfa',
    textAlign: 'center',
    margin: '16px 0',
  },
  partyBox: {
    backgroundColor: '#1e1035',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px',
    border: '1px solid #6d28d9',
  },
  partyTitle: {
    color: '#a78bfa',
    margin: '0 0 12px',
    fontSize: '0.95rem',
  },
  partyRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  partyCard: {
    backgroundColor: '#2d1b69',
    borderRadius: '8px',
    padding: '10px 16px',
    textAlign: 'center',
    border: '1px solid #4c1d95',
  },
  partyName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  partyStat: {
    color: '#a78bfa',
    fontSize: '0.8rem',
  },
  partyTotal: {
    color: '#4ade80',
    fontWeight: 'bold',
    marginTop: '10px',
    fontSize: '0.95rem',
  },
  enemyGrid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  enemyBtn: {
    backgroundColor: '#1e1035',
    border: '2px solid #dc2626',
    borderRadius: '12px',
    padding: '16px 20px',
    cursor: 'pointer',
    textAlign: 'center',
    color: '#fff',
    transition: 'all 0.2s',
    minWidth: '140px',
  },
  enemyName: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#fff',
    margin: '4px 0',
  },
  enemyStat: {
    color: '#f87171',
    fontSize: '0.8rem',
  },
  reward: {
    color: '#a78bfa',
    fontSize: '0.8rem',
    marginTop: '4px',
  },
  resultBox: {
    backgroundColor: '#1e1035',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '16px',
    border: '1px solid #6d28d9',
  },
  winBanner: {
    backgroundColor: '#166534',
    color: '#4ade80',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginBottom: '16px',
  },
  loseBanner: {
    backgroundColor: '#7f1d1d',
    color: '#f87171',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginBottom: '16px',
  },
  fightingBanner: {
    backgroundColor: '#1e3a5f',
    color: '#60a5fa',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  hpSection: {
    marginBottom: '16px',
  },
  logBox: {
    backgroundColor: '#0f0a1e',
    borderRadius: '8px',
    padding: '12px',
    maxHeight: '200px',
    overflowY: 'auto',
    fontSize: '0.85rem',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  retryBtn: {
    backgroundColor: '#6d28d9',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 'bold',
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
