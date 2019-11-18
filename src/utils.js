const throwError = (text) => {
  throw new Error(text);
}

const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
// const allUniqueChars = [..."~!@#$%^&*()_+-=[]\{}|:,./<>?"];
const allNumbers = [..."0123456789"];

const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha ];

const stringGenerator = (base, len) => {
  return [...Array(len)]
    .map(i => base[Math.random() * base.length | 0])
    .join('');
}

const existsHelper = (arr) => {
  return arr[0][Object.keys(arr[0])[0]] === 1;
}

module.exports = {
  throwError,
  ranstr: (len) => stringGenerator(base, len),
  existsHelper
}
