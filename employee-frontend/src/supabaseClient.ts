import { createClient } from '@supabase/supabase-js'

// Những dòng này sẽ lấy thông tin từ file .env bạn đã sửa lúc nãy
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)