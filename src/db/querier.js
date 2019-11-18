const query = (conn, q) => {
  return new Promise((res, rej) => conn.query(q, (err, results) => {
    if (err) rej(err);
    res(results);
  }));
}

function recBuilder(recObj) {
  const out = {};
  if (typeof recObj === "function") {
    return function (obj) {
      return (conn) => query(conn, recObj(obj));
    }
  } else if (typeof recObj === "object") {
    for (const prop in recObj) {
      out[prop] = recBuilder(recObj[prop]);
    }
  } else {
    throw new Error("type must be object or function");
  }
  return out;
}

const path = require('path');
const {
  sqlManager
} = require(path.join(__dirname, './imports'));

const querier = recBuilder(sqlManager);

module.exports = {
  query,
  querier
}
