const { MongoClient } = require("mongodb");

// Try using DNS over HTTPS via node-fetch or similar
async function testConnection() {
  console.log("Testing MongoDB connection...");

  const uri =
    process.env.MONGODB_URI ||
    "mongodb+srv://windyadmin:hamoudihadil123@windy-cluster.dr4qj3p.mongodb.net/?appName=windy-cluster";

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();
    console.log("SUCCESS! Connected to MongoDB Atlas!");
    await client.db("windyluxury").command({ ping: 1 });
    console.log("Ping successful!");
    return true;
  } catch (err) {
    console.log("FAILED:", err.message);
    return false;
  } finally {
    await client.close();
  }
}

testConnection();
