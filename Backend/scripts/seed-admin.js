require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/user');
const bcrypt = require('bcrypt');

async function seedAdmin() {
  await connectDB();

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ username });
  if (existing) {
    console.log(`Admin user "${username}" already exists.`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    username,
    password: hashedPassword,
    isAdmin: true,
  });

  console.log(`Admin user "${username}" created.`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
