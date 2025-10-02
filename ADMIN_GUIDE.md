# Admin Panel & Google Maps Integration Guide

## 🎯 Overview

The KSRTC Bus Tracker now includes:
1. **Comprehensive Admin Dashboard** - Manage buses, routes, drivers, and system settings
2. **3D Bus Icons** - Enhanced visual representation with proper orientation
3. **Google Maps API Integration** - Premium routing and navigation features with OSRM fallback

---

## 📊 Admin Dashboard

### Access
- URL: `/admin-dashboard.html`
- Features: Real-time monitoring, bus/route management, API configuration

### Dashboard Sections

#### 1. **Dashboard Overview**
- Live statistics (active buses, routes, drivers, stops)
- Quick actions (add bus, route, stop)
- Recent activity log
- System status

#### 2. **Manage Buses**
- **Add Bus**: Register new buses with number, route, depot
- **View All Buses**: Table with status, driver, last update
- **Edit/Delete**: Modify or remove buses
- **Real-time Status**: Green (active) / Red (inactive) indicators
- **Search**: Filter buses by number, route, or driver

#### 3. **Manage Routes**
- **View Routes**: All routes from route-stops.js
- **Route Details**: Code, name, stops count, distance
- **Active Buses**: See which buses are on each route
- **Edit Routes**: Modify stops and sequences (coming soon)

#### 4. **Live Tracking**
- **Interactive Map**: See all buses in real-time
- **3D Bus Icons**: Rotate based on heading, animate when moving
- **Click for Details**: Bus info, speed, heading, route
- **Auto-refresh**: Updates every 5 seconds

#### 5. **Google APIs Configuration**
- **API Key Management**: Configure all Google Maps APIs
- **Status Indicators**: Shows which APIs are ready
- **Test APIs**: Verify configuration is working
- **Feature Toggle**: Enable/disable Google Maps features

---

## 🚌 3D Bus Icons

### Features
- **3D Design**: Realistic bus with depth, shadows, wheels
- **Orientation**: Arrow points in heading direction (0°=North, 90°=East, etc.)
- **Motion Indicators**: 
  - Green color when moving (speed > 1 km/h)
  - Blinking arrow when in motion
  - Motion lines behind bus
  - Glowing headlights when active
- **Smooth Transitions**: 0.5s rotation animation
- **Responsive**: Adapts to map zoom levels

### Technical Details
```javascript
createBusIcon(heading, speed, color)
// heading: 0-360 degrees
// speed: km/h (determines animation)
// color: base color (defaults to #667eea)
```

### Visual Elements
- **Main Body**: 3D gradient with stroke
- **Windows**: Front windshield with reflections
- **Wheels**: 3D circles with inner hubs
- **Direction Arrow**: Points forward (top of icon)
- **Headlights**: Yellow circles (glow when moving)
- **Shadow**: Ellipse underneath for depth
- **Motion Lines**: Appear when speed > 1 km/h

---

## 🌐 Google Maps API Integration

### Setup Process

#### 1. **Get API Keys from Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable required APIs:
   - Maps JavaScript API
   - Directions API
   - Distance Matrix API
   - Routes API (New)
   - Roads API
   - Places API
   - Geocoding API

4. Create credentials:
   - API Key for each service (or use one key for all)
   - Add restrictions (HTTP referrers for web apps)

#### 2. **Configure in Admin Panel**
1. Open `/admin-dashboard.html`
2. Click "Google APIs" in sidebar
3. Enter API keys:
   - **Google Maps API Key**: For map display and places
   - **Directions API Key**: For turn-by-turn directions
   - **Distance Matrix API Key**: For ETA calculations
   - **Routes API Key**: For advanced routing with traffic
   - **Roads API Key**: For snap-to-roads functionality

4. Click "Save API Keys"
5. Click "Test APIs" to verify

#### 3. **Integration Benefits**

##### With Google Maps APIs:
- ✅ Real-time traffic data
- ✅ More accurate routes
- ✅ Advanced routing algorithms
- ✅ Places autocomplete in search
- ✅ Snap to roads for better accuracy
- ✅ Turn-by-turn navigation
- ✅ Street View integration

##### Without (OSRM Fallback):
- ✅ Free routing via OSRM
- ✅ Road-following routes (no traffic)
- ✅ Basic ETA calculations
- ✅ Manual stop entry

---

## 🔧 API Usage in Code

### Loading the Integration
```javascript
// In your HTML
<script src="/google-maps-integration.js"></script>

// Initialize
const gmaps = new GoogleMapsIntegration();

// Check if configured
if (gmaps.useGoogleMaps) {
    console.log('Using Google Maps');
} else {
    console.log('Using OSRM fallback');
}
```

### Getting Routes
```javascript
// Automatically uses Google Routes API or falls back to OSRM
const waypoints = [
    { lat: 11.7480, lng: 75.4937 }, // Thalassery
    { lat: 11.8877, lng: 75.5515 }, // Mattannur
    { lat: 11.9876, lng: 75.5983 }  // Iritty
];

const route = await gmaps.getRoute(waypoints);
console.log(route);
// {
//     coordinates: [[lat, lng], ...],
//     distance: 25.3, // km
//     duration: 1800, // seconds
//     provider: 'google-routes' or 'osrm'
// }
```

### Distance Matrix
```javascript
const origins = [{ lat: 11.7480, lng: 75.4937 }];
const destinations = [
    { lat: 11.8877, lng: 75.5515 },
    { lat: 11.9876, lng: 75.5983 }
];

const matrix = await gmaps.calculateDistanceMatrix(origins, destinations);
// Returns array of distance/duration for each origin-destination pair
```

### Places Autocomplete
```javascript
const results = await gmaps.searchPlaces('Thalassery');
// Returns array of place suggestions with placeId
```

### Snap to Roads
```javascript
const rawPoints = [
    { lat: 11.7480, lng: 75.4937 },
    { lat: 11.7481, lng: 75.4938 }
];

const snappedPoints = await gmaps.snapToRoads(rawPoints);
// Returns points aligned to actual roads
```

---

## 📱 Admin Dashboard Features

### Bus Management
```javascript
// Add bus via form
POST /api/buses
{
    "busNumber": "KL-13-AB-1234",
    "routeName": "Iritty to Thalassery",
    "depot": "Thalassery",
    "driverName": "",
    "timestamp": "2024-01-15T10:30:00Z"
}

// Delete bus
DELETE /api/buses?busNumber=KL-13-AB-1234
```

### Route Management
- Routes loaded from `route-stops.js`
- Admin can view and edit (CRUD coming soon)
- Calculates distance using Haversine formula

### Real-time Updates
- **Auto-refresh**: Every 5 seconds
- **Live bus count**: Shows active vs total
- **Status indicators**: Color-coded (green/red)
- **Activity log**: Last 10 actions

---

## 🎨 UI Components

### Stats Cards
- Active Buses (blue icon)
- Total Routes (green icon)
- Active Drivers (yellow icon)
- Total Stops (red icon)

### Tables
- Sortable columns
- Search/filter functionality
- Action buttons (edit, delete, view)
- Status badges

### Modals
- Add Bus Modal
- Add Route Modal
- Add Stop Modal
- Smooth animations

### Forms
- Validation
- Dropdown selectors
- GPS coordinate inputs
- Auto-save functionality

---

## 🔒 Security & Best Practices

### API Key Security
1. **Never commit API keys to Git**
2. **Use environment variables in production**
3. **Restrict API keys by:**
   - HTTP referrer (your domain only)
   - IP address (if static)
   - API quotas (prevent overuse)

4. **Monitor usage in Google Cloud Console**

### Data Privacy
- Location data has 10-minute TTL
- No persistent tracking without consent
- Admin dashboard requires authentication (add in production)

---

## 🚀 Deployment Checklist

### Before Going Live:

1. ✅ **Configure Google Maps APIs**
   - Create project in Google Cloud Console
   - Enable all required APIs
   - Create restricted API keys
   - Set billing limits

2. ✅ **Test All Features**
   - Add sample buses in admin
   - Test route visualization
   - Verify 3D icons rotate correctly
   - Check API fallback to OSRM

3. ✅ **Security**
   - Add admin authentication
   - Restrict API keys
   - Enable HTTPS only
   - Set CORS policies

4. ✅ **Performance**
   - Enable API caching
   - Optimize map tile loading
   - Minimize API calls
   - Use batch requests where possible

5. ✅ **Monitoring**
   - Set up Google Cloud Monitoring
   - Track API usage and costs
   - Monitor error rates
   - Set up alerts

---

## 📊 Cost Estimation (Google Maps)

### Pricing (approximate):
- **Maps JavaScript API**: $7 per 1,000 loads
- **Directions API**: $5 per 1,000 requests
- **Distance Matrix API**: $5 per 1,000 requests
- **Routes API**: $5 per 1,000 requests
- **Roads API**: $10 per 1,000 requests
- **Places API**: $17 per 1,000 requests

### Free Tier:
- $200 monthly credit (covers ~28,000 map loads)
- Use OSRM fallback to reduce costs

### Optimization Tips:
1. Cache routes in localStorage
2. Batch Distance Matrix requests
3. Use OSRM for simple routes
4. Enable Google Maps only for premium features
5. Set daily quotas in Cloud Console

---

## 🛠️ Troubleshooting

### Google Maps Not Loading
1. Check API key is correct
2. Verify API is enabled in Cloud Console
3. Check browser console for errors
4. Ensure billing is enabled
5. Check domain restrictions

### OSRM Routes Not Showing
1. Check OSRM server is accessible
2. Verify coordinates are valid
3. Check network connectivity
4. Look for CORS errors

### 3D Icons Not Rotating
1. Verify `heading` is in degrees (0-360)
2. Check browser supports SVG transforms
3. Ensure CSS transitions are enabled

### Admin Panel Not Updating
1. Check API endpoints are accessible
2. Verify MongoDB connection
3. Check browser network tab
4. Clear localStorage if needed

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review network tab for failed requests
3. Test APIs using "Test APIs" button
4. Verify all services are running:
   - Vercel deployment
   - MongoDB Atlas
   - Google Cloud APIs

---

## 🎉 Next Steps

1. **Add Authentication**: Secure admin panel
2. **Driver Assignment**: Link drivers to buses
3. **Schedule Management**: Timetables for routes
4. **Analytics Dashboard**: Usage statistics
5. **Mobile Apps**: Native Android/iOS with Navigation SDK
6. **Notifications**: Real-time alerts for passengers
7. **Payment Integration**: Ticket booking system

---

## 📝 Summary

You now have:
- ✅ Full-featured admin dashboard
- ✅ 3D bus icons with orientation
- ✅ Google Maps API integration ready
- ✅ OSRM fallback for cost savings
- ✅ Real-time tracking and monitoring
- ✅ Production-ready architecture

**Access Points:**
- **Passenger View**: `/index.html`
- **Driver Interface**: `/driver.html`  
- **Admin Dashboard**: `/admin-dashboard.html`

**API Integration:**
- Configured via admin panel
- Automatic fallback to OSRM
- Cost-effective hybrid approach
