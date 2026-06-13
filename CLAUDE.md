# realestate-app

不動産管理Webアプリ — Supabase認証付き。

## 技術スタック

- **フロントエンド**: Next.js (App Router) + TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド/DB**: Supabase (PostgreSQL + Auth + Storage)
- **デプロイ**: Vercel

## プロジェクト構成

```
realestate-app/
├── app/                  # Next.js App Router
│   ├── (auth)/           # 認証ページ群 (login, signup)
│   ├── (dashboard)/      # 認証済みページ群
│   └── layout.tsx
├── components/           # 共通コンポーネント
├── lib/
│   └── supabase/         # Supabaseクライアント設定
├── types/                # TypeScript型定義
└── public/
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
npm run dev      # 開発サーバー起動 (http://localhost:3000)
npm run build    # 本番ビルド
npm run lint     # ESLint
npm run typecheck  # TypeScript型チェック
```

## 環境変数

`.env.local` に設定 (コミットしない):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase 設定メモ

- Auth: Email/Password + (任意) Google OAuth
- RLS (Row Level Security) を全テーブルで有効化する
- `profiles` テーブルは `auth.users` と1対1で紐づける

## セキュリティ方針

- 環境変数 (`.env.local`, `*.key`) は絶対にコミットしない
- APIルートでは必ずSupabaseのセッション検証を行う
- クライアント側では `anon key` のみ使用し、`service_role key` はサーバー側専用
