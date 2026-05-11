const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log("Connected to SQL Server được r nhe ");
  } catch (err) {
    console.error("coi kỹ lại coi sai dì ròi:", err);
  }
}

module.exports = { sql, connectDB };