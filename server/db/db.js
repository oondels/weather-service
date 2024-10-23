const path = require("path");
const sqlite3 = require("sqlite3");

const dbPath = path.resolve(__dirname, "database.db");

const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error("Error connecting to database");
  } else {
    console.log("Conected to database");
  }
});

module.exports = db;
