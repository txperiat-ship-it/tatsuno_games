# 神獣召喚記 セットアップ手順

## 必要なもの
- Node.js（https://nodejs.org/ からインストール）
- Firebase アカウント（無料）

---

## 手順① Firebase プロジェクトを作る

1. https://console.firebase.google.com/ にアクセス
2. 「プロジェクトを追加」→ プロジェクト名を入力（例: tatsuno-games）
3. 「続行」→「続行」→「プロジェクトを作成」

### Firestore（データベース）を有効化する
1. 左メニュー「Firestore Database」→「データベースを作成」
2. 「テストモードで開始」を選ぶ（開発中はこれでOK）
3. ロケーションは `asia-northeast1`（東京）を選ぶ

### Authentication（ログイン機能）を有効化する
1. 左メニュー「Authentication」→「始める」
2. 「匿名」をクリック→「有効にする」→「保存」

### アプリの設定情報を取得する
1. プロジェクトの歯車アイコン → 「プロジェクトの設定」
2. 「アプリ」タブ → 「</>（Web）」アイコンをクリック
3. アプリのニックネームを入力 → 「アプリを登録」
4. `firebaseConfig` の中身をコピーしておく

---

## 手順② 環境変数を設定する

1. `.env.example` を `.env` という名前でコピーする
   ```
   cp .env.example .env
   ```

2. `.env` ファイルを開いて、Firebase の設定値を貼り付ける
   ```
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=tatsuno-games.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tatsuno-games
   VITE_FIREBASE_STORAGE_BUCKET=tatsuno-games.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

---

## 手順③ アプリを起動する

```bash
# パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` を開けば遊べます！

---

## ゲームの遊び方

| 画面 | できること |
|------|-----------|
| 🎰 ガチャ | 石💎を使って神獣を召喚 |
| 📜 神獣一覧 | 所持カードを確認 |
| ⚔️ バトル | 敵と戦って石を稼ぐ |

### 最初の石の数
- 新規プレイヤーは **300個**からスタート（10連×3回分）
- バトル勝利でも石が手に入る

### ガチャ確率
- SSR ★5: **3%**（アマテラス、スサノオ、ツクヨミ）
- SR ★4: **12%**（ヤマタノオロチ、ライジン、フウジン、イザナギ）
- R ★3: **85%**（キツネ、テング、オニ、タヌキ、カッパ）
- ※ 10連の10枚目は SR 以上確定！
