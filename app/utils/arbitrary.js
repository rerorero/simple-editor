'use strict';

class IntArbitrary {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  gen() {
    return Math.floor( Math.random() * (this.max - this.min + 1)) + this.min;
  }
}

class FloatArbitrary {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  gen() {
    return Math.random() * (this.max - this.min) + this.min;
  }
}

class ArrayArbitrary {
  constructor(elementArbitraries, sizeMin = 0, sizeMax = 5) {
    if (Array.isArray(elementArbitraries))
      throw 'elementArbitraries is not an Array.';
    this.sizeMin = sizeMin;
    this.sizeMax = sizeMax;
    this.lenGenerator = choose(this.sizeMin, this.sizeMax);
    this.elementGenerator = oneOf(elementArbitraries);
  }

  gen() {
    const len = this.lenGenerator.gen();
    return Array.apply(null, new Array(len))
      .map(() => this.elementGenerator.gen().gen());
  }
}

class ObjectArbitrary {
  // propArbitraries takes object array as follow
  // {
  //   key: string or any arbitrary (which has 'gen()' function)
  //   value: arbitrarities (to be selected randomly)
  // }
  constructor(propArbitraries) {
    if (Array.isArray(propArbitraries))
      throw 'propArbitraries is not an Array.';
    this.propArbitraries = propArbitraries;
  }

  gen() {
    return Object.keys(this.propArbitraries).reduce((acc, key) => {
      const value = oneOf(this.propArbitraries[key]).gen().gen();
      const keyName = (typeof key === 'string') ? key : key.gen();
      acc[keyName] = value;
      return acc;
    }, {});
  }
}

function choose(...range) {
  let min, max;
  if (range.length === 1) {
    min = 0;
    max = range[0];
  } else if (range.length === 2) {
    min = range[0];
    min = range[1];
  } else {
    throw 'Spacify range (max) or (min, max).';
  }

  if (!Number.isNumber(min))
    throw 'Invalid max argument.';
  if (!Number.isNumber(max))
    throw 'Invalid min argument.';

  if (Number.isInteger(min) && Number.isInteger(max)) {
    return new IntArbitrary(min, max);
  } else {
    return new FloatArbitrary(min, max);
  }
}

function oneOf(ary) {
  if (!Array.isArray(ary))
    throw 'Invalid argument, not an Array.';
  if (ary.length === 0)
    throw 'Empty array.';

  const indexArbitrary = choose(0, ary.length - 1);
  return {
    gen: () => ary[indexArbitrary.gen()]
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
  numeric: '0123456789'.split(''),
  urlsafe: '-_+&%#.'.split('')
};

const alphaLowerChar = oneOf(chars.lowerAlpha);
const alphaUpperChar = oneOf(chars.upperAlpha);
const alphaChar = oneOf(Array.concat(chars.lowerAlpha, chars.upperAlpha));
const numericChar = oneOf(chars.numeric);
const alphaNumericChar = oneOf(Array.concat(chars.numeric, chars.lowerAlpha, chars.upperAlpha));

function charSeqOf(charSet, minLen = 1, maxLen = 10) {
  if (Array.isArray(charSet))
    throw 'charSet is not array.';
  if (minLen < 0)
    throw 'minLen is negative.';

  const lenSelector = choose(minLen, maxLen);
  return {
    gen() {
      const len = lenSelector.gen();
      return arrayOfN(len, charSet).gen().join();
    }
  };
}

function identifier(minLen = 1, maxLen = 10) {
  if (minLen < 0)
    throw 'minLen is negative.';

  const head = alphaChar;

  if (maxLen > 1) {
    const numericCharSeq = charSeqOf(numericChar, 1, maxLen-1);
    return {
      gen: () => head.gen() + numericCharSeq.gen()
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

const Gen = {
  choose,
  oneOf,
  arrayOfN,
  bool,
  charSeqOf,
  identifier,
  numericStr,
  posNum,
  negNum,
  
  IntArbitrary,
  FloatArbitrary,
  ArrayArbitrary,
  ObjectArbitrary
};
