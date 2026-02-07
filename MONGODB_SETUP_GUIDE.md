# MongoDB Atlas Setup Guide for windy.luxury

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Get Started Free"
3. Sign up with your email (or Google/GitHub account)

## Step 2: Create Free Cluster

1. After signing in, click "Create a Cluster"
2. **Choose Cloud Provider**: Select "AWS" (recommended)
3. **Choose Region**: Select a region near you (e.g., "Frankfurt (eu-central-1)" for Europe)
4. **Cluster Tier**: Select "M0 Sandbox" (FREE)
5. **Cluster Name**: Rename to "windy-cluster" (or leave default)
6. Click "Create Cluster" (at the bottom)

## Step 3: Create Database User

1. Click "Database" → "Access Manager" → "Database Users"
2. Click "Add New Database User"
3. **Username**: `windyadmin`
4. **Password**: Generate a strong password (copy it!)
5. **Confirm Password**: Paste the same password
6. **User Privileges**: "Read and write to any database"
7. Click "Add User"

## Step 4: Configure Network Access (IMPORTANT!)

1. Click "Network Access" → "IP Access List"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String

1. Click "Database" → "Clusters" → "Connect"
2. Select "Connect your application"
3. **Driver**: Select "Node.js" and version "4.1 or later"
4. Click "Copy" to copy the connection string

The connection string looks like:

```
mongodb+srv://windyadmin:<password>@windy-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Add Password to Connection String

Replace `<password>` with your actual password from Step 3.

Example:

```
mongodb+srv://windyadmin:MyStrongPassword123@windy-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 7: Update .env File

1. Open `.env` file in your project
2. Add this line:

```
MONGODB_URI=mongodb+srv://windyadmin:YOUR_PASSWORD@windy-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

3. Save the file

## Step 8: Test Connection Locally

```bash
# First, install MongoDB driver
npm install mongodb

# Then start your server locally
npm start
```

If it works, you'll see products loading from MongoDB!

## Step 9: Add MONGODB_URI to Render

1. Go to Render.com → Your Web Service → "Environment"
2. Click "Add Environment Variable"
3. **Key**: `MONGODB_URI`
4. **Value**: Paste your full MongoDB connection string
5. Click "Save Changes"

Render will automatically redeploy.

## Step 10: Verify It's Working

1. Go to your storefront: https://windy-luxury.onrender.com/
2. Check admin panel: https://windy-luxury.onrender.com/admin
3. Create a test order
4. Check if order appears and persists after refresh

---

## Troubleshooting

### "Connection failed" error?

- Check if IP address is allowed (Step 4)
- Check if username/password is correct
- Make sure cluster is not "paused" (free tiers can pause after inactivity)

### "Database not found" error?

- The database will be created automatically when you first save data

### Want to view your data?

1. Go to MongoDB Atlas → "Clusters" → "Collections"
2. You can see all products and orders there

---

## Security Notes

⚠️ **Important**:

- Never share your MongoDB password
- The `.env` file should NOT be committed to GitHub
- If you accidentally committed it, change your password in MongoDB Atlas
