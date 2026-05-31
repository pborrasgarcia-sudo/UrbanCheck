import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gqvnqwkubmexvewquruz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxdm5xd2t1Ym1leHZld3F1cnV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTk4NDUsImV4cCI6MjA5NTU3NTg0NX0.MptGbIU23UaAbkZmWCjkUa2If2dRufWwjwA4BP-ec84'

export const supabase = createClient(supabaseUrl, supabaseKey)