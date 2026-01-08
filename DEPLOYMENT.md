# Deployment Guide

## Prerequisites

- Node.js 18+
- npm 9+
- Domain name (optional)
- SSL certificate (for production)
- Cloud hosting account (AWS/Azure/DigitalOcean/Heroku)

## Backend Deployment

### Option 1: Heroku

1. Install Heroku CLI
```bash
heroku login
```

2. Create app
```bash
cd apps/backend
heroku create fitness-duel-api
```

3. Set environment variables
```bash
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
```

4. Deploy
```bash
git push heroku main
```

### Option 2: DigitalOcean App Platform

1. Connect GitHub repository
2. Select `apps/backend` as root directory
3. Set build command: `npm run build`
4. Set run command: `npm start`
5. Add environment variables
6. Deploy!

### Option 3: AWS EC2

1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone repository
```bash
git clone https://github.com/YOUR_USERNAME/fitness-duel.git
cd fitness-duel
npm install
```

5. Build backend
```bash
cd apps/backend
npm run build
```

6. Install PM2
```bash
sudo npm install -g pm2
pm2 start dist/index.js --name fitness-duel-backend
pm2 startup
pm2 save
```

7. Setup Nginx reverse proxy
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/fitness-duel
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/fitness-duel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Web Frontend Deployment

### Option 1: Vercel (Recommended for Next.js)

1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Deploy
```bash
cd apps/web
vercel
```

3. Set environment variables in Vercel dashboard
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=wss://your-api-domain.com
```

### Option 2: Netlify

1. Build the app
```bash
cd apps/web
npm run build
```

2. Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3: AWS S3 + CloudFront

1. Build
```bash
cd apps/web
npm run build
```

2. Upload to S3
```bash
aws s3 sync out/ s3://your-bucket-name
```

3. Configure CloudFront distribution
4. Set up custom domain

## Mobile App Deployment

### iOS (App Store)

1. Build production app
```bash
cd apps/mobile
eas build --platform ios
```

2. Submit to App Store
```bash
eas submit --platform ios
```

### Android (Google Play)

1. Build production app
```bash
cd apps/mobile
eas build --platform android
```

2. Submit to Play Store
```bash
eas submit --platform android
```

## Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Web (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
EXPO_PUBLIC_WS_URL=wss://api.yourdomain.com
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Database Setup (Future)

### PostgreSQL on AWS RDS

1. Create RDS instance
2. Configure security groups
3. Update backend connection string
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## Monitoring

### Backend Logs
```bash
# PM2
pm2 logs fitness-duel-backend

# Heroku
heroku logs --tail -a fitness-duel-api
```

### Error Tracking
- Setup Sentry for error tracking
- Configure alerts

## Performance Optimization

1. Enable gzip compression
2. Use CDN for static assets
3. Implement caching
4. Optimize images
5. Minify code

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Security headers

## Backup Strategy

1. Database backups (automated)
2. Code repository (GitHub)
3. Environment variable backups
4. User data backups

## Scaling

### Horizontal Scaling
- Multiple backend instances
- Load balancer (AWS ELB, Nginx)
- Redis for session management

### Vertical Scaling
- Increase server resources
- Database optimization
- Caching layer

## Rollback Plan

1. Keep previous version deployed
2. Tag releases in Git
3. Quick rollback command:
```bash
# Heroku
heroku rollback

# PM2
pm2 start previous-version
```

## Post-Deployment Checklist

- [ ] All services running
- [ ] SSL certificate valid
- [ ] API endpoints working
- [ ] WebSocket connections stable
- [ ] Mobile apps connecting
- [ ] Error tracking active
- [ ] Monitoring dashboards setup
- [ ] Backup system running
- [ ] Documentation updated

---

**Congratulations! Your Fitness Duel app is live! 🚀**
