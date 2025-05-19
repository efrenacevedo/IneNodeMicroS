const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'inemicroservice-efrenacevedo08-1df7.h.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_JuVskEpoXMxqSWNU6ZT',
  database: 'defaultdb',
  port: 11523,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;