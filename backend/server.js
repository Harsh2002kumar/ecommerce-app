const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
const db = new sqlite3.Database("db.sqlite", (err) => {
  if (err) {
    console.error("Failed to connect to the SQLITE DB:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});
app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      console.error("Error fetching products:", err.message);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.json(rows);
    }
  });
});

app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  const query = "SELECT * FROM products WHERE id = ?";
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Error fetching product:", err.message);
      res.status(500).json({ error: "internal server error" });
    } else if (!row) {
      res.status(404).json({ error: "product not found" });
    } else {
      res.json(row);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
