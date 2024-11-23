const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Set the templating engine
app.set("view engine", "ejs");

// Debugging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Authentication Middleware
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Routes
app.get("/login", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/");
  }
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error("Error retrieving user:", err.message);
      res.render("login", { error: "An error occurred. Please try again." });
    } else if (!user) {
      res.render("login", { error: "Invalid username or password." });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          req.session.userId = user.id;
          res.redirect("/");
        } else {
          res.render("login", { error: "Invalid username or password." });
        }
      });
    }
  });
});

app.get("/", isAuthenticated, (req, res) => {
  res.render("index", { title: "Landing Page" });
});

app.get("/orders", isAuthenticated, (req, res) => {
  const userId = req.session.userId;
  db.all("SELECT * FROM orders WHERE user_id = ?", [userId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving orders");
    } else {
      res.render("orders", { title: "Orders", orders: rows });
    }
  });
});

app.get("/analytics", isAuthenticated, (req, res) => {
  res.render("analytics", { title: "Analytics" });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/login");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

