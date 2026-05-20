const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function connectDB() {
  try {
    const client = await pool.connect();
    console.log("Connected to Supabase PostgreSQL được r nhe");
    client.release();
  } catch (err) {
    console.error("coi kỹ lại coi sai dì ròi:", err);
    throw err;
  }
}
module.exports = { pool, connectDB };
