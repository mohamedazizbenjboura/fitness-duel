# 🚀 Deployment Guide for Fitness Duel (duelfit.live)

## Prerequisites (All FREE - No Credit Card Needed)
- GitHub account
- Vercel account (sign up with GitHub)
- Railway.app account (sign up with GitHub)

---

## Step 1: Push to GitHub (5 minutes)

1. **Initialize Git** (if not already done):
```bash
cd c:\Users\aziz\aziz
git init
git add .
git commit -m "Initial commit - Fitness Duel App"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Name: `fitness-duel`
   - Make it Public or Private (your choice)
   - Click "Create repository"

3. **Push your code**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/fitness-duel.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway.app (3 minutes)

1. **Go to Railway.app**:
   - Visit https://railway.app
   - Click "Login with GitHub"
   - Authorize Railway

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `fitness-duel` repository
   - Select `apps/backend` directory

3. **Configure Environment**:
   - Railway will auto-detect the Dockerfile
   - Add environment variable: `PORT=3001`
   - Add: `NODE_ENV=production`
   - Click "Deploy"

4. **Get Backend URL**:
   - After deployment, click "Settings"
   - Click "Generate Domain"
   - Copy URL (e.g., `https://fitness-duel-backend.railway.app`)

---

## Step 3: Deploy Frontend to Vercel (3 minutes)

1. **Go to Vercel**:
   - Visit https://vercel.com
   - Click "Sign Up with GitHub"
   - Authorize Vercel

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select `fitness-duel` repository
   - Framework: Next.js (auto-detected)
   - Root Directory: `apps/web`

3. **Configure Environment**:
   - Add environment variable:
     - Name: `NEXT_PUBLIC_API_URL`
     - Value: `https://your-backend.railway.app` (from Step 2)
   - Click "Deploy"

4. **Get Frontend URL**:
   - After deployment, you'll get: `https://fitness-duel.vercel.app`
   - Copy this URL

---

## Step 4: Update CORS Settings

1. **Go back to Railway.app**:
   - Open your backend project
   - Add environment variable:
     - Name: `CORS_ORIGIN`
     - Value: `https://fitness-duel.vercel.app` (from Step 3)
   - Save and redeploy

---

## Step 5: Add Custom Domain (Optional)

### For Frontend (Vercel):
1. In Vercel project settings → "Domains"
2. Add `duelfit.live`
3. Follow DNS configuration instructions

### For Backend (Railway):
1. In Railway project settings → "Settings"
2. Add custom domain
3. Update DNS records

---

## 🎉 You're Live!

Your app is now deployed:
- **Frontend**: https://fitness-duel.vercel.app
- **Backend**: https://fitness-duel-backend.railway.app

---

## Troubleshooting

### Backend won't start:
- Check Railway logs
- Ensure `PORT` environment variable is set
- Verify `packages/shared` is built

### Frontend can't connect:
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

### WebRTC not working:
- HTTPS is required for WebRTC (Vercel/Railway provide this)
- Check browser permissions for camera/mic

---

## Environment Variables Summary

### Backend (Railway):
```
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://fitness-duel.vercel.app
```

### Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://fitness-duel-backend.railway.app
```

---

## Updates & Redeployment

Any push to `main` branch will automatically redeploy:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Both Vercel and Railway will auto-deploy! 🚀
