import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 未認証ユーザーをログイン画面へリダイレクトするガードコンポーネント
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  // セッション確認が完了するまでローディング表示
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    )
  }

  // 未認証の場合はログイン画面へリダイレクト
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
