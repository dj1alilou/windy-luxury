# Step-by-Step Guide: Setting Up Firebase for windy.luxury

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `windy-luxury`
4. Disable Google Analytics (optional)
5. Wait for project creation

## Step 2: Enable Firestore Database

1. In Firebase Console, click "Build" > "Firestore Database"
2. Click "Create database"
3. Choose location (e.g., europe-west1)
4. Select "Start in test mode" (for development)
5. Click "Enable"

## Step 3: Get Firebase Config

1. In Firebase Console, click the gear icon ⚙️ > "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>` to add a web app
4. Register app (give it a name like "windy-luxury-web")
5. Copy the `firebaseConfig` object

## Step 4: Update firebase-config.js

Open [`firebase-config.js`](firebase-config.js) and replace with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "windy-luxury.firebaseapp.com",
  projectId: "windy-luxury",
  storageBucket: "windy-luxury.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const db = firebase.firestore();
const auth = firebase.auth();
```

## Step 5: Create Firestore Collections

Go to Firestore Database in Firebase Console and create these collections:

### Collection: `settings`

Document ID: `store`
Add fields:

- `storeName`: "windy.luxury"
- `storePhone`: "+213 774 72 75 59"
- `storeEmail`: ""
- `storeAddress`: "Alger, Algérie"
- `storeDescription`: "Bijoux de luxe pour votre élégance quotidienne"
- `deliveryDays`: 2
- `deliveryWilayas`: array of objects
- `maintenanceMode`: false
- `acceptOrders`: true
- `adminUsername`: "admin"
- `adminPassword`: "admin123"

### Collection: `categories`

Add documents with fields:

- `id`: "1", "2", etc.
- `name`: "Parure", "Bracelet", etc.
- `icon`: "fas fa-layer-group", etc.
- `description`: "Ensembles de bijoux", etc.
- `status`: "active"

### Collection: `products`

Add documents with fields:

- `name`: "Product Name"
- `category`: "Parure"
- `price`: 1000
- `stock`: 10
- `description`: "Product description"
- `image`: "https://example.com/image.jpg"
- `status`: "active"
- `colors`: array of objects (optional)

## Step 6: Test the Site

1. Open `index.html` in a browser
2. You should see products loaded from Firebase
3. Pagination shows 10 products per page

## Step 7: Delete Old MongoDB Products (Optional)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login with: `windyluxury19` / `hadil2026`
3. Click "Database" > "Browse Collections"
4. Select the `products` collection
5. Click "Delete Collection" to remove all products
6. Repeat for `orders`, `categories`, etc.

## Step 8: Deploy to Firebase Hosting (Optional)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init`
4. Deploy: `firebase deploy`

---

## Pagination Feature

The site now includes **10 products per page** pagination. You can adjust this in [`index.js`](index.js:10):

```javascript
let productsPerPage = 10;
```

The pagination controls will automatically appear when there are more than 10 products.
