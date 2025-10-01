#!/bin/bash

# KSRTC Bus Tracker - Deployment Script
# Run this to push changes to GitHub and trigger Vercel deployment

echo "🚌 KSRTC Bus Tracker - Deployment"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

# Check git status
echo "📊 Checking git status..."
git status --short

echo ""
read -p "Do you want to commit and push these changes? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    # Add all files
    echo "📦 Adding files..."
    git add .
    
    # Commit
    echo "💾 Committing changes..."
    git commit -m "Production-ready: Enhanced Android tracking with PWA support

- Added Service Worker for offline/background tracking
- Implemented Wake Lock API for screen-on tracking
- Enhanced location tracking with speed & heading calculation
- Added comprehensive Android setup guide
- Fixed vercel.json configuration
- Added visual tracking indicators
- Improved battery optimization handling
- Added notification support
- 100% production-ready with no simulations"
    
    # Push to GitHub
    echo "🚀 Pushing to GitHub..."
    git push origin main
    
    echo ""
    echo "✅ Deployment initiated!"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
    echo "2. Find your project and go to Settings → Environment Variables"
    echo "3. Add MONGODB_URI with your MongoDB connection string"
    echo "4. Wait for automatic deployment to complete"
    echo "5. Test the deployed app on Android device"
    echo ""
    echo "📱 Driver Setup:"
    echo "- Share ANDROID_SETUP.md with all drivers"
    echo "- Conduct training on PWA installation"
    echo "- Test tracking during depot operations"
    echo ""
    echo "🎉 Your KSRTC Bus Tracker is ready for production!"
else
    echo "❌ Deployment cancelled"
    exit 0
fi
