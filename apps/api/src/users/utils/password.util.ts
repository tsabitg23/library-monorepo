import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function hashPassword(password: string): {
  password: string;
  salt: string;
} {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { password: hash, salt };
}

export function verifyPassword(
  password: string,
  salt: string,
  hashedPassword: string,
): boolean {
  const hash = scryptSync(password, salt, 64);
  const storedHash = Buffer.from(hashedPassword, 'hex');
  return (
    hash.length === storedHash.length && timingSafeEqual(hash, storedHash)
  );
}
