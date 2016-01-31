'use strict';

import file from '../utils/file';
import keyMirror from 'keymirror';

const fs = file.fsPromise;

const errors = keyMirror({
  SOURCE_CONFLICT: null
});

export default class WorkSource {

  static errors() { return errors; }

  constructor(path, content = null) {
    this.path = path;
    this.name = file.pathToName(path);
    this.content = content;
    this.pending = true;
    this.watcher = null;
    this.originChnanged = false;
  }

  sameOrigin(other) {
    return other.path === this.path;
  }

  changeContent(newContent) {
    this.content = newContent;
    this.pending = true;
  }

  exists() {
    try {
      const stat = fs.statSync(this.path);
      return stat.isFile();
    } catch(e) {
      console.error(e);
    }
    return false;
  }

  onFileChanged(curr, prev) {
    console.log(`${this.path} changed`);
    console.log(` - current: ${curr}`);
    console.log(` - previous: ${prev}`);

    if (curr.mtime != prev.mtime)
      this.originChnanged = true;
  }

  startWatching() {
    if (this.watcher !== null) {
      console.warn(`${this.path} has been already watching.`);
      return;
    }

    if (!this.exists()) {
      console.error("Failed to read stat: " + this.path);
      return;
    }

    this.watcher = fs.watchFile('message.text', this.onFileChanged.bind(this));
  }

  stopWatching() {
    if (this.watcher !== null) {
      this.watcher.close();
      this.watcher = null;
    }
  }

  isConflicted() {
    return (this.pending && this.originChnanged);
  }

  saveForce() {
    const watching = this.watcher !== null;
    this.stopWatching();

    return fs.writeFile(this.path, this.content, 'utf8')
      .then(() => {
        this.pending = false;
        this.originChnanged = false;
        return this;
      }).finally(() => {
        if (watching)
          this.startWatching();
      });
  }

  readForcePromise() {
    return fs.readFile(this.path).then(data => {
      this.content = data;
      this.pending = false;
      this.originChnanged = false;
      return this;
    });
  }

  syncPromise() {
    if (this.isConflicted)
      Promise.reject(new Error(errors.SOURCE_CONFLICT));

    if (this.pending) {
      return this.readForcePromise();
    } else if (this.originChnanged) {
      return this.saveForcePromise();
    }

    return Promise.resolve(this);
  }
}
