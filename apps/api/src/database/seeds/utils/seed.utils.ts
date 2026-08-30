import { randomBytes, scryptSync } from 'crypto';
import { faker } from '@faker-js/faker';

export function hashPassword(password: string): {
  password: string;
  salt: string;
} {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { password: hash, salt };
}

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function pickRandomUnique<T>(items: T[], count: number): T[] {
  return faker.helpers.arrayElements(items, Math.min(count, items.length));
}
