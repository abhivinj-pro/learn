// Shared normalization + hashing for ASCII diagram override matching.
import crypto from 'node:crypto';

export function normalizeBlock(text) {
  let lines = text.replace(/\r\n/g, '\n').split('\n').map((l) => l.replace(/\s+$/g, ''));
  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  return lines.join('\n');
}

export function hashBlock(text) {
  return crypto.createHash('sha1').update(normalizeBlock(text), 'utf8').digest('hex').slice(0, 16);
}
