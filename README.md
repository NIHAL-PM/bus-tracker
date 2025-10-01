# 🚌 KSRTC Live Bus Tracker

A complete, production-ready bus tracking system for KSRTC (Kerala State Road Transport Corporation) with real-time GPS tracking, built with Node.js, MongoDB, and Vercel serverless functions.

## ✨ Features

- ✅ **Real-time GPS tracking** - Live location updates every few seconds
- ✅ **Multiple bus support** - Track unlimited number of buses simultaneously
- ✅ **Interactive map** - Beautiful Leaflet.js map with custom bus icons
- ✅ **Route visualization** - Display bus routes and calculate distances
- ✅ **Speed monitoring** - Real-time speed tracking for all buses
- ✅ **Driver app** - Dedicated mobile-friendly interface for bus drivers
- ✅ **Admin dashboard** - Monitor all buses and statistics
- ✅ **Depot management** - Organize buses by depot locations
- ✅ **Auto-cleanup** - Automatically removes stale data (buses offline >10 minutes)
- ✅ **Mobile-responsive** - Works perfectly on all devices
- ✅ **PWA support** - Install as a native app on mobile devices
- ✅ **Background tracking** - Keeps tracking even when screen is off
- ✅ **Screen wake lock** - Prevents screen from sleeping during tracking

## 📁 Project Structure

```
ksrtc-bus-tracker/
├── api/
│   ├── location.js          # Location update/fetch API
│   ├── buses.js             # Bus management API
│   └── routes.js            # Route management API
├── public/
│   ├── index.html           # Main tracking interface
│   ├── driver.html          # Driver app (for bus drivers)
│   ├── admin.html           # Admin dashboard
│   └── manifest.json        # PWA manifest
├── package.json
├── vercel.json
├── .env.local.example       # Environment variables template
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- MongoDB Atlas account (free tier works)
- Vercel account (free tier works)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bus-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📦 Deployment to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Project

```bash
vercel link
```

### Step 4: Add Environment Variable

```bash
vercel env add MONGODB_URI
# Paste your MongoDB connection string when prompted
```

### Step 5: Deploy to Production

```bash
npm run deploy
# or
vercel --prod
```

Your app will be live at: `https://your-project.vercel.app`

## 🔧 Configuration

### MongoDB Setup

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)
4. Create a database user
5. Get your connection string and add it to `.env.local`

### Environment Variables

Set these in Vercel:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 📱 Usage

### For Passengers (Main Tracker)

1. Visit the homepage: `https://your-domain.vercel.app`
2. View all active buses on the map
3. Select a bus from the dropdown to track it
4. See real-time location, speed, and route information

### For Bus Drivers

1. Visit: `https://your-domain.vercel.app/driver.html`
2. Enter bus details:
   - Bus Number (e.g., KL-01-AB-1234)
   - Route Number
   - Driver ID
   - Depot Location
3. Click "Start Tracking"
4. Keep the browser open during your shift
5. Click "Stop Tracking" when done

### For Administrators

1. Visit: `https://your-domain.vercel.app/admin.html`
2. View statistics and all registered buses
3. Monitor active buses and routes
4. See driver information and bus status

## 🔗 API Endpoints

### Location API (`/api/location`)

**POST** - Update bus location
```json
{
  "busId": "KSRTC_KL-01-AB-1234",
  "lat": 10.8505,
  "lng": 76.2711,
  "speed": 45.5,
  "heading": 180,
  "driverId": "DR123",
  "routeNumber": "TVM-EKM-001",
  "busNumber": "KL-01-AB-1234"
}
```

**GET** - Get all active buses
```bash
curl https://your-domain.vercel.app/api/location
```

**DELETE** - Remove bus from tracking
```json
{
  "busId": "KSRTC_KL-01-AB-1234"
}
```

### Bus Registry API (`/api/buses`)

**POST** - Register a new bus
```json
{
  "busNumber": "KL-01-AB-1234",
  "routeNumber": "TVM-EKM-001",
  "depot": "Thiruvananthapuram",
  "driverId": "DR123"
}
```

**GET** - Get all registered buses
```bash
curl https://your-domain.vercel.app/api/buses
```

### Route API (`/api/routes`)

**POST** - Add or update a route
```json
{
  "routeNumber": "TVM-EKM-001",
  "routeName": "Trivandrum to Ernakulam",
  "stops": ["TVM", "Kollam", "Alappuzha", "Kochi"],
  "distance": 220
}
```

**GET** - Get all routes
```bash
curl https://your-domain.vercel.app/api/routes
```

## 🎯 KSRTC Integration Options

### Option 1: Official API (Recommended)
Contact KSRTC officially for API access to their existing GPS tracking system.

### Option 2: Driver Mobile App (Current Solution)
Deploy the driver.html page and have each bus driver use it on their phone.

### Option 3: Hardware GPS Devices
Install GPS trackers in buses and configure them to send data to the API endpoints.

### Option 4: Third-Party Integration
Partner with existing tracking providers like Chalo App or redBus.

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Add authentication to API endpoints if needed
3. **Rate Limiting**: Consider adding rate limiting for production use
4. **HTTPS**: Vercel automatically provides SSL certificates

### Adding API Key Authentication (Optional)

Add to your API files:

```javascript
const API_KEY = process.env.API_KEY;

if (req.headers['x-api-key'] !== API_KEY) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

## 🐛 Troubleshooting

### Buses not showing on map?
- Check if drivers have started tracking
- Verify MongoDB connection
- Check browser console for errors

### Location not updating?
- Ensure GPS is enabled on the device
- Check if location permissions are granted
- Verify network connectivity

### Deployment issues?
- Check Vercel logs: `vercel logs`
- Verify environment variables are set correctly
- Ensure MongoDB Atlas IP whitelist includes Vercel's IPs

## 📊 Database Collections

### `locations` Collection
Stores real-time bus locations (auto-cleaned after 10 minutes of inactivity)

### `buses` Collection
Stores registered bus information

### `routes` Collection
Stores route information

## 🎨 Customization

### Changing Colors
Edit the CSS variables in the HTML files:
- Primary color: `#667eea`
- Secondary color: `#764ba2`
- Success color: `#10b981`
- Danger color: `#ef4444`

### Adjusting Update Intervals
- Main tracker: Update every 5 seconds (line in index.html)
- Driver app: Uses GPS watchPosition (continuous)
- Admin dashboard: Update every 10 seconds

### Modifying Map Center
Change the initial map view in `index.html`:
```javascript
const map = L.map('map').setView([10.8505, 76.2711], 8);
// [latitude, longitude], zoom_level
```

## 📱 Installing as PWA

### On Android:
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen"
4. Confirm installation

### On iOS:
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Vercel logs: `vercel logs`
3. Check MongoDB Atlas logs
4. Open an issue on GitHub

## 🙏 Credits

- Maps: [Leaflet.js](https://leafletjs.com/)
- Database: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Hosting: [Vercel](https://vercel.com/)
- Icons: Custom SVG icons

---

**Made with ❤️ for KSRTC**

🚀 **Your KSRTC bus tracker is now ready for production deployment!**
