require("dotenv").config();

// Connection string to connect to the database
const sql = require("postgres")(process.env.DATABASE_URL);

// Test the connection to the database
const testConnection = async () => {
  try {
    await sql`SELECT 1 AS result`;
    console.log("✅ Connection to database successful");
  } catch (error) {
    console.error("❌ Connection to database failed:", error);
    throw error;
  }
};

module.exports = { sql, testConnection };
