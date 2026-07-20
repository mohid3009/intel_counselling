const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

/**
 * Generate a username: firstname.lastname@schoolcode (lowercase, no spaces)
 */
function generateUsername(firstName, lastName, schoolCode) {
  const clean = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${clean(firstName)}.${clean(lastName)}@${clean(schoolCode)}.com`;
}

/**
 * Generate a random 10-character alphanumeric password
 */
function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += chars.charAt(randomBytes[i] % chars.length);
  }
  return password;
}

/**
 * Generate credentials for a new user
 * @returns {{ email, plainPassword, passwordHash }}
 */
async function generateCredentials(firstName, lastName, schoolCode) {
  const email = generateUsername(firstName, lastName, schoolCode);
  const plainPassword = generatePassword(10);
  const passwordHash = await bcrypt.hash(plainPassword, 12);
  return { email, plainPassword, passwordHash };
}

/**
 * Generate a new random password and hash it
 */
async function regeneratePassword() {
  const plainPassword = generatePassword(10);
  const passwordHash = await bcrypt.hash(plainPassword, 12);
  return { plainPassword, passwordHash };
}

module.exports = { generateCredentials, regeneratePassword, generateUsername, generatePassword };
