const path = require('path');
const {
  connection
} = require(path.join(__dirname, './db'));

const connectionWrapper = async (cb) => {
  let conn;
  try {
    conn = await connection;
  } catch (err) {
    console.error('error connecting: ' + err.stack)
  }

  return await cb(conn);
}

module.exports = {
  connectionWrapper
}
