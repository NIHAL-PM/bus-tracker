# 📸 KSRTC Bus Tracker - Visual Guide

## Application Screenshots & Layout

### 1. Main Tracker Page (`/` or `/index.html`)

```
┌─────────────────────────────────────────────────────┐
│ 🚌 KSRTC Live Bus Tracker                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                     │
│ [Select a bus to track ▼] [Refresh] [Driver App]  │
│ 0 buses active                                      │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│                    MAP VIEW                         │
│                                                     │
│         🚌 ← Bus markers with direction             │
│                                                     │
│                   🌍                                 │
│                                                     │
│         Interactive Leaflet Map                     │
│         showing Kerala with buses                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Active Buses: 0    Last Update: Never              │
│ Tracking: No bus selected                           │
│                                                     │
│ Active Buses List:                                  │
│ ┌─────────────────────────────────────┐            │
│ │ 🚌 KL-01-AB-1234                    │            │
│ │ Route: TVM-EKM-001                  │            │
│ │ Speed: 45 km/h | Driver: DR123      │            │
│ └─────────────────────────────────────┘            │
└─────────────────────────────────────────────────────┘
```

**Key Elements:**
- Purple gradient header
- Bus selection dropdown
- Real-time map with custom bus icons
- Info panel showing bus details
- Bus list with cards
- Auto-refresh every 5 seconds

### 2. Driver App (`/driver.html`)

```
┌─────────────────────────────────────────────────────┐
│                    🚌                               │
│         KSRTC Driver Tracker                        │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Bus Number                                   │   │
│ │ [e.g., KL-01-AB-1234_____________]          │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Route Number                                 │   │
│ │ [e.g., TVM-EKM-001_______________]          │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Driver ID                                    │   │
│ │ [Your driver ID__________________]          │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Depot                                        │   │
│ │ [Select Depot ▼__________________]          │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │        Start Tracking (Green Button)        │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │        Stop Tracking (Red Button)           │   │
│ │              (Disabled)                      │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Status: Not Tracking (Red background)       │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐   │
│ │ Last Update: --                              │   │
│ │ Location Updates: 0                          │   │
│ │ Speed: -- km/h                               │   │
│ │ Coordinates: --                              │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
│              ← Back to Tracker                      │
└─────────────────────────────────────────────────────┘
```

**When Tracking Active:**
```
┌─────────────────────────────────────────────────────┐
│ Status: Tracking Bus KL-01-AB-1234                 │
│ (Green background)                                  │
│                                                     │
│ Last Update: 10:30:45 AM                           │
│ Location Updates: 127                               │
│ Speed: 45.5 km/h                                    │
│ Coordinates: 10.850500, 76.271100                   │
└─────────────────────────────────────────────────────┘
```

**Key Elements:**
- Clean, minimal form design
- Large touch-friendly buttons
- Real-time status updates
- Visual feedback (green=active, red=inactive)
- Prevents accidental exit
- Screen wake lock enabled

### 3. Admin Dashboard (`/admin.html`)

```
┌─────────────────────────────────────────────────────┐
│ 🚌 KSRTC Admin Dashboard                           │
└─────────────────────────────────────────────────────┘

┌─────────────┬─────────────┬─────────────┬──────────┐
│ Active Buses│Total Buses  │Active Routes│Last Updt │
│     12      │     45      │      8      │10:30 AM  │
└─────────────┴─────────────┴─────────────┴──────────┘

┌─────────────────────────────────────────────────────┐
│ Active Buses                          [Refresh]     │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                                     │
│ Bus Number │Route   │Driver│Speed│Status│Last Updt│
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│ KL-01-1234 │TVM-EKM │DR123 │45   │Active│10:30:00 │
│ KL-02-5678 │EKM-KZD │DR456 │60   │Active│10:29:55 │
│ KL-03-9012 │TVM-KLM │DR789 │35   │Active│10:29:50 │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Registered Buses                                    │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                                     │
│ Bus ID     │Number  │Route  │Depot│Driver│Reg Date│
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│KSRTC_KL-01 │KL-01   │TVM-EKM│TVM  │DR123 │Jan 15  │
│KSRTC_KL-02 │KL-02   │EKM-KZD│EKM  │DR456 │Jan 15  │
│KSRTC_KL-03 │KL-03   │TVM-KLM│TVM  │DR789 │Jan 14  │
│                                                     │
└─────────────────────────────────────────────────────┘

              ← Back to Tracker
```

**Key Elements:**
- Statistics cards at top
- Real-time data tables
- Color-coded status badges
- Auto-refresh every 10 seconds
- Clean tabular layout
- Professional admin interface

### 4. Bus Popup on Map

```
┌─────────────────────────────┐
│ 🚌 KL-01-AB-1234           │
│                             │
│ Route: TVM-EKM-001         │
│ Speed: 45 km/h             │
│ Driver: DR123              │
│ Last update: 10:30:45 AM   │
└─────────────────────────────┘
```

### 5. Mobile View (Driver App)

```
┌─────────────────┐
│       🚌        │
│  KSRTC Driver   │
│    Tracker      │
│                 │
│ ┌─────────────┐ │
│ │ Bus Number  │ │
│ │ [________]  │ │
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │ Route No.   │ │
│ │ [________]  │ │
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │ Driver ID   │ │
│ │ [________]  │ │
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │ Depot ▼     │ │
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │   START     │ │
│ │  TRACKING   │ │
│ └─────────────┘ │
│                 │
│ Status: Ready   │
└─────────────────┘
```

### 6. Color Coding Guide

**Header/Branding:**
- Background: Purple gradient (#667eea → #764ba2)
- Text: White (#ffffff)

**Status Indicators:**
- Active/Success: Green (#10b981)
- Inactive/Danger: Red (#ef4444)
- Warning: Orange (#f59e0b)
- Info: Blue (#3b82f6)

**Buttons:**
- Primary (Start/Confirm): Green (#10b981)
- Secondary (Info): Blue (#3b82f6)
- Danger (Stop/Delete): Red (#ef4444)
- Disabled: Gray (#9ca3af)

**Map Elements:**
- Bus markers: Purple (#667eea)
- User marker: Green (#10b981)
- Route lines: Purple dashed (#667eea)
- Popup background: White with shadow

### 7. Responsive Breakpoints

**Desktop (>1024px):**
- Full sidebar
- Wide map view
- Multi-column layout
- Large buttons

**Tablet (768px - 1024px):**
- Collapsible sidebar
- Medium map view
- 2-column layout
- Medium buttons

**Mobile (<768px):**
- Stack layout
- Full-width elements
- Large touch targets
- Bottom navigation

### 8. Icon Usage

**Emoji Icons:**
- 🚌 - Bus (main icon)
- 🌍 - Map/Location
- 📱 - Mobile/Driver app
- 👤 - Driver/User
- 📊 - Dashboard/Admin
- ⚙️ - Settings
- 🔄 - Refresh
- ✓ - Success/Active
- ✗ - Error/Inactive

**SVG Icons:**
- Custom bus marker with windows and wheels
- Direction arrow (for heading)
- Loading spinner
- Dropdown arrows

### 9. Loading States

**Initial Load:**
```
┌─────────────────────────┐
│         ┌───┐           │
│         │ ○ │           │
│         └───┘           │
│  Loading KSRTC Tracker  │
└─────────────────────────┘
```

**Button Loading:**
```
┌──────────────────┐
│  Updating... ⟳   │
└──────────────────┘
```

### 10. Error States

**Connection Error:**
```
┌─────────────────────────────┐
│ ✗ Unable to connect         │
│ Please check your internet  │
│ connection and try again.   │
│                             │
│      [Retry Button]         │
└─────────────────────────────┘
```

**Permission Error:**
```
┌─────────────────────────────┐
│ ✗ Location Permission Needed│
│ Please allow location       │
│ access to use this app.     │
│                             │
│   [Open Settings Button]    │
└─────────────────────────────┘
```

### 11. Empty States

**No Buses:**
```
┌─────────────────────────────┐
│           🚌                │
│                             │
│   No buses active right now │
│                             │
│ Buses will appear here when │
│ drivers start tracking      │
└─────────────────────────────┘
```

**No Selection:**
```
┌─────────────────────────────┐
│     Select a bus from       │
│     the dropdown above      │
│     to start tracking       │
└─────────────────────────────┘
```

### 12. Notification Examples

**Success:**
```
✓ Tracking started successfully
```

**Error:**
```
✗ Failed to update location
```

**Warning:**
```
⚠ GPS signal weak
```

**Info:**
```
ℹ Bus will be removed in 2 minutes
```

---

## UI/UX Highlights

### Design Principles
1. **Clarity** - Clear information hierarchy
2. **Simplicity** - Minimal, focused interfaces
3. **Consistency** - Uniform styling across pages
4. **Feedback** - Visual feedback for all actions
5. **Accessibility** - High contrast, readable text
6. **Performance** - Fast load times, smooth animations

### User Flow

**Passenger Flow:**
```
Open App → View Map → Select Bus → Track Location → Get Updates
```

**Driver Flow:**
```
Open App → Fill Form → Start Tracking → Keep Open → Stop at End
```

**Admin Flow:**
```
Open Dashboard → View Stats → Monitor Buses → Take Action
```

### Animation Details

**Map Markers:**
- Fade in when added
- Smooth position updates (300ms transition)
- Rotation animation for heading changes
- Pulse effect on selection

**Buttons:**
- Hover lift effect (2px translateY)
- Click scale effect (0.95 scale)
- Color transition (300ms)
- Shadow depth change

**Page Transitions:**
- 200ms fade
- Smooth scroll behavior
- Loading spinner rotation (1s loop)

---

**Note:** These are ASCII art representations. The actual application has modern, polished UI with gradients, shadows, and smooth animations.
