const mysql = require('mysql2');

const connections = {};

const connect = conn => {
  return new Promise((res, rej) => conn.connect((err) => err ? rej(err) : res()));
}

async function connection(opts) {
  const strPort = `${opts.port}`;
  const host = `${opts.host}`;
  if(!host) throw new Error("No hast provided in options");

  let promise;
  let conn = mysql.createConnection(opts);
  if(strPort) connections[host] || (connections[host] = {});
  conn = mysql.createConnection(opts);
  try {
    await connect(conn);
  } catch (error) {
    error = "Could not connect to database connection: " + host;
    if(strPort) {
      error += " " + strPort;
    }
    throw new Error(error);
  }
  promise = new Promise(res => res(conn));
  if(strPort) {
    connections[host][strPort] = promise;
  } else {
    connections[host] = promise;
  }
  return connections[host][strPort];
}

module.exports = connection;