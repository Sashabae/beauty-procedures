require("dotenv").config();

const app = require("./app");

const { sql, testConnection } = require("./db");

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // Test the database connection
    await testConnection();
    // Start the server
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    process.exit(1);
  }

  // This code listens for the SIGINT signal
  process.on("SIGINT", async () => {
    console.log("Closing database connections...");
    await sql.end();
    process.exit(0);
  });
};

start();
