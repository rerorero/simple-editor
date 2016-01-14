'use strict';

function isArbitrary(obj) {
  return (typeof obj['sample'] === 'function');
}

class IntArbitrary {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  sample() {
    return Math.floor( Math.random() * (this.max - this.min + 1)) + this.min;
  }
}

class FloatArbitrary {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  sample() {
    return Math.random() * (this.max - this.min) + this.min;
  }
}

class ArrayArbitrary {
  constructor(elementArbitraries, sizeMin = 0, sizeMax = 5) {
    if (!Array.isArray(elementArbitraries))
      elementArbitraries = [elementArbitraries];

    if (!isArbitrary(elementArbitraries[0]))
      throw 'ArrayArbitrary: Not an arbitrary.: ' + elementArbitraries;

    this.sizeMin = sizeMin;
    this.sizeMax = sizeMax;
    this.lenGenerator = choose(this.sizeMin, this.sizeMax);
    this.elementGenerator = oneOf(elementArbitraries);
  }

  sample() {
    const len = this.lenGenerator.sample();
    return Array.apply(null, new Array(len))
      .map(() => this.elementGenerator.sample().sample());
  }
}

class ObjectArbitrary {
  // propArbitraries takes object array as follow
  // {
  //   key: string or any arbitrary (which has 'sample()' function)
  //   value: arbitrarities (to be selected randomly)
  // }
  constructor(propArbitraries) {
    if (typeof propArbitraries !== 'object')
      throw 'Not an arbitrary.: '+propArbitraries;

    this.propArbitraries = propArbitraries;
  }

  reduceArbitrary(arbMap) {
    return Object.keys(arbMap).reduce((acc, key) => {
      const value = arbMap[key];
      if (typeof value === 'object') {
        if (isArbitrary(value)) {
          acc[key] = value.sample();
        } else {
          const sub = this.reduceArbitrary(value);
          acc[key] = sub;
        }
      } else {
        console.warn('invalid arbitrary map, ignore the key: ' + key);
      }
      return acc;
    }, {});
  }

  sample() {
    return this.reduceArbitrary(this.propArbitraries);
  }
}

function choose(...range) {
  let min, max;
  if (range.length === 1) {
    min = 0;
    max = range[0];
  } else if (range.length === 2) {
    min = range[0];
    max = range[1];
  } else {
    throw 'Spacify range (max) or (min, max).';
  }

  if (typeof min !== 'number')
    throw 'Invalid max argument.';
  if (typeof max !== 'number')
    throw 'Invalid min argument.';

  if (Number.isInteger(min) && Number.isInteger(max)) {
    return new IntArbitrary(min, max);
  } else {
    return new FloatArbitrary(min, max);
  }
}

function oneOf(ary) {
  if (!Array.isArray(ary))
    throw 'Invalid argument, not an Array.:' + ary;
  if (ary.length === 0)
    throw 'Empty array.';

  const indexArbitrary = choose(0, ary.length - 1);

  return {
    sample: () => ary[indexArbitrary.sample()]
  };
}

function arrayOfN(size, arbitraries) {
  return new ArrayArbitrary(arbitraries, size, size);
}

function bool() {
  return oneOf([true, false]);
}

const chars = {
  lowerAlpha: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  upperAlpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  numeric: '0123456789'.split('')
};

const alphaLowerChar = oneOf(chars.lowerAlpha);
const alphaUpperChar = oneOf(chars.upperAlpha);
const alphaChar = oneOf(chars.lowerAlpha.concat(chars.upperAlpha));
const numericChar = oneOf(chars.numeric);
const alphaNumericChar = oneOf(chars.numeric.concat(chars.lowerAlpha, chars.upperAlpha));

function charSeqOf(charSet, minLen = 1, maxLen = 10) {
  if (Array.isArray(charSet))
    throw 'charSet is not array.:' + charSet;
  if (minLen < 0)
    throw 'minLen is negative.';

  const lenSelector = choose(minLen, maxLen);
  return {
    sample() {
      const len = lenSelector.sample();
      return arrayOfN(len, charSet).sample().join('');
    }
  };
}

function identifier(minLen = 1, maxLen = 10) {
  if (minLen < 0)
    throw 'minLen is negative.';

  const head = alphaChar;

  if (maxLen > 1) {
    const tailMinLen = (minLen > 0) ? minLen - 1 : 0;
    const numericCharSeq = charSeqOf(alphaNumericChar, tailMinLen, maxLen-1);
    return {
      sample: () => head.sample() + numericCharSeq.sample()
    };

  } else {
    return head;
  }
}

function numericStr(minLen = 1, maxLen = 10) {
  return charSeqOf(numericChar, minLen, maxLen);
}

function posNum(max = Number.MAX_VALUE) {
  return new IntArbitrary(0, max);
}

function negNum(min = Number.MIN_VALUE) {
  return new IntArbitrary(min, 0);
}

function obj(arbitraryMap) {
  return new ObjectArbitrary(arbitraryMap);
}

function forAll(arbitrary, func, count = 100) {
  if (typeof func !== 'function')
    throw 'Invalid func type.';

  while(count > 0) {
    func(arbitrary.sample());
    count--;
  }
}

const arbitrary = {
  choose,
  oneOf,
  arrayOfN,
  bool,
  charSeqOf,
  identifier,
  numericStr,
  posNum,
  negNum,
  obj,

  forAll,
  chars,

  IntArbitrary,
  FloatArbitrary,
  ArrayArbitrary,
  ObjectArbitrary
};

export default arbitrary;
