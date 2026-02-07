# Deployment Guide - windy.luxury

This guide explains how to deploy your e-commerce application with:

- **Frontend**: Vercel (free hosting)
- **Backend**: Render (free tier with keep-alive ping)
- **Database**: MongoDB Atlas (free cluster) or Render MongoDB

---

## 📋 Prerequisites

1. **GitHub Account** - Push your code to a GitHub repository
2. **Vercel Account** - Sign up at https://vercel.com
3. **Render Account** - Sign up at https://render.com
4. **MongoDB Atlas Account** - Sign up at https://mongodb.com/atlas (optional)

---

## 🗄️ MongoDB Options

### Option 1: MongoDB Atlas (Recommended - Free Tier)

1. **Create MongoDB Atlas Account**
   - Go to https://mongodb.com/atlas
   - Create a free account and cluster

2. **Create Database User**
   - In Atlas: Database Access → Add New Database User
   - Username: `windyadmin`
   - Password: Generate a strong password (save it!)

3. **Network Access**
   - Network Access → Add IP Address
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for development
   - For production, add your Vercel/Render IPs

4. **Get Connection String**
   - Database → Connect → Connect your application
   - Copy the connection string:

   ```
   mongodb+srv://windyadmin:<password>@cluster0.xxxxx.mongodb.net/windyluxury?retryWrites=true&w=majority
   ```

   - Replace `<password>` with your actual password

5. **Update .env File**
   ```
   MONGODB_URI=mongodb+srv://windyadmin:yourpassword@cluster0.xxxxx.mongodb.net/windyluxury?retryWrites=true&w=majority
   ```

### Option 2: Render MongoDB (Built-in)

1. In Render Dashboard: New → PostgreSQL/MongoDB
2. Select MongoDB plan (free)
3. Render will provide connection details automatically
4. Add to Render service environment variables

---

## 🚀 Backend Deployment on Render

### Step 1: Deploy Backend

1. **Push Code to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to https://dashboard.render.com
   - New → Web Service
   - Connect your GitHub repository
   - Configure:
     - Name: `windy-backend`
     - Root Directory: `.` (leave empty)
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Environment: `Node`
     - Plan: `Free`

3. **Environment Variables**
   Add these in Render Dashboard → Environment:

   ```
   NODE_ENV=production
   RENDER=true
   MONGODB_URI=your_mongodb_connection_string_here
   PORT=10000
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://windy-backend.onrender.com`

### Step 2: Keep Server Awake (Ping Mechanism)

Render's free tier sleeps after 15 minutes of inactivity. The backend includes an auto-ping mechanism:

1. **Auto-Ping Setup**
   - The server automatically pings itself every 14 minutes
   - Set `BACKEND_URL` environment variable:

   ```
   BACKEND_URL=https://your-backend-service.onrender.com
   ```

2. **Alternative: External Ping Service**
   - Use a free cron service like:
     - https://cron-job.org (free)
     - https://uptimerobot.com (free)
   - Configure to ping `https://your-backend.onrender.com/ping` every 14 minutes

3. **Health Check**
   - Endpoint: `https://your-backend.onrender.com/ping`
   - Should return: `{"status":"alive","timestamp":"...","uptime":...}`

---

## 🌐 Frontend Deployment on Vercel

### Step 1: Deploy Frontend

1. **Go to Vercel**
   - Go to https://vercel.com
   - Click "Add New..." → Project
   - Import your GitHub repository

2. **Configure Environment Variables**
   In Vercel Dashboard → Settings → Environment Variables:

   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

   - Replace `your-backend.onrender.com` with your actual Render backend URL

3. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Note your frontend URL: `https://your-project.vercel.app`

### Step 2: Update Backend URL in JavaScript

After getting your Render backend URL, update:

- `index.js` - Already configured with `import.meta.env.VITE_API_URL`
- `admin.js` - Already configured with `import.meta.env.VITE_API_URL`

Set these in Vercel environment variables as shown above.

---

## 🔄 Final Configuration Steps

### 1. Update .env for Local Development

Create a `.env` file in your project root:

```env
# For local development
MONGODB_URI=mongodb://localhost:27017
VITE_API_URL=http://localhost:4000/api
```

### 2. Test Locally

```bash
npm install
npm start
```

Visit:

- Frontend: http://localhost:4000
- Admin: http://localhost:4000/admin
- API: http://localhost:4000/api/products
- Ping: http://localhost:4000/ping

### 3. Deploy Updates

1. **Push changes to GitHub**

   ```bash
   git add .
   git commit -m "Update"
   git push
   ```

2. **Vercel** will auto-deploy frontend changes

3. **Render** will auto-deploy backend changes

---

## 📝 API Endpoints

After deployment, your API will be available at:
`https://your-backend.onrender.com/api`

| Method | Endpoint          | Description                 |
| ------ | ----------------- | --------------------------- |
| GET    | /api/products     | Get all products            |
| POST   | /api/products     | Create product              |
| PUT    | /api/products/:id | Update product              |
| DELETE | /api/products/:id | Delete product              |
| GET    | /api/categories   | Get categories              |
| GET    | /api/settings     | Get settings                |
| PUT    | /api/settings     | Update settings             |
| GET    | /api/orders       | Get orders                  |
| POST   | /api/orders       | Create order                |
| PUT    | /api/orders/:id   | Update order                |
| GET    | /ping             | Keep awake (returns status) |

---

## 🖼️ Image Upload

**Important for Production:**

- Render's free tier has ephemeral filesystem (files deleted on restart)
- For production with file uploads, consider:
  1. Cloudinary (free tier)
  2. AWS S3 (free tier)
  3. Upload to MongoDB (GridFS)

The current implementation stores uploads locally, which works for development but may lose files on Render restarts.

---

## 💰 Cost Summary

| Service             | Free Tier       | Notes                                    |
| ------------------- | --------------- | ---------------------------------------- |
| Vercel              | Unlimited       | Perfect for static frontend              |
| Render              | 750 hours/month | Backend sleeps after 15 min without ping |
| MongoDB Atlas       | 512 MB          | Shared cluster, free forever             |
| Cron Job (external) | Free            | Keep backend awake                       |

**Estimated Monthly Cost: $0** ✅

---

## 🔧 Troubleshooting

### Backend returns 404 on Vercel

- Vercel is for static files. Use Render for backend.

### MongoDB connection failed

- Check your connection string in Render environment variables
- Ensure IP whitelist includes Render's IPs (0.0.0.0/0 for testing)

### Server keeps sleeping

- Verify `BACKEND_URL` is set
- Check cron-job.org is pinging every 14 minutes
- Verify `/ping` endpoint returns 200

### CORS errors

- Ensure CORS is configured in server.js (already enabled)
- Check frontend URL is allowed

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
