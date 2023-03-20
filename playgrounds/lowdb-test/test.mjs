import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'db.json')

const db = new LowSync(new JSONFileSync(dbPath))

db.read();

// db.data = { posts: [] }

console.log(db);

db.write();
