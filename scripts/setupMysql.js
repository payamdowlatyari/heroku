const fs = require('fs');
const path = require('path');

const {
  query,
  connectionWrapper
} = require(path.join(__dirname, '../src/db'));

const sql = fs.readFileSync(path.join(__dirname, '../src/db/nodejs_sql_api/setup.sql'), 'utf-8')
              .split("\n")
              .filter(e => e !== "")
              .join("");

async function setup() {
  const out = await connectionWrapper((conn) => query(conn, sql));
  await connectionWrapper((conn) => conn.end());
  return out;
}

setup().then(e => {
  console.log(e); process.exit();
}).catch(e => console.log(e));
