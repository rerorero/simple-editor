/* global describe, it */
'use strict';
import fsPromise from './fs_promise';
import chai from 'chai';

const assert = chai.assert;

describe('fs_promise', () => {
  describe('stats', () => {
    it('returns valid current directory stats.', () => {
      let p = fsPromise.stat(".");
      assert(p instanceof Promise);
      p.then((actual) => {
        assert(actual.isDirectory());
      });
    });
  });
});
