# 🚀 KSRTC Bus Tracker - Deployment Guide

## Pre-Deployment Checklist

Before deploying, ensure you have:
- ✅ Node.js 18.x or higher installed
- ✅ A Vercel account (sign up at https://vercel.com)
- ✅ A MongoDB Atlas account (sign up at https://www.mongodb.com/cloud/atlas)
- ✅ Git installed on your system

## Step-by-Step Deployment

### Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account
   - Create a new organization and project

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a cloud provider and region (closest to your users)
   - Click "Create Cluster"

3. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

4. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Grant "Read and write to any database" role
   - Click "Add User"

5. **Get Connection String**
   - Go back to "Database" (Clusters)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Save this connection string for later

### Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 3: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

### Step 4: Deploy the Application

1. **Navigate to your project directory**
   ```bash
   cd /path/to/bus-tracker
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Answer the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **ksrtc-bus-tracker** (or your choice)
   - In which directory is your code located? **./** (press Enter)

4. **Wait for deployment** - Vercel will build and deploy your app

### Step 5: Add Environment Variables

1. **Add MongoDB URI to Vercel**
   ```bash
   vercel env add MONGODB_URI production
   ```

2. **Paste your MongoDB connection string** when prompted

3. **Redeploy to apply environment variables**
   ```bash
   vercel --prod
   ```

### Step 6: Access Your Application

Your app is now live! You'll get three URLs:

- **Production URL**: `https://your-project.vercel.app`
- **Main Tracker**: `https://your-project.vercel.app/`
- **Driver App**: `https://your-project.vercel.app/driver.html`
- **Admin Dashboard**: `https://your-project.vercel.app/admin.html`

## Testing the Deployment

### Test 1: API Endpoints

```bash
# Test location API
curl https://your-project.vercel.app/api/location

# Should return: [] (empty array, no buses yet)
```

### Test 2: Open Driver App

1. Open `https://your-project.vercel.app/driver.html` in your mobile browser
2. Enter test data:
   - Bus Number: TEST-001
   - Route: TEST-ROUTE
   - Driver ID: TEST-DRIVER
   - Depot: Thiruvananthapuram
3. Click "Start Tracking"
4. Allow location permissions

### Test 3: View on Main Tracker

1. Open `https://your-project.vercel.app/` in another browser tab
2. You should see the test bus appear on the map
3. Select it from the dropdown to track it

### Test 4: Check Admin Dashboard

1. Open `https://your-project.vercel.app/admin.html`
2. You should see statistics and the test bus listed

## Custom Domain Setup (Optional)

### Add Custom Domain to Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" > "Domains"
4. Add your custom domain
5. Follow DNS configuration instructions

### Configure DNS

Add these DNS records to your domain provider:

**For root domain (example.com):**
```
Type: A
Name: @
Value: 76.76.19.19
```

**For subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Environment Variables Management

### View current environment variables:
```bash
vercel env ls
```

### Add new environment variable:
```bash
vercel env add VARIABLE_NAME
```

### Pull environment variables for local development:
```bash
vercel env pull .env.local
```

## Monitoring and Logs

### View deployment logs:
```bash
vercel logs
```

### View real-time logs:
```bash
vercel logs --follow
```

### Check deployment status:
```bash
vercel inspect
```

## Troubleshooting

### Issue: MongoDB connection failed

**Solution:**
1. Check if IP whitelist includes 0.0.0.0/0
2. Verify connection string is correct
3. Ensure password doesn't contain special characters (use URL encoding if needed)
4. Check MongoDB cluster is running

### Issue: API returns 500 error

**Solution:**
1. Check Vercel logs: `vercel logs`
2. Verify MONGODB_URI environment variable is set
3. Test MongoDB connection string locally
4. Check MongoDB Atlas logs

### Issue: Driver app not tracking

**Solution:**
1. Ensure location permissions are granted
2. Check if GPS is enabled on device
3. Use HTTPS (required for geolocation API)
4. Check browser console for errors

### Issue: Buses not appearing on map

**Solution:**
1. Wait 5-10 seconds for auto-refresh
2. Click "Refresh Buses" button
3. Check if bus is within 10-minute activity window
4. Verify API endpoints are working

## Performance Optimization

### MongoDB Indexes

Add indexes for better performance:

```javascript
// In MongoDB Atlas > Collections
db.locations.createIndex({ "timestamp": -1 })
db.locations.createIndex({ "busId": 1 })
db.buses.createIndex({ "busId": 1 })
```

### Enable Auto-cleanup

The system automatically removes buses that haven't updated in 10 minutes. You can adjust this in `api/location.js`:

```javascript
// Change 10 minutes to your desired value
const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
```

## Security Enhancements

### Add API Key Authentication

1. **Add API_KEY to environment variables:**
   ```bash
   vercel env add API_KEY production
   # Enter a strong random string
   ```

2. **Update API files** (api/location.js, api/buses.js, api/routes.js):
   ```javascript
   // Add at the beginning of module.exports
   const API_KEY = process.env.API_KEY;
   
   if (req.method !== 'OPTIONS' && req.headers['x-api-key'] !== API_KEY) {
     return res.status(401).json({ error: 'Unauthorized' });
   }
   ```

3. **Update driver.html to include API key:**
   ```javascript
   await fetch(API_URL, {
     method: 'POST',
     headers: { 
       'Content-Type': 'application/json',
       'x-api-key': 'your-api-key-here'
     },
     body: JSON.stringify({...})
   });
   ```

## Maintenance

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Redeploy
vercel --prod
```

### Monitor Database Size

1. Check MongoDB Atlas dashboard
2. Monitor document count in collections
3. Set up alerts for storage limits

### Backup Strategy

MongoDB Atlas automatically backs up your data, but you can:
1. Export collections manually from Atlas
2. Set up automated backups via Atlas
3. Store backups in separate cloud storage

## Production Checklist

Before going live:

- [ ] MongoDB cluster is created and configured
- [ ] Environment variables are set in Vercel
- [ ] All API endpoints are tested
- [ ] Driver app works on mobile devices
- [ ] Main tracker displays buses correctly
- [ ] Admin dashboard shows accurate data
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is active (automatic with Vercel)
- [ ] Monitoring and logging are set up
- [ ] Team members have access to Vercel dashboard
- [ ] Documentation is shared with drivers and administrators

## Scaling Considerations

For high-traffic deployments:

1. **Upgrade MongoDB Cluster**: Move from M0 (free) to M10+ for better performance
2. **Add Caching**: Implement Redis for frequently accessed data
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **CDN**: Vercel automatically uses CDN for static assets
5. **Database Sharding**: For 1000+ buses, consider MongoDB sharding

## Support and Help

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com/
- **Leaflet.js Docs**: https://leafletjs.com/reference.html

## Next Steps

After successful deployment:

1. **Train Drivers**: Show them how to use driver.html
2. **Test with Real Data**: Have a few drivers test the system
3. **Monitor Performance**: Check logs and database metrics
4. **Gather Feedback**: Get input from users
5. **Iterate**: Make improvements based on feedback

---

🎉 **Congratulations! Your KSRTC Bus Tracker is now live!** 🎉

For any issues, check the logs and troubleshooting section above.
