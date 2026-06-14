// 物件データの型定義
export interface Property {
  id: number
  name: string   // 物件名
  rent: number   // 月額家賃（円）
  area: string   // エリア（住所）
  rooms: string  // 間取り
  size: number   // 専有面積（㎡）
}
