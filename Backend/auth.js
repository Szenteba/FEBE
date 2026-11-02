import crypto from 'node:crypto';

// 256 bits of cryptographically secure randomness encoded to hex or base64url
export const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};