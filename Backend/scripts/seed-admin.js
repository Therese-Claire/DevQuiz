require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../config/db');

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';

  const existing = await db.query(
    'select id from users where username = $1 or email = $2 limit 1',
    [username, email]
  );
  if (existing.rows.length > 0) {
    console.log(`Admin user "${username}" already exists.`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query(
    'insert into users (username, email, password_hash, is_admin) values ($1, $2, $3, true)',
    [username, email, hashedPassword]
  );

  console.log(`Admin user "${username}" created.`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
