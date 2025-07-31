db.run(
  "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, cost REAL, category TEXT, name TEXT, brand TEXT, retail_price REAL, department TEXT, sku TEXT, distribution_center_id INTEGER)"
);
