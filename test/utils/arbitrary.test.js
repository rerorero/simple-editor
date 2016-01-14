/* global describe, it */
'use strict';
import arbitrary from './arbitrary';
import chai from 'chai';
const assert = chai.assert;


describe('arbitrary', () => {

  describe('choose', () => {

    it('generates numbers in range', () => {
      const arb = arbitrary.choose(0, 50);
      arbitrary.forAll(arb, (num) => {
        assert(num >= 0 && num <= 50);
      });
    });

    it('generates negative numbers in range', () => {
      const arb = arbitrary.choose(-100, -20);
      arbitrary.forAll(arb, (num) => {
        assert(num >= -100 && num <= -20);
      });
    });

  });

  describe('oneOf', () => {
    const enums = ['get', 'the', 'chance'];

    it('generates values of enums', () => {
      const arb = arbitrary.oneOf(enums);
      arbitrary.forAll(arb, (v) => {
        assert(enums.indexOf(v) >= 0);
      });
    });
  });

  describe('arrayOfN', () => {
    const enums = ['dont', 'go', 'away'];

    it('generates array of enums', () => {
      const arb = arbitrary.arrayOfN(10, arbitrary.oneOf(enums));
      arbitrary.forAll(arb, (ary) => {
        assert(ary.length === 10);
        ary.forEach((v) => assert(enums.indexOf(v) >= 0));
      });
    });
  });

  describe('identifier', () => {
    it('generates generic alphanumeric strings.', () => {
      const arb = arbitrary.identifier(3, 10);
      arbitrary.forAll(arb, (s) => {
        assert(s.length >= 3 && s.length <= 10 );
        assert(s.match(/[a-zA-Z0-9]*/) !== null);
      });
    });
  });

  describe('object', () => {
    it('generates objects from arbitrary map.', () => {
      const arbMap = {
        You: {
          are: arbitrary.oneOf(["cool", "shit"])
        },
        score: arbitrary.choose(0, 100)
      };
      const arb = arbitrary.obj(arbMap);
      arbitrary.forAll(arb, (o) => {
        assert(['cool', 'shit'].indexOf(o.You.are) >= 0);
        assert(o.score >= 0 && o.score <= 100);
      });
    });
  });

});
