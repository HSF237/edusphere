# ZeroWaste (0W) - Production Deployment Guide 🚀

This is the Elite Engine repository for ZeroWaste, a dual-layer SaaS platform utilizing the MERN stack with modern Glassmorphism UX to reduce inventory shrinkage.

## Security Overview (Zero-Trust Architecture)
- **JWT Protection:** All dashboard and inventory routes strictly require a Bearer token.
- **Tenant Isolation:** Every Database read/write is inherently filtered by `shopID: req.user.id`. Impossible to leak data across shops.
- **Headers & Payload Optimization:** Utilizing `Helmet` for active header protection against XSS/Sniffing, and `Compression` for Gzip optimization over bad 4G network locations.

## Local Docker Deployment
1. Install Docker & Docker Compose.
2. Run `docker-compose up -d --build`.
3. The platform will boot up with a dedicated instance of MongoDB and Node.js.

## Cloud Deployment Strategy

### 1. Backend (Railway or Render)
These platforms natively support Node+Express codebases and MongoDB Add-ons!
- Create a Free MongoDB Atlas Cluster (or use Railway's built-in MongoDB plugin).
- Connect this GitHub Repo to **Railway**.
- Set the following **Environment Variables**:
  ```
  NODE_ENV=production
  PORT=5000
  JWT_SECRET=your_super_complex_secret!@#
  MONGO_URI=mongodb+srv://user:pass@cluster....
  ```
- Make sure your build command is `npm install` and your run command is `npm start`.

### 2. Frontend (Vercel)
Vercel is the top-tier CDN for React Vite frontends.
- Navigate to the `/frontend` directory and create a separate GitHub repository for your frontend (or push the entire monorepo as one and set the Root Directory in Vercel to `frontend`).
- Connect to Vercel.
- Override the build commands (Vercel usually hits this automatically for Vite):
  - Framework Preset: `Vite`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- IMPORTANT: Within Vercel Settings, set your Environment Variables (like `VITE_API_URL`) to point to your live Railway backend:
  `VITE_API_URL=https://your-railway-app-name.up.railway.app`

## Monetization "Paywall" Logics
- The Guardian Engine runs via `node-cron`. 
- **Free users:** Will get logs directly inside the app suggesting them to *"Upgrade to Pro for WhatsApp Alerts"*.
- **Premium users:** (`isPremium: true` in the MongoDB `Shop` collection) get URL-friendly deep-links generated into their dashboard AND sent via WhatsApp directly!
