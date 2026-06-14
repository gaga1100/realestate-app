-- =====================================================
-- 不動産管理アプリ — Supabase テーブル定義
-- Supabase ダッシュボード > SQL Editor で実行してください
-- =====================================================

-- 物件テーブルを作成
CREATE TABLE IF NOT EXISTS properties (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,           -- 物件名
  rent       INTEGER     NOT NULL CHECK (rent >= 0),  -- 月額家賃（円）
  area       TEXT        NOT NULL,           -- エリア名
  rooms      TEXT        NOT NULL,           -- 間取り（例: 1LDK）
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row Level Security を有効化（全ユーザーが自分のデータのみ操作可能）
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 【SELECT】自分が登録した物件のみ参照可能
CREATE POLICY "自分の物件のみ参照できる"
  ON properties
  FOR SELECT
  USING (auth.uid() = user_id);

-- 【INSERT】user_id を自分のIDに設定した行のみ追加可能
CREATE POLICY "自分の物件のみ追加できる"
  ON properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 【UPDATE】自分が登録した物件のみ更新可能
CREATE POLICY "自分の物件のみ更新できる"
  ON properties
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 【DELETE】自分が登録した物件のみ削除可能
CREATE POLICY "自分の物件のみ削除できる"
  ON properties
  FOR DELETE
  USING (auth.uid() = user_id);
