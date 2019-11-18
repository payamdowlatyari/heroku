const mysql = require('mysql2');

const connections = {};

const connect = conn => {
  return new Promise((res, rej) => conn.connect((err) => err ? rej(err) : res()));
}

async function connection(opts) {
  const strPort = `${opts.port}`;
  if (!(connections[opts.host] && connections[opts.host][strPort])) {
    
    connections[opts.host] || (connections[opts.host] = {});
    const conn = mysql.createConnection(opts);
    try {
      await connect(conn);
    } catch (error) {
      console.error("Could not connect to database connection: " + opts.host + " " + strPort);
    }
    connections[opts.host][strPort] = new Promise(res => res(conn));
  }
  return connections[opts.host][strPort];
}

module.exports = connection;
