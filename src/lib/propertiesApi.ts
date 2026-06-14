import { supabase } from './supabaseClient'
import type { Property, PropertyForm } from '../types'

// 自分が登録した物件一覧を取得（新着順）
export async function fetchProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 物件を新規登録（RLS により user_id は認証済みユーザーのみ許可される）
export async function insertProperty(form: PropertyForm): Promise<Property> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('ログインが必要です')

  const { data, error } = await supabase
    .from('properties')
    .insert({ ...form, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

// 物件情報を更新（RLS により自分の物件のみ更新可能）
export async function updateProperty(id: string, form: PropertyForm): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .update(form)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// 物件を削除（RLS により自分の物件のみ削除可能）
export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw error
}
