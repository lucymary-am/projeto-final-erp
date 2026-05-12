import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const serverPath = join(dir, '../dist/orbis-frontend/server/server.mjs');
const { reqHandler } = await import(serverPath);

export default reqHandler;
