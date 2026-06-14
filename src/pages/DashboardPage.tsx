import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Property, PropertyForm } from '../types'
import {
  fetchProperties,
  insertProperty,
  updateProperty,
  deleteProperty,
} from '../lib/propertiesApi'

// フォームの初期値
const EMPTY_FORM: PropertyForm = { name: '', rent: 0, area: '', rooms: '' }

// 物件一覧ダッシュボードページ（CRUD対応）
export function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // 物件一覧の状態管理
  const [properties, setProperties] = useState<Property[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  // フォームの状態管理（'none' | 'add' | 'edit'）
  const [formMode, setFormMode] = useState<'none' | 'add' | 'edit'>('none')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<PropertyForm>(EMPTY_FORM)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // 初回マウント時に物件一覧を取得
  useEffect(() => {
    loadProperties()
  }, [])

  // Supabase から物件一覧を取得してステートに反映
  async function loadProperties() {
    setListLoading(true)
    setListError(null)
    try {
      const data = await fetchProperties()
      setProperties(data)
    } catch {
      setListError('物件の取得に失敗しました。再度お試しください。')
    } finally {
      setListLoading(false)
    }
  }

  // 新規追加フォームを開く
  function openAddForm() {
    setFormMode('add')
    setFormData(EMPTY_FORM)
    setEditingId(null)
    setFormError(null)
  }

  // 編集フォームを開く（選択した物件の値をフォームに反映）
  function openEditForm(property: Property) {
    setFormMode('edit')
    setEditingId(property.id)
    setFormData({ name: property.name, rent: property.rent, area: property.area, rooms: property.rooms })
    setFormError(null)
  }

  // フォームを閉じて初期状態に戻す
  function closeForm() {
    setFormMode('none')
    setEditingId(null)
    setFormData(EMPTY_FORM)
    setFormError(null)
  }

  // フォーム送信：新規追加（INSERT）または更新（UPDATE）
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setFormLoading(true)

    try {
      if (formMode === 'add') {
        await insertProperty(formData)
      } else if (formMode === 'edit' && editingId) {
        await updateProperty(editingId, formData)
      }
      closeForm()
      await loadProperties() // 最新データを再取得
    } catch {
      setFormError(formMode === 'add' ? '登録に失敗しました。' : '更新に失敗しました。')
    } finally {
      setFormLoading(false)
    }
  }

  // 物件を削除（DELETE）
  async function handleDelete(property: Property) {
    if (!window.confirm(`「${property.name}」を削除しますか？\nこの操作は取り消せません。`)) return

    try {
      await deleteProperty(property.id)
      await loadProperties() // 削除後に一覧を再取得
    } catch {
      alert('削除に失敗しました。再度お試しください。')
    }
  }

  // ログアウト
  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  // フォーム入力値を更新するヘルパー
  function updateForm(field: keyof PropertyForm, value: string | number) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
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

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* タイトル行：物件数 + 追加ボタン */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">物件一覧</h2>
            <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {properties.length}件
            </span>
          </div>
          {formMode === 'none' && (
            <button
              onClick={openAddForm}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span className="text-base leading-none">＋</span>
              物件を追加
            </button>
          )}
        </div>

        {/* 追加・編集フォームパネル */}
        {formMode !== 'none' && (
          <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6 mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-5">
              {formMode === 'add' ? '新規物件登録' : '物件情報を編集'}
            </h3>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {/* 物件名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">物件名</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    required
                    placeholder="サンシャインマンション 101号室"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 月額家賃 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">月額家賃（円）</label>
                  <input
                    type="number"
                    value={formData.rent || ''}
                    onChange={(e) => updateForm('rent', parseInt(e.target.value) || 0)}
                    required
                    min={0}
                    placeholder="80000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* エリア名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">エリア名</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => updateForm('area', e.target.value)}
                    required
                    placeholder="東京都新宿区"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 間取り */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">間取り</label>
                  <input
                    type="text"
                    value={formData.rooms}
                    onChange={(e) => updateForm('rooms', e.target.value)}
                    required
                    placeholder="1LDK"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* フォームアクションボタン */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  {formLoading ? '処理中...' : formMode === 'add' ? '登録する' : '更新する'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ローディング表示 */}
        {listLoading && (
          <div className="text-center py-16 text-gray-400 text-sm">読み込み中...</div>
        )}

        {/* エラー表示 */}
        {listError && !listLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
            {listError}
          </div>
        )}

        {/* 物件が0件のときの空状態 */}
        {!listLoading && !listError && properties.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-300 text-5xl mb-4">🏠</div>
            <p className="text-gray-500 text-sm mb-4">まだ物件が登録されていません</p>
            {formMode === 'none' && (
              <button
                onClick={openAddForm}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                最初の物件を登録する →
              </button>
            )}
          </div>
        )}

        {/* 物件カードグリッド */}
        {!listLoading && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isEditing={editingId === property.id}
                onEdit={() => openEditForm(property)}
                onDelete={() => handleDelete(property)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// 物件カードコンポーネント
interface PropertyCardProps {
  property: Property
  isEditing: boolean       // 編集中かどうか（ハイライト表示用）
  onEdit: () => void
  onDelete: () => void
}

function PropertyCard({ property, isEditing, onEdit, onDelete }: PropertyCardProps) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm p-5 transition-shadow ${
      isEditing
        ? 'border-blue-300 shadow-md ring-1 ring-blue-200'
        : 'border-gray-100 hover:shadow-md'
    }`}>
      {/* 物件アイコン */}
      <div className="bg-blue-50 rounded-lg w-10 h-10 flex items-center justify-center mb-4">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>

      {/* 物件名 */}
      <h3 className="font-semibold text-gray-800 text-sm mb-1 leading-snug">{property.name}</h3>

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

      {/* 間取り */}
      <div className="mb-4">
        <span className="bg-gray-100 rounded px-2 py-0.5 text-xs text-gray-600">{property.rooms}</span>
      </div>

      {/* 月額家賃 */}
      <div className="border-t border-gray-100 pt-3 mb-3">
        <p className="text-xs text-gray-400 mb-0.5">月額家賃</p>
        <p className="text-blue-600 font-bold text-xl">
          ¥{property.rent.toLocaleString()}
          <span className="text-xs font-normal text-gray-400 ml-1">/ 月</span>
        </p>
      </div>

      {/* 編集・削除ボタン */}
      <div className="flex gap-2 border-t border-gray-100 pt-3">
        <button
          onClick={onEdit}
          className="flex-1 text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          編集
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={onDelete}
          className="flex-1 text-center text-sm text-red-500 hover:text-red-600 font-medium py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          削除
        </button>
      </div>
    </div>
  )
}
