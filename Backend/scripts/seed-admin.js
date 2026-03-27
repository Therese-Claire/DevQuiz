require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';

  const { data: existing, error: existingError } = await supabase
    .from('users')
    .select('id')
    .or(`username.eq.${username},email.eq.${email}`)
    .limit(1);
  if (existingError) throw existingError;
  if (existing && existing.length > 0) {
    console.log(`Admin user "${username}" already exists.`);
    process.exit(0);
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) throw new Error('Failed to create admin auth user');

  const { error: profileError } = await supabase.from('users').upsert({
    id: userId,
    username,
    email,
    is_admin: true,
  });
  if (profileError) throw profileError;

  console.log(`Admin user "${username}" created.`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
