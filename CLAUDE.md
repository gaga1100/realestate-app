# realestate-app

不動産管理Webアプリ — Supabase認証付き。

## 技術スタック

- **フロントエンド**: React 18 + Vite + TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド/DB**: Supabase (PostgreSQL + Auth)
- **デプロイ**: Vercel

## プロジェクト構成

```
realestate-app/
├── src/
│   ├── components/       # 共通コンポーネント (ProtectedRoute 等)
│   ├── context/          # React Context (AuthContext)
│   ├── lib/              # Supabaseクライアント設定
│   ├── pages/            # ページコンポーネント (Login, Signup, Dashboard)
│   ├── types/            # TypeScript型定義
│   ├── App.tsx           # ルーティング設定
│   ├── main.tsx          # エントリーポイント
│   └── index.css         # Tailwind ディレクティブ
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── tailwind.config.js
```

## Git 運用ルール

**コードを変更するたびに必ずGitHubにプッシュする。**

具体的な手順:

1. 変更をステージング: `git add <変更ファイル>`
2. コミット (意味のある単位で): `git commit -m "feat: ○○を追加"`
3. プッシュ: `git push origin main`

コミットメッセージの形式:
- `feat:` 新機能
- `fix:` バグ修正
- `refactor:` リファクタリング
- `style:` スタイル変更
- `docs:` ドキュメント変更
- `chore:` 設定・依存関係変更

ブランチ戦略:
- `main` — 本番相当の安定ブランチ。直接プッシュ可。
- `feature/<name>` — 大きな機能開発時のみ使用。

## 開発コマンド

```bash
npm run dev        # 開発サーバー起動 (http://localhost:5173)
npm run build      # 本番ビルド
npm run lint       # ESLint
npm run typecheck  # TypeScript型チェック
```

## 環境変数

`.env` に設定 (コミットしない — .gitignore で除外済み):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Supabase 設定メモ

- Auth: Email/Password 認証
- RLS (Row Level Security) を全テーブルで有効化する
- `profiles` テーブルは `auth.users` と1対1で紐づける

## セキュリティ方針

- 環境変数 (`.env`) は絶対にコミットしない
- クライアント側では `anon key` (publishable key) のみ使用する
- `service_role key` はサーバー側専用（このプロジェクトでは不使用）
