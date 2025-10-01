# 🚀 KSRTC Bus Tracker - Quick Reference Card

## URLs

| Page | URL | Purpose |
|------|-----|---------|
| Main Tracker | `https://your-domain.vercel.app/` | View all buses |
| Driver App | `https://your-domain.vercel.app/driver.html` | Track bus location |
| Admin Dashboard | `https://your-domain.vercel.app/admin.html` | Monitor fleet |

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/location` | GET | Get all active buses |
| `/api/location` | POST | Update bus location |
| `/api/location` | DELETE | Remove bus |
| `/api/buses` | GET | Get registered buses |
| `/api/buses` | POST | Register bus |
| `/api/routes` | GET | Get all routes |
| `/api/routes` | POST | Add/update route |

## Environment Variables

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
```

## Deployment Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Add environment variable
vercel env add MONGODB_URI

# View logs
vercel logs
```

## Driver Instructions (One Page)

### Setup (First Time Only)
1. Open: `https://your-domain.vercel.app/driver.html`
2. Add to home screen (optional but recommended)
3. Allow location permissions when asked

### Daily Use
1. **Start of Shift:**
   - Enter Bus Number (e.g., KL-01-AB-1234)
   - Enter Route Number (e.g., TVM-EKM-001)
   - Enter Your Driver ID
   - Select Your Depot
   - Tap "Start Tracking"

2. **During Shift:**
   - Keep phone charged
   - Keep app open
   - App updates automatically

3. **End of Shift:**
   - Tap "Stop Tracking"
   - Close app

### Troubleshooting
- **Not updating?** Check GPS is on
- **Permission error?** Allow location in Settings
- **App closes?** Save to home screen
- **Battery dying?** Use car charger

## Admin Dashboard Guide

### Statistics Cards
- **Active Buses**: Currently tracking
- **Total Buses**: All registered
- **Active Routes**: Number of routes
- **Last Update**: System update time

### Actions
- Click "Refresh" to update data
- Click bus row to view details
- Auto-updates every 10 seconds

## Technical Specs

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Leaflet.js 1.9.4
- No build tools needed
- PWA ready

### Backend
- Node.js 18.x
- MongoDB 6.x
- Vercel Serverless Functions
- REST API

### Database
- **Collections**: locations, buses, routes
- **Auto-cleanup**: 10 minutes inactive
- **Indexes**: timestamp, busId

### Updates
- Driver app: Real-time (3-5s)
- Main tracker: 5 seconds
- Admin dashboard: 10 seconds

## File Structure

```
bus-tracker/
├── api/
│   ├── location.js     # Location API
│   ├── buses.js        # Bus registry
│   └── routes.js       # Routes API
├── public/
│   ├── index.html      # Main tracker
│   ├── driver.html     # Driver app
│   ├── admin.html      # Admin panel
│   └── manifest.json   # PWA config
├── package.json        # Dependencies
├── vercel.json         # Vercel config
└── .env.local.example  # Env template
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Buses not showing | Check MongoDB connection |
| Location not updating | Enable GPS, check permissions |
| Deployment failed | Check environment variables |
| 500 error | Check Vercel logs |
| Map not loading | Check internet connection |
| Driver app closes | Add to home screen |

## MongoDB Setup Quick Steps

1. Create account at mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Add IP: 0.0.0.0/0 (allow all)
4. Create database user
5. Get connection string
6. Add to Vercel env

## Browser Requirements

| Browser | Min Version |
|---------|-------------|
| Chrome | 90+ |
| Safari | 14+ |
| Firefox | 88+ |
| Edge | 90+ |

## Device Requirements

- **OS**: Android 8.0+ or iOS 13.0+
- **Internet**: 3G/4G/5G or WiFi
- **GPS**: Must be enabled
- **Battery**: Keep charged

## Depot List

1. Thiruvananthapuram
2. Kochi
3. Kozhikode
4. Thrissur
5. Kollam
6. Palakkad
7. Kannur
8. Alappuzha
9. Kottayam

## API Request Examples

### Update Location
```bash
curl -X POST https://your-domain.vercel.app/api/location \
  -H "Content-Type: application/json" \
  -d '{
    "busId": "KSRTC_KL-01-AB-1234",
    "lat": 10.8505,
    "lng": 76.2711,
    "speed": 45,
    "heading": 180,
    "driverId": "DR123",
    "routeNumber": "TVM-EKM-001",
    "busNumber": "KL-01-AB-1234"
  }'
```

### Get All Buses
```bash
curl https://your-domain.vercel.app/api/location
```

### Register Bus
```bash
curl -X POST https://your-domain.vercel.app/api/buses \
  -H "Content-Type: application/json" \
  -d '{
    "busNumber": "KL-01-AB-1234",
    "routeNumber": "TVM-EKM-001",
    "depot": "Thiruvananthapuram",
    "driverId": "DR123"
  }'
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (missing fields) |
| 401 | Unauthorized (if auth enabled) |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 500 | Server Error |

## Color Reference

```css
Primary:   #667eea
Secondary: #764ba2
Success:   #10b981
Danger:    #ef4444
Warning:   #f59e0b
Info:      #3b82f6
Gray:      #9ca3af
```

## Update Intervals

| Component | Interval |
|-----------|----------|
| Driver GPS | 3-5 seconds |
| Main tracker | 5 seconds |
| Admin panel | 10 seconds |
| Auto-cleanup | On each request |
| Inactive timeout | 10 minutes |

## Performance Tips

1. Use MongoDB indexes
2. Enable caching
3. Upgrade to paid MongoDB tier for production
4. Monitor Vercel usage
5. Optimize images (if added)
6. Enable gzip compression (automatic)

## Security Checklist

- [ ] MongoDB user created
- [ ] IP whitelist configured
- [ ] Environment variables set
- [ ] HTTPS enabled (automatic)
- [ ] Connection string secure
- [ ] No credentials in code
- [ ] API key added (optional)

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com/
- **Leaflet Docs**: https://leafletjs.com/reference.html
- **MDN Web Docs**: https://developer.mozilla.org/

## License

MIT License - Open Source

## Version

Current: 2.0.0
Status: Production Ready

---

**Print this page for quick reference!**

Last Updated: 2024
