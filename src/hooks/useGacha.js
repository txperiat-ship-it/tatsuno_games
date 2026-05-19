// ========================================
// ガチャのロジックを管理するカスタムフック
// 確率計算とカード抽選をここで行う
// ========================================

import { BEASTS, GACHA_RATES } from '../data/beasts'

// ガチャ1回のコスト（石の数）
export const GACHA_COST_SINGLE = 10   // 1回引く
export const GACHA_COST_TEN = 100     // 10回引く（お得！）

export function useGacha() {
  // 1枚のカードを抽選する
  function drawOne() {
    // まずレアリティを決める（確率に従ってランダム）
    const rarity = rollRarity()

    // そのレアリティのカードだけ絞り込んで、ランダムに1枚選ぶ
    const pool = BEASTS.filter(b => b.rarity === rarity)
    const beast = pool[Math.floor(Math.random() * pool.length)]

    // 引いた時刻を記録しておく（所持カードの管理に使う）
    return {
      ...beast,
      drawnAt: new Date().toISOString(),
      uniqueId: `${beast.id}_${Date.now()}_${Math.random()}`,
    }
  }

  // レアリティをランダムに決める（確率通りに）
  function rollRarity() {
    const roll = Math.random() * 100  // 0〜100のランダムな数
    if (roll < GACHA_RATES.SSR) return 'SSR'      // 3%
    if (roll < GACHA_RATES.SSR + GACHA_RATES.SR) return 'SR'  // 12%
    return 'R'                                    // 85%
  }

  // 1回引く
  function drawSingle() {
    return [drawOne()]
  }

  // 10回引く（最後の1枚はSR以上確定！）
  function drawTen() {
    const results = []
    for (let i = 0; i < 9; i++) {
      results.push(drawOne())
    }

    // 10枚目はSR以上確定
    const lastRarity = Math.random() < (GACHA_RATES.SSR / (GACHA_RATES.SSR + GACHA_RATES.SR))
      ? 'SSR'
      : 'SR'
    const pool = BEASTS.filter(b => b.rarity === lastRarity)
    const lastCard = pool[Math.floor(Math.random() * pool.length)]
    results.push({
      ...lastCard,
      drawnAt: new Date().toISOString(),
      uniqueId: `${lastCard.id}_${Date.now()}_${Math.random()}`,
    })

    return results
  }

  return { drawSingle, drawTen }
}
