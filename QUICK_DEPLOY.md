# ⚡ Quick Deploy Commands

## One-Time Setup

```bash
# 1. Push to GitHub
cd c:\Users\aziz\aziz
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/fitness-duel.git
git push -u origin main
```

## Then:

1. **Railway.app** (Backend):
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub"
   - Select `apps/backend`
   - Set env: `PORT=3001`, `NODE_ENV=production`
   - Generate domain → Copy URL

2. **Vercel** (Frontend):
   - Go to https://vercel.com
   - Click "Import Project"
   - Select `apps/web`
   - Set env: `NEXT_PUBLIC_API_URL=<railway-url>`
   - Deploy

3. **Update CORS**:
   - In Railway, add env: `CORS_ORIGIN=<vercel-url>`

## Future Updates

```bash
git add .
git commit -m "Update"
git push
```

Auto-deploys to both! ✅
