// ========================================
// エントリーポイント
// React アプリをHTMLの #root に差し込む
// ========================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// index.html の <div id="root"> にアプリを入れる
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
