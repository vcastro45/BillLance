import { PostgrestError } from '@supabase/supabase-js'

export interface SelectResponse<T> {
  data: T[] | null
  error: PostgrestError| null
}
