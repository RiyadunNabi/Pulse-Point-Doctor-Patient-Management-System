const { Pool, types } = require("pg");
require("dotenv").config();

// 2. Define the PostgreSQL Object ID (OID) for the DATE data type.
//    The standard OID for DATE is 1082.
const DATE_OID = 1082;

// 3. Add the type parser override.
//    This tells the 'pg' driver: "When you encounter data of type 1082 (DATE),
//    do not parse it. Just return the raw string value."
types.setTypeParser(DATE_OID, (val) => val);

// const pool = new Pool({
  //   user: "postgres",                   // Navicat connection
  //   host: "localhost",                 
  //   database: "PulsePointDBProject",    // DB
  //   password: "RiyadunNabi2205076",
  //   port: 5432,
  // });
  
  let pool;
  if (process.env.DATABASE_URL) {
  // 🌐 Render or production environment
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // 🖥️ Local development
  pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "PulsePointDBProject",
    password: "RiyadunNabi2205076",
    port: 5432,
  });
}

module.exports = pool;

