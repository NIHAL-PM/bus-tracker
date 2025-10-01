# Android Setup Guide for KSRTC Driver App

## 🚌 Complete Setup Instructions for Drivers

### Step 1: Install as PWA (Progressive Web App)

1. Open Chrome browser on your Android device
2. Go to your driver app URL: `https://your-app.vercel.app/driver.html`
3. Tap the **three dots menu** (⋮) in the top right
4. Tap **"Add to Home Screen"** or **"Install app"**
5. Tap **"Add"** or **"Install"**
6. The app icon will appear on your home screen

### Step 2: Enable Location Permissions (CRITICAL)

1. Go to **Settings** → **Apps** → **Chrome** (or your app name if installed as PWA)
2. Tap **Permissions** → **Location**
3. Select **"Allow all the time"** (NOT "Allow only while using the app")
4. Enable **"Use precise location"**

### Step 3: Disable Battery Optimization

Battery optimization can stop location tracking when screen is locked!

1. Go to **Settings** → **Apps** → **Chrome** (or your app)
2. Tap **Battery** → **Battery optimization**
3. Find Chrome/your app in the list
4. Select **"Don't optimize"**

#### For Samsung Devices:
- Go to **Settings** → **Battery and device care** → **Battery**
- Tap **Background usage limits**
- Remove Chrome/your app from "Sleeping apps" and "Deep sleeping apps"
- Add to "Never sleeping apps"

#### For Xiaomi/MIUI:
- Go to **Settings** → **Battery & performance**
- Tap **App battery saver**
- Find your app and select **"No restrictions"**

### Step 4: Enable High Accuracy GPS

1. Go to **Settings** → **Location**
2. Ensure Location is **ON**
3. Tap **Location services** → **Google Location Accuracy**
4. Enable **"Improve Location Accuracy"**

### Step 5: Enable Notifications

1. Go to **Settings** → **Apps** → **Chrome** (or your app)
2. Tap **Notifications**
3. Enable **"Allow notifications"**
4. Enable all notification categories

### Step 6: Developer Options (Optional but Recommended)

1. Go to **Settings** → **About phone**
2. Tap **Build number** 7 times to enable Developer Options
3. Go back to **Settings** → **Developer options**
4. Enable **"Stay awake"** when charging (keeps screen on during charging)
5. Disable **"Don't keep activities"** (if enabled)

## 🎯 Best Practices for Drivers

### Before Starting Your Shift:

1. ✅ **Fully charge your device** (80%+ recommended)
2. ✅ **Enable Location/GPS**
3. ✅ **Connect to mobile data** (4G/5G preferred)
4. ✅ **Close other apps** to save battery
5. ✅ **Clear browser cache** if app is slow
6. ✅ **Test location tracking** before leaving depot

### During Your Shift:

1. 📱 **Keep app in foreground** (on screen) for best tracking
2. 🔋 **Connect to vehicle USB charging** if available
3. 🌐 **Monitor data connection** - switch between mobile data/WiFi as needed
4. 🔔 **Check for update notifications** every hour
5. ⚠️ **Don't force close the app** - use the Stop button instead

### Troubleshooting:

#### Location not updating?
- Check if GPS is enabled
- Check if mobile data is working
- Restart the app (Stop → Close → Reopen → Start)
- Clear Chrome cache
- Restart your phone

#### App stops when screen is locked?
- Re-check battery optimization settings
- Enable "Location all the time"
- Some phones may need a physical button press every 10-15 minutes

#### High battery drain?
- Lower screen brightness
- Disable auto-brightness
- Close background apps
- Use battery saver mode (but not for the tracking app)

## 📱 Recommended Android Settings Summary

```
✓ Location: ON (Allow all the time)
✓ Precise Location: ON
✓ Battery Optimization: OFF for tracking app
✓ Notifications: ON
✓ Mobile Data: ON
✓ GPS High Accuracy: ON
✓ Background Data: ON for tracking app
```

## 🆘 Support

If you face any issues:
1. Take a screenshot of the error
2. Note your bus number and route
3. Contact your depot supervisor
4. Report the issue immediately

## 🔒 Privacy & Data

- Your location is only tracked while "Start Tracking" is active
- Data is used only for passenger information
- Location stops being sent when you tap "Stop Tracking"
- All data is encrypted and secure

---

**Remember: Accurate tracking = Better passenger experience!** 🚌✨
