const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const csv = require("csv-parser");
const db = new sqlite3.Database("db.sqlite", (err) => {
  if (err) {
    console.error("error opening databse", err.message);
  } else {
    console.log("database opened");
  }
});
db.serialize(() => {
  db.run("DROP TABLE IF EXISTS products");
  db.run(
    "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, cost REAL, category TEXT, name TEXT, brand TEXT, retail_price REAL, department TEXT, sku TEXT, distribution_center_id INTEGER)"
  );
});
const stmt = db.prepare(
  "INSERT INTO products(id,name,price,department,description) VALUES (?, ?, ?, ?, ?)"
);
fs.createReadStream("products.csv")
  .pipe(csv())
  .on("data", (row) => {
    stmt.run(
      Number(row.id),
      Number(row.cost),
      row.category,
      row.name,
      row.brand,
      Number(row.retail_price),
      row.department,
      row.sku,
      Number(row.distribution_center_id)
    );
  })
  .on("end", () => {
    stmt.finalize();
    db.close();
    console.log("CSV loaded into SQLite");
  });
