import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Property } from '../types'

// ダミーの物件データ
const DUMMY_PROPERTIES: Property[] = [
  { id: 1, name: 'サンシャインマンション 101号室', rent: 80000, area: '東京都新宿区西新宿', rooms: '1LDK', size: 35.5 },
  { id: 2, name: 'グリーンハイツ 203号室',         rent: 65000, area: '東京都渋谷区代々木',   rooms: '1K',   size: 25.0 },
  { id: 3, name: 'ブルースカイアパート 305号室',   rent: 55000, area: '神奈川県横浜市西区',   rooms: '1K',   size: 22.0 },
  { id: 4, name: 'ローズガーデン 402号室',         rent: 120000, area: '東京都港区六本木',    rooms: '2LDK', size: 62.0 },
  { id: 5, name: 'メープルコート 501号室',         rent: 90000, area: '東京都世田谷区三軒茶屋', rooms: '2DK', size: 48.0 },
  { id: 6, name: 'シティビュー 102号室',           rent: 70000, area: '神奈川県川崎市中原区', rooms: '1LDK', size: 38.0 },
]

// 物件一覧ダッシュボードページ
export function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">不動産管理システム</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">物件一覧</h2>
          <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            {DUMMY_PROPERTIES.length}件
          </span>
        </div>

        {/* 物件カードグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DUMMY_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
    </div>
  )
}

// 物件カードコンポーネント
function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
      {/* 物件アイコン */}
      <div className="bg-blue-50 rounded-lg w-10 h-10 flex items-center justify-center mb-4">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>

      {/* 物件名 */}
      <h3 className="font-semibold text-gray-800 text-sm mb-1 leading-snug">
        {property.name}
      </h3>

      {/* エリア */}
      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {property.area}
      </p>

      {/* 間取り・面積 */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <span className="bg-gray-100 rounded px-2 py-0.5">{property.rooms}</span>
        <span>{property.size}㎡</span>
      </div>

      {/* 家賃 */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400 mb-0.5">月額家賃</p>
        <p className="text-blue-600 font-bold text-xl">
          ¥{property.rent.toLocaleString()}
          <span className="text-xs font-normal text-gray-400 ml-1">/ 月</span>
        </p>
      </div>
    </div>
  )
}
