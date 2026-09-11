# Production Deployment Guide: Render, Vercel & Cron Keep-Awake

This guide covers step-by-step instructions for deploying the **NETRA / TrustID AI** platform to production:
- **Backend (FastAPI)** on [Render](https://render.com) using Docker.
- **Frontend (React + Vite)** on [Vercel](https://vercel.com).
- **Keep-Awake Cron Job** to prevent Render's free tier from sleeping after 15 minutes of inactivity.

---

## 1. Deploy Backend on Render

Render's free tier is ideal for FastAPI, and using our preconfigured Dockerfile ensures that system dependencies (`tesseract-ocr`, `libgl1`, and OpenCV C++ bindings) are installed automatically.

### Step 1.1: Create a Web Service
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `manaschouksey/Netra-AI`.
4. Configure the service settings:
   - **Name**: `netra-backend` (or your preferred name).
   - **Region**: Choose the closest region (e.g. Frankfurt / Oregon / Singapore).
   - **Branch**: `main`.
   - **Root Directory**: `backend`.
   - **Runtime / Environment**: **Docker** (Select Docker runtime).
   - **Instance Type**: **Free**.

### Step 1.2: Set Environment Variables
In the **Environment Variables** section on Render, add:
- `PROJECT_NAME`: `TRUSTID AI`
- `VERSION`: `1.0.0`
- `ALLOWED_ORIGINS`: `https://your-frontend-app.vercel.app,http://localhost:5173` *(You can update this after getting your Vercel URL)*

### Step 1.3: Deploy and Note the URL
1. Click **Create Web Service**.
2. Render will build the Docker container and start Uvicorn.
3. Once the build finishes, copy your live backend URL (e.g., `https://netra-backend.onrender.com`).
4. Test the health endpoint: `https://netra-backend.onrender.com/health` -> should return `{"status":"healthy"}`.

---

## 2. Deploy Frontend on Vercel

Vercel provides blazing-fast edge CDN hosting for Vite and React applications.

### Step 2.1: Import Project to Vercel
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your GitHub repository: `manaschouksey/Netra-AI`.

### Step 2.2: Configure Build & Output Settings
- **Framework Preset**: `Vite` (automatically detected).
- **Root Directory**: Click `Edit` and select **`frontend`**.
- **Build Command**: `npm run build` (default).
- **Output Directory**: `dist` (default).
- **Install Command**: `npm install` (default).

### Step 2.3: Set Environment Variables
Under the **Environment Variables** tab, add:
- **Key**: `VITE_API_URL`
- **Value**: `https://netra-backend.onrender.com` *(Use your actual Render backend URL from Step 1)*

### Step 2.4: Deploy
1. Click **Deploy**.
2. Vercel will build the frontend in ~20-30 seconds and assign a production domain (e.g. `https://netra-ai.vercel.app`).
3. Now go back to **Render** -> Environment Variables -> update `ALLOWED_ORIGINS` to include your new Vercel domain!

---

## 3. Keep-Awake Cron Job (Prevent Free Render Inactivity Sleep)

Render free instances spin down after **15 minutes of inactivity**, which causes a 40–50 second cold-start delay on the next request. A cron job pings the `/health` endpoint every 10–12 minutes to keep the instance warm 24/7.

### Option A: GitHub Actions Cron (Pre-configured in Repository)
We included a workflow file at `.github/workflows/keep_alive.yml`.

1. Go to your GitHub repository: `https://github.com/manaschouksey/Netra-AI`.
2. Go to **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.
3. Name: `RENDER_BACKEND_URL`
4. Value: `https://netra-backend.onrender.com` *(your live Render backend URL)*
5. Click **Add secret**.
6. The workflow will automatically ping `/health` every 12 minutes!

### Option B: Free External Cron Service (cron-job.org / UptimeRobot)
1. Register at [cron-job.org](https://cron-job.org) (100% free).
2. Click **Create Cronjob**.
3. **Title**: `Keep Netra Backend Awake`
4. **URL**: `https://netra-backend.onrender.com/health`
5. **Execution Schedule**: **Every 10 minutes** (`*/10 * * * *`).
6. **Request Method**: `GET`.
7. Click **Create**.
