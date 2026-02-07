require("dotenv").config();
const fs = require("fs");
const { MongoClient } = require("mongodb");

async function migrate() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const db = client.db("windyluxury");

    console.log("Connected to MongoDB");

    // Read products from JSON file
    let products = [];
    try {
      const productsData = fs.readFileSync("data/products.json", "utf8");
      const data = JSON.parse(productsData);
      products = data.products || [];
    } catch (e) {
      console.log("No products file found");
    }

    // Read orders from JSON file
    let orders = [];
    try {
      const ordersData = fs.readFileSync("data/orders.json", "utf8");
      orders = JSON.parse(ordersData);
    } catch (e) {
      console.log("No orders file found");
    }

    // Insert products
    if (products.length > 0) {
      await db.collection("products").deleteMany({}); // Clear existing
      await db.collection("products").insertMany(products);
      console.log("✅ Migrated", products.length, "products to MongoDB");
    } else {
      console.log("No products to migrate");
    }

    // Insert orders
    if (orders.length > 0) {
      await db.collection("orders").deleteMany({}); // Clear existing
      await db.collection("orders").insertMany(orders);
      console.log("✅ Migrated", orders.length, "orders to MongoDB");
    } else {
      console.log("No orders to migrate");
    }

    console.log("🎉 Migration complete! All data is now in MongoDB");
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    await client.close();
  }
}

migrate();
