#!/usr/bin/env node
/**
 * VEXIVO - Safe Production Administrator Provisioning Script
 *
 * Usage:
 *   node server/scripts/create-admin.js --email="admin@yourdomain.com" --password="YourSecurePassword!2026" --name="Store Administrator" --phone="+919876543210"
 * Or run interactively:
 *   node server/scripts/create-admin.js
 */

const path = require('path');
const readline = require('readline');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

function parseArgs() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--')) {
      const [key, ...rest] = arg.slice(2).split('=');
      args[key] = rest.join('=');
    }
  }
  return args;
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one digit.';
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return 'Password must contain at least one special character.';
  }
  return null;
}

async function main() {
  console.log('======================================================');
  console.log('🛡️  VEXIVO SECURE PRODUCTION ADMINISTRATOR SETUP');
  console.log('======================================================\n');

  const args = parseArgs();
  let email = args.email;
  let password = args.password;
  let name = args.name;
  let phone = args.phone;

  if (!email) {
    email = await prompt('Enter Admin Email Address: ');
  }
  if (!email || !email.includes('@')) {
    console.error('❌ Error: A valid email address is required.');
    process.exit(1);
  }

  if (!name) {
    name = (await prompt('Enter Admin Full Name [Administrator]: ')) || 'Administrator';
  }

  if (!phone) {
    phone = (await prompt('Enter Admin Phone (Optional): ')) || '';
  }

  if (!password) {
    password = await prompt('Enter Admin Password (min 8 chars, uppercase, lowercase, number, symbol): ');
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    console.error(`❌ Password validation failed: ${passwordError}`);
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vexivo';

  try {
    console.log('\n[VEXIVO Setup] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[VEXIVO Setup] Connected successfully.');

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.error(`❌ Refused: User with email "${email}" already exists. Existing credentials will NOT be overwritten.`);
      await mongoose.disconnect();
      process.exit(1);
    }

    // Create administrator
    const newAdmin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password, // Mongoose pre-save hook will hash this securely with bcrypt
      role: 'admin',
      phone: phone.trim(),
      isActive: true,
    });

    console.log('\n✅ SUCCESS: Administrator account created safely!');
    console.log(`   - ID: ${newAdmin._id}`);
    console.log(`   - Email: ${newAdmin.email}`);
    console.log(`   - Role: ${newAdmin.role}`);
    console.log(`   - Created At: ${newAdmin.createdAt}`);
    console.log('\n🔒 Keep your administrator credentials secure and do not share them.');
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating administrator:', err.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validatePassword };
