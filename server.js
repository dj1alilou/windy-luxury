const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure multer for image uploads
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Database file path
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
  storePhone: "+213 774 72 75 59",
  storeEmail: "",
  storeAddress: "Alger, Algérie",
  deliveryWilayas: [
    { name: "Alger", homePrice: 400, officePrice: 300 },
    { name: "Blida", homePrice: 500, officePrice: 400 },
    { name: "Tipaza", homePrice: 600, officePrice: 500 },
    { name: "Boumerdes", homePrice: 600, officePrice: 500 },
    { name: "Oran", homePrice: 1000, officePrice: 800 },
    { name: "Constantine", homePrice: 1200, officePrice: 1000 },
    { name: "Annaba", homePrice: 1300, officePrice: 1100 },
    { name: "Tizi Ouzou", homePrice: 800, officePrice: 600 },
    { name: "Sétif", homePrice: 1000, officePrice: 800 },
    { name: "Batna", homePrice: 1100, officePrice: 900 },
  ],
};

// Initialize database file
function initDatabase() {
  const dataDir = path.dirname(DB_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      products: [],
      categories: defaultCategories,
      settings: defaultSettings,
      orders: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    console.log("Database initialized");
  }
}

// Read database
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return {
      products: [],
      categories: defaultCategories,
      settings: defaultSettings,
      orders: [],
    };
  }
}

// Write database
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
}

// Initialize database on startup
initDatabase();

// ==================== API ROUTES ====================

// GET all products
app.get("/api/products", (req, res) => {
  const db = readDatabase();
  const status = req.query.status;
  let products = db.products || [];

  if (status) {
    products = products.filter((p) => p.status === status);
  }

  res.json(products);
});

// GET single product
app.get("/api/products/:id", (req, res) => {
  const db = readDatabase();
  const product = (db.products || []).find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

// POST create product with image upload
app.post("/api/products", upload.single("image"), (req, res) => {
  const db = readDatabase();

  // Parse sizes from JSON string
  let sizes = [];
  if (req.body.sizes) {
    try {
      sizes = JSON.parse(req.body.sizes);
    } catch (e) {
      console.error("Error parsing sizes:", e);
    }
  }

  const product = {
    id: Date.now().toString(),
    name: req.body.name || req.body.title || "",
    title: req.body.title || req.body.name || "",
    category: req.body.category || "",
    price: parseFloat(req.body.price) || 0,
    stock: parseInt(req.body.stock) || 0,
    description: req.body.description || "",
    image: req.file ? `/uploads/${req.file.filename}` : req.body.image || "",
    status: req.body.status || "active",
    createdAt: new Date().toISOString(),
  };

  // Add sizes if provided
  if (sizes.length > 0) {
    product.sizes = sizes;
  }

  if (!product.name) {
    return res.status(400).json({ error: "Product name is required" });
  }

  if (!db.products) db.products = [];
  db.products.push(product);
  writeDatabase(db);

  res.status(201).json(product);
});

// PUT update product
app.put("/api/products/:id", upload.single("image"), (req, res) => {
  const db = readDatabase();
  if (!db.products) db.products = [];
  const index = db.products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Parse sizes from JSON string
  let sizes = [];
  if (req.body.sizes) {
    try {
      sizes = JSON.parse(req.body.sizes);
    } catch (e) {
      console.error("Error parsing sizes:", e);
    }
  }

  db.products[index] = {
    ...db.products[index],
    name: req.body.name || db.products[index].name,
    title:
      req.body.title || db.products[index].title || db.products[index].name,
    category: req.body.category || db.products[index].category,
    price: req.body.price
      ? parseFloat(req.body.price)
      : db.products[index].price,
    stock: req.body.stock ? parseInt(req.body.stock) : db.products[index].stock,
    description: req.body.description || db.products[index].description,
    updatedAt: new Date().toISOString(),
  };

  // Update sizes if provided
  if (sizes.length > 0) {
    db.products[index].sizes = sizes;
  } else {
    // Remove sizes if empty string is sent
    delete db.products[index].sizes;
  }

  // Update image if new one uploaded
  if (req.file) {
    db.products[index].image = `/uploads/${req.file.filename}`;
  }

  writeDatabase(db);
  res.json(db.products[index]);
});

// DELETE product
app.delete("/api/products/:id", (req, res) => {
  const db = readDatabase();
  if (!db.products) db.products = [];
  const index = db.products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Delete associated image file
  const product = db.products[index];
  if (product.image) {
    const imagePath = path.join(__dirname, product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  db.products.splice(index, 1);
  writeDatabase(db);

  res.json({ success: true });
});

// ==================== CATEGORIES ====================

// GET all categories
app.get("/api/categories", (req, res) => {
  const db = readDatabase();
  res.json(db.categories || defaultCategories);
});

// ==================== SETTINGS ====================

// GET settings
app.get("/api/settings", (req, res) => {
  const db = readDatabase();
  res.json(db.settings || defaultSettings);
});

// PUT update settings
app.put("/api/settings", (req, res) => {
  const db = readDatabase();
  db.settings = { ...db.settings, ...req.body };
  writeDatabase(db);
  res.json(db.settings);
});

// ==================== ORDERS ====================

// GET all orders
app.get("/api/orders", (req, res) => {
  const db = readDatabase();
  res.json(db.orders || []);
});

// POST create order
app.post("/api/orders", (req, res) => {
  const db = readDatabase();
  const order = {
    id: Date.now().toString(),
    ...req.body,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  if (!db.orders) db.orders = [];
  db.orders.push(order);
  writeDatabase(db);

  res.status(201).json(order);
});

// PUT update order
app.put("/api/orders/:id", (req, res) => {
  const db = readDatabase();
  if (!db.orders) db.orders = [];
  const index = db.orders.findIndex((o) => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  db.orders[index] = {
    ...db.orders[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  writeDatabase(db);
  res.json(db.orders[index]);
});

// DELETE order
app.delete("/api/orders/:id", (req, res) => {
  const db = readDatabase();
  if (!db.orders) db.orders = [];
  const index = db.orders.findIndex((o) => o.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  db.orders.splice(index, 1);
  writeDatabase(db);
  res.json({ success: true });
});

// ==================== STATS ====================

// GET stats
app.get("/api/stats", (req, res) => {
  const db = readDatabase();
  res.json({
    productsCount: (db.products || []).length,
    ordersCount: (db.orders || []).length,
    categoriesCount: (db.categories || defaultCategories).length,
    pendingOrdersCount: (db.orders || []).filter((o) => o.status === "pending")
      .length,
  });
});

// Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve admin.html for /admin
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
