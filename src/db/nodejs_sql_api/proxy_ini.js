const fs = require('fs');
const path = require('path');
const ini = require('ini');
const { format } = require(path.join(__dirname, './ini_utils.js'));

const iniObj = {};

fs.readdirSync(path.join(__dirname, './sql_ini'))
  .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file.slice(-4) === ".ini");
  })
  .forEach(function (file) {
    const name = file.split('_')[0];
    iniObj[name] = ini.parse(fs.readFileSync(path.join(__dirname, 'sql_ini', file), 'utf-8'));
  })

function recBuilder(recObj) {
  const out = {};
  if (typeof recObj === "object") {
    if ('q' in recObj) {
      const params = recObj.params.split(',');
      const ownKeys = JSON.stringify(params);
      return function (obj) {
        const objKeys = JSON.stringify(Object.keys(obj));
        if (ownKeys !== objKeys) throw new Error("Keys do not match");
        return format(recObj.q)(obj);
      }
    } else {
      for (const prop in recObj) {
        out[prop] = recBuilder(recObj[prop]);
      }
    }
  } else {
    throw new Error("type of obj must be object");
  }
  return out;
}

module.exports = recBuilder(iniObj);
