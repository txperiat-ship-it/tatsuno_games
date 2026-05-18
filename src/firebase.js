// ========================================
// Firebase の初期化ファイル
// ここで Firebase に接続する設定をする
// ========================================

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

// .env ファイルから設定を読み込む（VITE_ から始まる変数はブラウザで使える）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Firebase アプリを起動
const app = initializeApp(firebaseConfig)

// Firestore（データベース）を使えるようにする
export const db = getFirestore(app)

// Auth（ログイン機能）を使えるようにする
export const auth = getAuth(app)

// 匿名ログイン（アカウント登録なしで遊べる）
export async function loginAnonymously() {
  const result = await signInAnonymously(auth)
  return result.user
}
