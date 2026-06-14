// Supabase の properties テーブルに対応した型
export interface Property {
  id: string          // UUID（Primary Key）
  user_id: string     // 登録したユーザーのID
  name: string        // 物件名
  rent: number        // 月額家賃（円）
  area: string        // エリア名
  rooms: string       // 間取り（例: 1LDK）
  created_at: string  // 登録日時
}

// 新規追加・更新フォームで使う型（id, user_id, created_at は不要）
export type PropertyForm = Pick<Property, 'name' | 'rent' | 'area' | 'rooms'>
