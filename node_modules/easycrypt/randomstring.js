const allCapsAlpha = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const allLowerAlpha = [...'abcdefghijklmnopqrstuvwxyz'];
const allUniqueChars = [...'~!@#$%^&*()_+-=[]\\{}|;,./<>?'];
const allNumbers = [...'0123456789'];
const symbols = [
  ...allCapsAlpha,
  ...allNumbers,
  ...allLowerAlpha,
  ...allUniqueChars,
];

const generator = (base, len) => [...Array(len)]
  .map(() => base[Math.random() * base.length | 0]) // eslint-disable-line no-bitwise
  .join('');

module.exports = len => generator(symbols, len);
