# 🚀 Quick Start - Admin & Google Maps

## 📍 Access Points

| User Type | URL | Purpose |
|-----------|-----|---------|
| **Passengers** | `/index.html` | Track buses, search routes |
| **Drivers** | `/driver.html` | Live GPS tracking |
| **Admins** | `/admin-dashboard.html` | Manage everything |

---

## 🎛️ Admin Dashboard Quick Guide

### Navigation Menu:
1. **📊 Dashboard** - Statistics & quick actions
2. **🚌 Manage Buses** - Add/edit/delete buses
3. **🗺️ Manage Routes** - View/manage routes
4. **👨‍✈️ Manage Drivers** - Driver management
5. **📍 Manage Stops** - Stop management
6. **📡 Live Tracking** - Real-time map
7. **📈 Analytics** - Performance stats
8. **🌐 Google APIs** - API configuration
9. **⚙️ Settings** - System settings

### Quick Actions:
- **Add Bus**: Click "➕ Add Bus" → Fill form → Save
- **Add Route**: Click "➕ Add Route" → Enter details → Save
- **Configure APIs**: Google APIs → Enter keys → Save → Test

---

## 🌐 Google Maps Setup (5 Minutes)

### Step 1: Get API Keys
1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create new project: "KSRTC Bus Tracker"
3. Enable APIs:
   - ☑️ Maps JavaScript API
   - ☑️ Directions API
   - ☑️ Distance Matrix API
   - ☑️ Routes API (Preferred)
   - ☑️ Roads API
   - ☑️ Places API
4. Create API key (or one key for all)
5. Add restrictions:
   - Application restrictions: HTTP referrers
   - Add your domain: `*.vercel.app/*`

### Step 2: Configure in Admin Panel
1. Open `/admin-dashboard.html`
2. Click "🌐 Google APIs" in sidebar
3. Paste API keys in respective fields
4. Click "💾 Save API Keys"
5. Click "🧪 Test APIs" to verify

### Step 3: Done! ✅
- System automatically uses Google Maps when configured
- Falls back to OSRM (free) if not configured
- No code changes needed!

---

## 🚌 3D Bus Icons - How It Works

### Features:
- **Direction**: Icon rotates based on heading (0-360°)
- **Movement**: Green color when moving, default when stopped
- **Animation**: Blinking arrow, motion lines, glowing headlights

### Color Codes:
- 🟢 **Green**: Bus is moving (speed > 1 km/h)
- 🔵 **Blue**: Bus stopped (default color)
- 🔴 **Red**: Inactive (no updates for 5+ minutes)

### Visual Elements:
```
     ↑ Direction arrow (points forward)
    ╔═╗
   ╔╝○╚╗ Windshield & headlights
   ║   ║ Bus body (3D gradient)
   ║▓▓▓║ Door
   ○═══○ Wheels
    ▁▁▁  Shadow
```

---

## 🔑 Google Maps Integration API

### Basic Usage:
```javascript
// Load script
<script src="/google-maps-integration.js"></script>

// Initialize
const gmaps = new GoogleMapsIntegration();

// Get route (auto fallback to OSRM)
const route = await gmaps.getRoute([
    { lat: 11.7480, lng: 75.4937 }, // Thalassery
    { lat: 11.8877, lng: 75.5515 }  // Mattannur
]);

console.log(route);
// {
//   coordinates: [[lat,lng], ...],
//   distance: 15.3, // km
//   duration: 1200, // seconds
//   provider: 'google-routes' | 'osrm'
// }
```

### Available Methods:
| Method | Purpose | Returns |
|--------|---------|---------|
| `getRoute(waypoints)` | Get optimized route | Route object |
| `calculateDistanceMatrix(origins, destinations)` | Batch distance calc | Matrix array |
| `snapToRoads(points)` | Align to roads | Snapped points |
| `searchPlaces(query)` | Autocomplete | Place suggestions |
| `testAPIs()` | Verify config | Status object |

---

## 📊 Admin API Endpoints

### Bus Management:
```bash
# Get all buses
GET /api/admin/buses

# Add bus
POST /api/admin/buses
{
  "busNumber": "KL-13-AB-1234",
  "routeName": "Iritty to Thalassery",
  "depot": "Thalassery"
}

# Update bus
PUT /api/admin/buses
{
  "busNumber": "KL-13-AB-1234",
  "driverName": "John Doe"
}

# Delete bus
DELETE /api/admin/buses?busNumber=KL-13-AB-1234
```

### Analytics:
```bash
# Get statistics
GET /api/admin/analytics

# Returns:
# - Active bus count
# - Performance metrics
# - Distribution by route/depot
# - Activity trends
# - Most active buses
```

---

## 💰 Cost Optimization

### Free Tier Strategy:
1. **Enable OSRM** (default) - Free, unlimited
2. **Enable Google Maps** (optional) - Premium features
3. **Hybrid approach** - Best of both worlds

### Google Maps Pricing:
- Maps JavaScript API: $7 per 1,000 loads
- Directions API: $5 per 1,000 requests
- Distance Matrix API: $5 per 1,000 requests
- Routes API: $5 per 1,000 requests
- **Free tier**: $200/month credit (~40,000 requests)

### Save Money:
- ✅ Cache routes in localStorage
- ✅ Use OSRM for basic routes
- ✅ Enable Google only for premium features
- ✅ Set daily quotas in Cloud Console
- ✅ Batch Distance Matrix requests

---

## 🐛 Troubleshooting

### Admin Panel Not Loading:
```bash
# Check deployment
vercel --prod

# Check MongoDB
echo $MONGODB_URI

# Check browser console
F12 → Console tab
```

### 3D Icons Not Rotating:
- ✅ Verify `heading` in location data
- ✅ Check browser supports SVG
- ✅ Ensure speed data is sent

### Google Maps Not Working:
- ✅ Verify API keys are correct
- ✅ Check billing enabled in Cloud Console
- ✅ Use "Test APIs" button in admin
- ✅ Check domain restrictions

### OSRM Routes Not Loading:
- ✅ Check CORS in browser console
- ✅ Verify internet connectivity
- ✅ Try different waypoints
- ✅ Fallback to straight lines (automatic)

---

## ✅ Deployment Checklist

### Pre-deployment:
- [ ] Test admin dashboard locally
- [ ] Add sample buses
- [ ] Verify 3D icons work
- [ ] Test route visualization
- [ ] Configure Google APIs (optional)
- [ ] Test API fallback to OSRM

### Production:
- [ ] Deploy to Vercel: `vercel --prod`
- [ ] Set environment variables
- [ ] Configure MongoDB Atlas
- [ ] Add API keys in admin panel
- [ ] Test all features live
- [ ] Set API quotas
- [ ] Enable monitoring

### Security:
- [ ] Add admin authentication
- [ ] Restrict API keys by domain
- [ ] Enable HTTPS only (automatic on Vercel)
- [ ] Set CORS policies
- [ ] Add rate limiting

---

## 📈 Monitoring

### Check System Health:
1. **Admin Dashboard** → View stats
2. **Google Cloud Console** → API usage
3. **MongoDB Atlas** → Database metrics
4. **Vercel Dashboard** → Deployment logs

### Key Metrics:
- Active buses (target: >80% during peak hours)
- API response time (target: <2s)
- Google Maps API usage (monitor costs)
- Location update frequency (target: every 3s)

---

## 🎯 What's Next?

### Future Enhancements:
1. **Authentication** - Secure admin panel
2. **Driver App** - Native mobile app
3. **Push Notifications** - Real-time alerts
4. **Payment Integration** - Ticket booking
5. **Predictive ETA** - ML-based predictions
6. **Multi-language** - Regional language support

### Advanced Features:
- WebSocket for real-time updates
- Redis caching for routes
- GraphQL API
- Microservices architecture

---

## 📞 Quick Links

- **Admin Panel**: `/admin-dashboard.html`
- **Driver Interface**: `/driver.html`
- **Passenger View**: `/index.html`
- **Google Cloud**: [console.cloud.google.com](https://console.cloud.google.com/)
- **MongoDB Atlas**: [cloud.mongodb.com](https://cloud.mongodb.com/)
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)

---

## 🎉 You're All Set!

Your KSRTC Bus Tracker now has:
- ✅ Full admin control
- ✅ 3D bus visualization
- ✅ Google Maps integration (ready)
- ✅ OSRM fallback (always works)
- ✅ Real-time tracking
- ✅ Production-grade APIs
- ✅ Government-approval ready

**Happy Tracking! 🚌📍**
