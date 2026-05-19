// ========================================
// プレイヤーデータを管理するカスタムフック
// Firebase Firestore にデータを保存・取得する
// ========================================

import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

// 初期データ（新規プレイヤー）
const INITIAL_PLAYER = {
  gems: 300,       // 最初のガチャ石（30連分）
  cards: [],       // 所持カード一覧
  createdAt: new Date().toISOString(),
}

export function usePlayer(userId) {
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)

  // Firestore からプレイヤーデータを読み込む
  useEffect(() => {
    if (!userId) return

    async function loadPlayer() {
      // Firestore の「players」コレクションから自分のデータを取得
      const ref = doc(db, 'players', userId)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        // すでにデータがある → 読み込む
        setPlayer(snap.data())
      } else {
        // 初めて遊ぶ → 初期データを作成
        await setDoc(ref, INITIAL_PLAYER)
        setPlayer(INITIAL_PLAYER)
      }
      setLoading(false)
    }

    loadPlayer()
  }, [userId])

  // ガチャ石を消費する
  async function spendGems(amount) {
    if (!userId || !player) return false
    if (player.gems < amount) return false  // 石が足りない

    const newGems = player.gems - amount
    const ref = doc(db, 'players', userId)
    await updateDoc(ref, { gems: newGems })
    setPlayer(prev => ({ ...prev, gems: newGems }))
    return true
  }

  // カードを追加する（ガチャで引いたとき）
  async function addCards(newCards) {
    if (!userId || !player) return

    // 既存カードに新しいカードを追加（重複OK、同じキャラを複数持てる）
    const updatedCards = [...player.cards, ...newCards]
    const ref = doc(db, 'players', userId)
    await updateDoc(ref, { cards: updatedCards })
    setPlayer(prev => ({ ...prev, cards: updatedCards }))
  }

  return { player, loading, spendGems, addCards }
}
