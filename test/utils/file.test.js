/* global describe, it */
'use strict';
import file from './file';
import sinon from 'sinon';
import chai from 'chai';
const assert = chai.assert;

describe('file', () => {

  describe('fsPromise.stat', () => {
    it('returns valid current directory stats.', () => {
      return file.fsPromise.stat(".")
        .then((actual) => assert(actual.isDirectory()));
    });

    it('returns error when invalid path.', () => {
      return file.fsPromise.stat("/invalidpaaaaath")
        .then((st) => assert(false, st))
        .catch((e) => {});
    });
  });

  describe('pathToName', () => {
    it('extracts file name.', () => {
      assert(file.pathToName('/path/to/file.txt') === ('file.txt'));
      assert(file.pathToName('path/to/.ignore') === ('.ignore'));
      assert(file.pathToName('file.txt') === ('file.txt'));
      assert(file.pathToName('.') === ('.'));
    });
  });
});
