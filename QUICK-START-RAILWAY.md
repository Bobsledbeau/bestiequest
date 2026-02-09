# 🚂 Deploy BestieQuest to Railway - Quick Start

## ⚡ Fastest Deployment Path

Railway is the easiest platform for full-stack Node.js + PostgreSQL apps.

---

## 📋 Prerequisites

- Railway account (sign up at https://railway.app/)
- Your downloaded `kids_story_app` folder
- Abacus AI API key (for story generation)

---
## 🚀 Deployment Steps

### 1. Create Railway Account

1. Go to: https://railway.app/
2. Click "Start a New Project"
3. Sign up with GitHub

### 2. Create New Project

1. Click "New Project"
2. Select "Empty Project"
3. Name it: `bestiequest`

### 3. Add PostgreSQL Database

1. Click "+ New" button
2. Select "Database"
3. Choose "PostgreSQL"
4. Wait for provisioning (~30 seconds)
5. Railway automatically provides `DATABASE_URL`

### 4. Deploy Your Backend

#### Option A: From GitHub (Recommended)

1. Push your code to GitHub:
   ```bash
   cd kids_story_app
   git init
   git add .
   git commit -m "BestieQuest app"
   gh repo create bestiequest --private --source=. --push
   ```

2. In Railway:
   - Click "+ New"
   - Select "GitHub Repo"
   - Choose your repository
   - Root directory: `/nodejs_space`

#### Option B: From Local Files

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Link project:
   ```bash
   cd kids_story_app/nodejs_space
   railway link
   ```

4. Deploy:
   ```bash
   railway up
   ```

### 5. Configure Environment Variables

1. Click on your service
2. Go to "Variables" tab
3. Add these variables:

```env
ABACUSAI_API_KEY=your_api_key_here
NODE_ENV=production
PORT=3000
```

**Note:** `DATABASE_URL` is automatically provided by Railway!

### 6. Configure Build Settings

1. Go to "Settings" tab
2. Set **Build Command**:
   ```bash
   npm install && npm run build
   ```

3. Set **Start Command**:
   ```bash
   node dist/main.js
   ```

4. **Watch Paths:** `/nodejs_space`

### 7. Run Database Migration

1. In Railway dashboard, click on your service
2. Go to "Deployments" tab
3. Click on latest deployment
4. Click "View Logs"
5. Wait for build to complete
6. In "Settings" → "Run Command":
   ```bash
   npx prisma migrate deploy
   ```

OR use Railway CLI:
```bash
railway run npx prisma migrate deploy
```

### 8. Get Your App URL

1. Go to "Settings" tab
2. Under "Domains", Railway provides:
   - Default: `bestiequest-production.up.railway.app`
3. Test it: `https://your-app.up.railway.app/health`
4. Should return: `{"status":"ok",...}`

### 9. Add Custom Domain

1. In "Settings" → "Domains"
2. Click "Custom Domain"
3. Enter: `bestiequest.co.za`
4. Railway shows DNS instructions
5. At your domain registrar, add CNAME:
   ```
   Type: CNAME
   Name: @
   Value: your-app.up.railway.app
   TTL: 3600
   ```
6. Wait for DNS propagation (5-30 minutes)
7. Railway auto-provisions SSL certificate

### 10. Test Your App!

1. Visit: `https://bestiequest.co.za`
2. Should see your PWA homepage
3. Test story generation
4. Install as PWA on phone

---

## ✅ Verification Checklist

- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Backend deployed
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Health check works: `/health`
- [ ] API works: `/api/items`
- [ ] Frontend loads
- [ ] Story generation works
- [ ] Custom domain connected
- [ ] SSL certificate active
- [ ] PWA installs on phone

---

## 💰 Costs

**Railway Pricing:**
- **Free Trial:** $5 credit (lasts ~1 month for this app)
- **Paid:** $5 minimum per month
- **Usage-based:** ~$5-10/month typical for this app size

**What's included:**
- PostgreSQL database
- SSL certificates
- Custom domains
- Automatic deployments
- 99.9% uptime

---

## 🔧 Common Issues

### Build fails:
```bash
# Check logs in Railway dashboard
# Usually missing dependencies
# Fix: Ensure package.json is correct
```

### Database connection fails:
```bash
# Railway auto-injects DATABASE_URL
# Check it's not overridden in your .env
# Verify Prisma schema is correct
```

### App won't start:
```bash
# Check start command is: node dist/main.js
# Verify build completed successfully
# Check logs for errors
```

---

## 🎯 Next Steps

1. **Monitor Performance**
   - Railway dashboard shows metrics
   - Check response times
   - Monitor database usage

2. **Setup Keep-Warm** (Optional)
   - Railway doesn't sleep containers on paid plans
   - Free trial might sleep after inactivity
   - Use UptimeRobot (free) to ping every 5 min

3. **Backup Database**
   ```bash
   railway run pg_dump > backup.sql
   ```

---

## 🚀 You're Live!

Your BestieQuest app is now running on Railway!

**Your URLs:**
- Production: `https://bestiequest.co.za`
- Railway URL: `https://your-app.up.railway.app`
- API Docs: `https://bestiequest.co.za/api-docs`
- Health: `https://bestiequest.co.za/health`

Enjoy your deployed app! 💜✨
