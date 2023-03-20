import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'

class snapshotDB {
  constructor(path) {
    this.path = path;
    this.db = new LowSync(new JSONFileSync(path));
    this.db.read();
  }

  get data() {
    return this.db.data;
  }

  read() {
    this.db.read();
  }

  write(data) {
    this.db.data = data;
    this.db.write();
  }
}

export {
  snapshotDB,
}