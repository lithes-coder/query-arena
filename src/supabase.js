import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uvhubtriitrjtjzitrgh.supabase.co'
const supabaseKey = 'sb_publishable_2vbTxkFye88uUe-_6pcHpA_fMHCLTzq'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)