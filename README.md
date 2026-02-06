# windy.luxury - E-commerce Website

A Node.js + Express e-commerce website for jewelry and accessories.

## Step-by-Step Deployment to Render.com

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" button in the top right corner → "New repository"
3. Repository name: `windy-luxury`
4. Select "Public" or "Private"
5. Click "Create repository"
6. Copy the repository URL (e.g., `https://github.com/yourusername/windy-luxury.git`)

### Step 2: Push Your Project to GitHub

Open terminal in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - windy.luxury with Express backend"

# Add GitHub repository
git remote add origin https://github.com/YOURUSERNAME/windy-luxury.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Create Render Account

1. Go to [Render.com](https://render.com)
2. Click "Get Started" or "Sign Up"
3. Sign up with your GitHub account (easiest)

### Step 4: Create a New Web Service

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository:
   - Click "Connect GitHub"
   - Select your `windy-luxury` repository
   - Click "Connect"

### Step 5: Configure the Web Service

Fill in the following settings:

| Field              | Value                         |
| ------------------ | ----------------------------- |
| **Name**           | `windy-luxury`                |
| **Branch**         | `main`                        |
| **Root Directory** | (leave empty)                 |
| **Build Command**  | `npm install`                 |
| **Start Command**  | `node server.js`              |
| **Instance Type**  | Free (or your preferred tier) |

### Step 6: Environment Variables

If you need environment variables:

1. Click "Advanced" at the bottom
2. Click "Add Environment Variables"
3. Add any variables from your `.env` file
4. Click "Create Web Service"

### Step 7: Wait for Deployment

Render will:

1. Clone your repository
2. Install dependencies (`npm install`)
3. Build and start the server
4. Show a URL when ready (e.g., `https://windy-luxury.onrender.com`)

### Step 8: Update API URLs

After deployment, you need to update the API URL in **two files**:

**File: `index.js`** (line 4)

```javascript
// Change from:
API_BASE: "http://localhost:4000/api",

// To (use your Render URL):
API_BASE: "https://your-app-name.onrender.com/api",
```

**File: `admin.js`** (line 4)

```javascript
// Change from:
API_BASE: "http://localhost:4000/api",

// To (use your Render URL):
API_BASE: "https://your-app-name.onrender.com/api",
```

### Step 9: Commit and Push Changes

```bash
git add .
git commit -m "Update API URLs for production"
git push
```

Render will automatically redeploy with the new URLs.

### Step 10: Test Your Website

- Storefront: `https://your-app-name.onrender.com/`
- Admin Panel: `https://your-app-name.onrender.com/admin`
- Admin Login: username `admin`, password `windy123`

## Local Development

```bash
npm install
npm start
```

Visit http://localhost:4000

## Features

- Product catalog with categories
- Size selection (14-20) with stock management
- Shopping cart
- Order management
- Admin panel
- Algerian wilayas delivery pricing
- Image upload support

## Project Structure

```
windy-luxury/
├── server.js           # Express server
├── package.json        # Dependencies
├── index.js            # Storefront JavaScript
├── admin.js            # Admin panel JavaScript
├── index.html          # Storefront HTML
├── admin.html          # Admin panel HTML
├── data/
│   └── products.json   # Database
├── uploads/            # Uploaded images
└── images/             # Static images
```
