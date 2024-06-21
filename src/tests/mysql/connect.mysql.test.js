const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "test",
});

const batchSize = 100000;
const totalSize = 1_000_000;

let currentId = 1;
const insertBatch = () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId < totalSize; i++) {
  }
};
