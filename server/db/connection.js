const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",                   // Navicat connection
  host: "localhost",                 
  database: "PulsePointDBProject",    // DB
  password: "RiyadunNabi2205076",
  port: 5432,
});

module.exports = pool;

