const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("./database/sales_tracker.db");

const username = "admin";
const plainPassword = "yourpassword";

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash],
      (err) => {
        if (err) {
          console.error("Error inserting user into database:", err.message);
        } else {
          console.log("User added successfully!");
        }
      }
    );
    db.close();
  }
});
