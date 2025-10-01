# 🚏 Stop-Based Route Search - Complete Guide

## Overview

The KSRTC Bus Tracker now supports **intelligent stop-based search** that lets you find buses even when:
- You're at a midway stop
- The bus is going in the opposite direction  
- You want to travel between any two stops on a route

## Example Scenario

**Your Need:**
- You're at **Mattannur** (halfway between Iritty and Thalassery)
- You want to go to **Koothparamba** (between Mattannur and Iritty)
- You need a bus going from Thalassery towards Iritty

**Solution:**
```
From: Mattannur
To: Koothparamba
Click: Find Buses

Result: Shows buses on IRT-TLY route going from Thalassery to Iritty
(which will pass through Mattannur and then Koothparamba)
```

## How It Works

### Route Stop Database

The system knows the stop order for major routes:

```
Iritty → Thalassery Route (IRT-TLY):
┌─────────────────────────────────┐
│ 1. Iritty                       │
│ 2. Peravoor                     │
│ 3. Koothparamba  ←── You want   │
│ 4. Mattannur     ←── You are    │
│ 5. Panoor                       │
│ 6. Thalassery                   │
└─────────────────────────────────┘

Bus Direction 1: Iritty → Thalassery
Bus Direction 2: Thalassery → Iritty ✓ (this works for you!)
```

### Search Logic

1. **You enter:**
   - From: Mattannur
   - To: Koothparamba

2. **System finds:**
   - Routes containing both stops
   - Check stop order (Koothparamba before Mattannur on IRT-TLY)
   - Show buses going in reverse direction

3. **Result:**
   - Displays buses that will reach Mattannur, then Koothparamba

## Supported Routes with Stops

### 1. Iritty - Thalassery Route (IRT-TLY)
```
Stops in Order:
1. Iritty
2. Peravoor
3. Koothparamba
4. Mattannur
5. Panoor
6. Thalassery

Example Searches:
• Mattannur → Koothparamba (reverse direction)
• Iritty → Mattannur (forward)
• Peravoor → Thalassery (forward)
• Panoor → Iritty (reverse)
```

### 2. Kannur - Thalassery Route (KNR-TLY)
```
Stops:
1. Kannur
2. Thalassery

Example Searches:
• Kannur → Thalassery
• Thalassery → Kannur
```

### 3. Kannur - Kozhikode Route (KNR-KKD)
```
Stops:
1. Kannur
2. Thalassery
3. Vadakara
4. Kozhikode

Example Searches:
• Thalassery → Kozhikode
• Vadakara → Kannur
• Kannur → Vadakara
```

### 4. Thiruvananthapuram - Kochi Route (TVM-EKM)
```
Stops:
1. Thiruvananthapuram
2. Kollam
3. Alappuzha
4. Cherthala
5. Ernakulam

Example Searches:
• Kollam → Alappuzha
• Cherthala → Kollam (reverse)
• Alappuzha → Ernakulam
```

### 5. Ernakulam - Thrissur Route (EKM-TRS)
```
Stops:
1. Ernakulam
2. Aluva
3. Chalakudy
4. Thrissur

Example Searches:
• Aluva → Chalakudy
• Chalakudy → Ernakulam (reverse)
```

## Using the Search Interface

### Main Tracker Page

```
┌──────────────────────────────────────────┐
│ From: [Mattannur________]               │
│                  ↓                       │
│ To:   [Koothparamba_____]               │
│                                          │
│        [Find Buses]                     │
└──────────────────────────────────────────┘
```

**Features:**
- ✅ Auto-complete for known stops
- ✅ Works in both directions
- ✅ Finds midway connections
- ✅ Real-time bus filtering

### Step-by-Step Usage

#### 1. **Basic Stop-to-Stop Search**
```
1. Enter "From" stop: Mattannur
2. Enter "To" stop: Koothparamba  
3. Click "Find Buses"
4. See buses that will reach your destination
```

#### 2. **Finding Buses at Current Location**
```
1. Enter only "From": Mattannur
2. Leave "To" empty OR enter destination
3. See all buses passing through Mattannur
```

#### 3. **Finding Buses to Specific Destination**
```
1. Leave "From" empty
2. Enter "To": Thalassery
3. See all buses going to Thalassery
```

#### 4. **Clearing Search**
```
Click the [✕] button on the filter badge
OR
Clear both input fields
```

## Real-World Use Cases

### Case 1: Midway Boarding
**Scenario:** You're at Mattannur, need to go to Iritty
```
From: Mattannur
To: Iritty

Result: Shows buses going from Thalassery/Panoor towards Iritty
(These buses will be heading in the direction you need)
```

### Case 2: Short Distance Travel
**Scenario:** Go from Peravoor to Koothparamba (both on IRT-TLY route)
```
From: Peravoor  
To: Koothparamba

Result: Shows buses on IRT-TLY route traveling forward
```

### Case 3: Reverse Direction
**Scenario:** You're at Alappuzha, want to go back to Kollam
```
From: Alappuzha
To: Kollam

Result: Shows buses going from Ernakulam/Cherthala towards TVM
(Reverse direction on TVM-EKM route)
```

### Case 4: Unknown Route
**Scenario:** Not sure which route connects two places
```
From: Aluva
To: Chalakudy

Result: System automatically finds EKM-TRS route
Shows all buses traveling between these stops
```

## Search Algorithm Details

### How the System Finds Buses:

```javascript
1. User enters: Mattannur → Koothparamba

2. System searches route database:
   - Found in IRT-TLY route
   - Koothparamba is at position 3
   - Mattannur is at position 4
   
3. Stop order check:
   - Position 3 < Position 4
   - This means Koothparamba comes BEFORE Mattannur
   - User needs reverse direction bus

4. Filter active buses:
   - Check routeNumber contains "IRT-TLY"
   - Check routeName contains route info
   - Return all matching buses

5. Display results:
   - Show buses on map
   - Update bus list
   - Show filter badge
```

### Matching Logic:

```
Priority Order:
1. Exact route match (IRT-TLY-001)
2. Route code match (IRT-TLY)
3. Route name match (Iritty to Thalassery)
4. Stop name match (both stops in route)
5. Partial match (any route containing stops)
```

## Adding New Routes

### For Administrators:

Edit `/public/route-stops.js` to add new routes:

```javascript
'NEW-ROUTE': {
  name: 'Route Full Name',
  stops: [
    { name: 'Stop1', lat: 11.xxxx, lng: 75.xxxx },
    { name: 'Stop2', lat: 11.xxxx, lng: 75.xxxx },
    { name: 'Stop3', lat: 11.xxxx, lng: 75.xxxx }
  ]
}
```

**Important:**
- Stops MUST be in order (origin to destination)
- Include accurate GPS coordinates
- Use consistent stop names
- Follow existing format

### Route Code Format:

```
Pattern: ORIGIN-DESTINATION

Examples:
✅ IRT-TLY (Iritty to Thalassery)
✅ KNR-KKD (Kannur to Kozhikode)
✅ TVM-EKM (Thiruvananthapuram to Ernakulam)
```

## For Drivers

### Entering Route Information:

1. **Route Number** (Required):
   ```
   Example: IRT-TLY-001
   ```

2. **Route Name** (Recommended):
   ```
   Example: Iritty to Thalassery via Peravoor
   Include "via" stops for accuracy
   ```

3. **Current Stop** (Optional):
   ```
   Example: Mattannur
   Where you're currently located/starting
   ```

### Why This Helps:

- ✅ Passengers can find your bus by stop names
- ✅ Better search results
- ✅ More accurate arrival predictions
- ✅ Improved route tracking

## Troubleshooting

### "No buses found"

**Possible Reasons:**
1. No buses currently on that route
2. Stop names don't match database
3. Route not in database yet
4. All buses offline

**Solutions:**
1. Try broader search (just one stop)
2. Check spelling of stop names
3. Try route code instead (IRT-TLY)
4. Use route name search ("Iritty to Thalassery")
5. Clear filter and check if any buses active

### Wrong bus direction showing

**Reason:** Route may go both ways

**Solution:**
- Check bus's current location on map
- Look at bus heading/direction arrow
- Check bus speed (moving towards you?)
- Select specific bus to track

### Stop not in autocomplete

**Reason:** Stop not added to database yet

**Solutions:**
1. Type the stop name manually (search still works)
2. Use nearby major stop
3. Request admin to add stop to database
4. Use route name search instead

## Advanced Features

### Auto-Complete

The search boxes provide suggestions for:
- All stops in the database
- Major towns and cities
- Common route points

### Smart Matching

The system understands:
- Partial names (e.g., "Mattan" matches "Mattannur")
- Case-insensitive (MATTANNUR = mattannur)
- Flexible spelling
- Multiple name formats

### Real-Time Updates

- Search results update every 5 seconds
- New buses appear automatically
- Offline buses removed
- Filter remains active during updates

## Future Enhancements

### Planned Features:
- 🔄 ETA calculation (when bus will reach your stop)
- 📍 Show stop markers on map
- 🚏 Bus stop locations with amenities
- ⏱️ Schedule integration
- 📱 Notifications when bus approaches
- 🗺️ Route path visualization
- 📊 Historical timing data
- 🎫 Fare estimation

---

**Feature Version:** 3.0 - Stop-Based Search  
**Last Updated:** October 1, 2025  
**Status:** ✅ Production Ready  
**Example Route:** Iritty ↔ Thalassery with all intermediate stops
