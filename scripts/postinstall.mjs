import { existsSync, mkdirSync } from 'node:fs';

// Use Node rather than POSIX shell commands so setup also works on Windows.
mkdirSync('data', { recursive: true });
if (!existsSync('src/config/db/schema.ts')) {
  await import('./db-setup.mjs');
}
