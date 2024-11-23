const bcrypt = require("bcrypt");

const plainPassword = "yourpassword"; // Replace with your desired password

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed password:", hash);
  }
});
