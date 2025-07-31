const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const csv = require("csv-parser");

const db = new sqlite3.Database("db.sqlite");

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS products");
  db.run(`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY,
      name TEXT,
      price REAL,
      department TEXT,
      description TEXT
    )
  `);

  const stmt = db.prepare(
    "INSERT INTO products (id, name, price, department, description) VALUES (?, ?, ?, ?, ?)"
  );

  fs.createReadStream("products.csv")
    .pipe(csv())
    .on("data", (row) => {
      stmt.run(row.id, row.name, row.price, row.department, row.description);
    })
    .on("end", () => {
      stmt.finalize();
      db.close();
      console.log("CSV loaded into SQLite");
    });
});
