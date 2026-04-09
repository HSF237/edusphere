import { createClient } from '@supabase/supabase-js'

// Hardcoded for final production sync
const supabaseUrl = 'https://nzmngjspohqbpjuizdun.supabase.co'
const supabaseAnonKey = 'sb_publishable_0NJNnxfOaK07bxElTYl4MQ_B8sLlqCd'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
