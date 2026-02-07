require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB Connection
let db = null;
let mongoClient = null;

async function connectMongoDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log("📦 No MONGODB_URI found - using file-based storage");
    return false;
  }

  try {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    db = mongoClient.db("windyluxury");
    console.log("✅ Connected to MongoDB Atlas");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    return false;
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure multer for multiple image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
});

// Database file path (fallback)
const DB_FILE = path.join(__dirname, "data", "products.json");

// Default categories
const defaultCategories = [
  { id: "1", name: "Parure", icon: "fas fa-layer-group", status: "active" },
  { id: "2", name: "Bracelet", icon: "fas fa-band-aid", status: "active" },
  { id: "3", name: "Bague", icon: "fas fa-ring", status: "active" },
  { id: "4", name: "Boucles", icon: "fas fa-gem", status: "active" },
  { id: "5", name: "Montre", icon: "fas fa-clock", status: "active" },
  { id: "6", name: "Collier", icon: "fas fa-necklace", status: "active" },
];

// Default settings
const defaultSettings = {
  storeName: "windy.luxury",
  contactPhone: "+213 XXX XXXXXX",
  contactEmail: "contact@windy.luxury",
  deliveryInfo: "Livraison partout en Algérie",
  wilayas: [
    { name: "Adrar", homePrice: 600, officePrice: 500 },
    { name: "Chlef", homePrice: 500, officePrice: 400 },
    { name: "Laghouat", homePrice: 550, officePrice: 450 },
    { name: "Oum El Bouaghi", homePrice: 550, officePrice: 450 },
    { name: "Batna", homePrice: 500, officePrice: 400 },
    { name: "Béjaïa", homePrice: 500, officePrice: 400 },
    { name: "Biskra", homePrice: 550, officePrice: 450 },
    { name: "Blida", homePrice: 400, officePrice: 350 },
    { name: "Bouira", homePrice: 450, officePrice: 350 },
    { name: "Tamanrasset", homePrice: 800, officePrice: 700 },
    { name: "Tébessa", homePrice: 600, officePrice: 500 },
    { name: "Tlemcen", homePrice: 550, officePrice: 450 },
    { name: "Tiaret", homePrice: 500, officePrice: 400 },
    { name: "Tizi Ouzou", homePrice: 450, officePrice: 350 },
    { name: "Algiers", homePrice: 350, officePrice: 300 },
    { name: "Djelfa", homePrice: 550, officePrice: 450 },
    { name: "Médéa", homePrice: 450, officePrice: 350 },
    { name: "Mostaganem", homePrice: 500, officePrice: 400 },
    { name: "M'Sila", homePrice: 550, officePrice: 450 },
    { name: "Mascara", homePrice: 500, officePrice: 400 },
    { name: "Ouargla", homePrice: 600, officePrice: 500 },
    { name: "Oran", homePrice: 450, officePrice: 350 },
    { name: "El Bayadh", homePrice: 600, officePrice: 500 },
    { name: "Illizi", homePrice: 800, officePrice: 700 },
    { name: "Bordj Bou Arréridj", homePrice: 500, officePrice: 400 },
    { name: "Boumerdès", homePrice: 450, officePrice: 350 },
    { name: "El Tarf", homePrice: 550, officePrice: 450 },
    { name: "Tindouf", homePrice: 800, officePrice: 700 },
    { name: "Tissemsilt", homePrice: 500, officePrice: 400 },
    { name: "El Oued", homePrice: 600, officePrice: 500 },
    { name: "Khenchela", homePrice: 550, officePrice: 450 },
    { name: "Souk Ahras", homePrice: 550, officePrice: 450 },
    { name: "Tipaza", homePrice: 400, officePrice: 350 },
    { name: "Mila", homePrice: 450, officePrice: 350 },
    { name: "Aïn Defla", homePrice: 450, officePrice: 350 },
    { name: "Naâma", homePrice: 600, officePrice: 500 },
    { name: "Aïn Témouchent", homePrice: 500, officePrice: 400 },
    { name: "Ghardaïa", homePrice: 600, officePrice: 500 },
    { name: "Relizane", homePrice: 500, officePrice: 400 },
    { name: "Timimoun", homePrice: 700, officePrice: 600 },
    { name: "Bordj Badji Mokhtar", homePrice: 800, officePrice: 700 },
    { name: "Ouled Djellal", homePrice: 600, officePrice: 500 },
    { name: "Béni Abbès", homePrice: 700, officePrice: 600 },
    { name: "In Salah", homePrice: 800, officePrice: 700 },
    { name: "In Guezzam", homePrice: 900, officePrice: 800 },
    { name: "Touggourt", homePrice: 650, officePrice: 550 },
    { name: "Djanet", homePrice: 900, officePrice: 800 },
    { name: "El M'Ghair", homePrice: 600, officePrice: 500 },
    { name: "Meniaa", homePrice: 600, officePrice: 500 },
  ],
};

// File-based database functions (fallback)
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {
      products: [],
      categories: defaultCategories,
      settings: defaultSettings,
      orders: [],
    };
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
}

async function initDatabase() {
  const useMongo = await connectMongoDB();

  if (useMongo) {
    // Initialize MongoDB collections
    await db.collection("categories").createIndex({ id: 1 }, { unique: true });
    await db.collection("settings").createIndex({ _id: 1 });

    // Seed categories if empty
    const categoriesCount = await db.collection("categories").countDocuments();
    if (categoriesCount === 0) {
      await db
        .collection("categories")
        .insertMany(defaultCategories.map((c) => ({ ...c, _id: c.id })));
    }

    // Seed settings if empty
    const settingsCount = await db.collection("settings").countDocuments();
    if (settingsCount === 0) {
      await db
        .collection("settings")
        .insertOne({ _id: "main", ...defaultSettings });
    }
  } else {
    // File-based fallback
    const dbData = readDatabase();
    if (!dbData.categories || dbData.categories.length === 0) {
      dbData.categories = defaultCategories;
    }
    if (!dbData.settings) {
      dbData.settings = defaultSettings;
    }
    writeDatabase(dbData);
  }

  return useMongo;
}

// ==================== PRODUCTS ====================

// GET all products
app.get("/api/products", async (req, res) => {
  try {
    if (db) {
      const status = req.query.status;
      let query = {};
      if (status) query.status = status;
      const products = await db.collection("products").find(query).toArray();
      return res.json(products);
    } else {
      const dbData = readDatabase();
      let products = dbData.products || [];
      if (req.query.status) {
        products = products.filter((p) => p.status === req.query.status);
      }
      return res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create product with multiple images
app.post("/api/products", upload.array("images", 5), async (req, res) => {
  try {
    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // If existing images were passed as JSON string, merge them
    if (req.body.existingImages) {
      try {
        const existingImages = JSON.parse(req.body.existingImages);
        images = [...existingImages, ...images];
      } catch (e) {}
    }

    // Set main image as first image, or use existing
    let mainImage = req.body.mainImage || "";
    if (!mainImage && images.length > 0) {
      mainImage = images[0];
    }

    const product = {
      id: Date.now().toString(),
      name: req.body.name,
      title: req.body.title || req.body.name,
      category: req.body.category,
      price: parseFloat(req.body.price) || 0,
      stock: parseInt(req.body.stock) || 0,
      description: req.body.description || "",
      image: mainImage, // Main image for backward compatibility
      images: images, // All images array
      status: req.body.status || "active",
      createdAt: new Date().toISOString(),
    };

    // Parse sizes
    if (req.body.sizes) {
      try {
        product.sizes = JSON.parse(req.body.sizes);
      } catch (e) {
        product.sizes = [];
      }
    }

    if (db) {
      await db.collection("products").insertOne(product);
    } else {
      const dbData = readDatabase();
      if (!dbData.products) dbData.products = [];
      dbData.products.push(product);
      writeDatabase(dbData);
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update product with multiple images
app.put("/api/products/:id", upload.array("images", 5), async (req, res) => {
  try {
    const productId = req.params.id;
    let sizes = [];

    if (req.body.sizes) {
      try {
        sizes = JSON.parse(req.body.sizes);
      } catch (e) {}
    }

    // Process new uploaded images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Merge with existing images
    let allImages = [];
    if (req.body.existingImages) {
      try {
        const existingImages = JSON.parse(req.body.existingImages);
        allImages = [...existingImages, ...newImages];
      } catch (e) {
        allImages = newImages;
      }
    } else {
      allImages = newImages;
    }

    // Determine main image
    let mainImage = req.body.mainImage;
    if (!mainImage && allImages.length > 0) {
      mainImage = allImages[0];
    }

    const updateData = {
      name: req.body.name,
      title: req.body.title || req.body.name,
      category: req.body.category,
      price: parseFloat(req.body.price) || 0,
      stock: parseInt(req.body.stock) || 0,
      description: req.body.description,
      image: mainImage,
      images: allImages,
      updatedAt: new Date().toISOString(),
    };

    if (sizes.length > 0) {
      updateData.sizes = sizes;
    }

    if (db) {
      await db
        .collection("products")
        .updateOne({ id: productId }, { $set: updateData });
      const updated = await db
        .collection("products")
        .findOne({ id: productId });
      return res.json(updated);
    } else {
      const dbData = readDatabase();
      const index = dbData.products.findIndex((p) => p.id === productId);
      if (index === -1) {
        return res.status(404).json({ error: "Product not found" });
      }

      dbData.products[index] = { ...dbData.products[index], ...updateData };
      writeDatabase(dbData);
      return res.json(dbData.products[index]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    if (db) {
      await db.collection("products").deleteOne({ id: productId });
    } else {
      const dbData = readDatabase();
      const index = dbData.products.findIndex((p) => p.id === productId);
      if (index === -1) {
        return res.status(404).json({ error: "Product not found" });
      }
      dbData.products.splice(index, 1);
      writeDatabase(dbData);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CATEGORIES ====================

app.get("/api/categories", async (req, res) => {
  try {
    if (db) {
      const categories = await db.collection("categories").find({}).toArray();
      return res.json(categories);
    } else {
      const dbData = readDatabase();
      return res.json(dbData.categories || defaultCategories);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SETTINGS ====================

app.get("/api/settings", async (req, res) => {
  try {
    if (db) {
      const settings = await db.collection("settings").findOne({ _id: "main" });
      return res.json(settings || defaultSettings);
    } else {
      const dbData = readDatabase();
      return res.json(dbData.settings || defaultSettings);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/settings", async (req, res) => {
  try {
    const settings = {
      ...req.body,
      _id: "main",
      updatedAt: new Date().toISOString(),
    };

    if (db) {
      await db
        .collection("settings")
        .replaceOne({ _id: "main" }, settings, { upsert: true });
    } else {
      const dbData = readDatabase();
      dbData.settings = settings;
      writeDatabase(dbData);
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ORDERS ====================

app.get("/api/orders", async (req, res) => {
  try {
    if (db) {
      const orders = await db
        .collection("orders")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      return res.json(orders);
    } else {
      const ORDERS_FILE = path.join(__dirname, "data", "orders.json");
      try {
        const data = fs.readFileSync(ORDERS_FILE, "utf8");
        const orders = JSON.parse(data);
        return res.json(
          orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        );
      } catch {
        return res.json([]);
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const order = {
      id: Date.now().toString(),
      ...req.body,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (db) {
      await db.collection("orders").insertOne(order);
    } else {
      const ORDERS_FILE = path.join(__dirname, "data", "orders.json");
      let orders = [];
      try {
        const data = fs.readFileSync(ORDERS_FILE, "utf8");
        orders = JSON.parse(data);
      } catch {}
      orders.push(order);
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    if (db) {
      await db
        .collection("orders")
        .updateOne(
          { id: orderId },
          { $set: { ...req.body, updatedAt: new Date().toISOString() } },
        );
      const updated = await db.collection("orders").findOne({ id: orderId });
      return res.json(updated);
    } else {
      const ORDERS_FILE = path.join(__dirname, "data", "orders.json");
      let orders = [];
      try {
        const data = fs.readFileSync(ORDERS_FILE, "utf8");
        orders = JSON.parse(data);
      } catch {}

      const index = orders.findIndex((o) => o.id === orderId);
      if (index === -1) {
        return res.status(404).json({ error: "Order not found" });
      }

      orders[index] = {
        ...orders[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
      return res.json(orders[index]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PING ENDPOINT (Keep Awake) ====================

// Ping endpoint to prevent server from sleeping on Render free tier
app.get("/ping", (req, res) => {
  res.json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Auto-ping mechanism - ping itself every 14 minutes (Render sleeps after 15 min of inactivity)
// Note: This only works if the server has outbound internet access
function startAutoPing() {
  const pingInterval = 14 * 60 * 1000; // 14 minutes in milliseconds

  setInterval(async () => {
    try {
      const backendUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
      const response = await fetch(`${backendUrl}/ping`);
      if (response.ok) {
        console.log(`✅ Auto-ping successful at ${new Date().toISOString()}`);
      } else {
        console.log(`⚠️ Auto-ping failed with status: ${response.status}`);
      }
    } catch (error) {
      console.log(`⚠️ Auto-ping error: ${error.message}`);
    }
  }, pingInterval);

  console.log(`🔄 Auto-ping enabled (every ${pingInterval / 60000} minutes)`);
}

// ==================== SERVE HTML FILES ====================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// ==================== START SERVER ====================

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Storage: ${db ? "MongoDB Atlas" : "File-based (local)"}`);

    // Start auto-ping only in production (Render)
    if (process.env.RENDER || process.env.NODE_ENV === "production") {
      startAutoPing();
    }
  });
});
