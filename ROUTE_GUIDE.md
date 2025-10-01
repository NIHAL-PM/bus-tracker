# 🛣️ KSRTC Route Information Guide

## Route Search Feature

The KSRTC Bus Tracker now includes a powerful route search feature that allows passengers to find buses by route information.

## How to Search for Buses by Route

### 1. **Search by Route Number**
Enter the route code/number directly:
```
Examples:
- TVM-EKM-001
- KNR-TLY-045
- KCH-TRS-123
```

### 2. **Search by Route Name**
Enter the origin and destination:
```
Examples:
- Iritty to Thalassery
- Thiruvananthapuram to Kochi
- Kannur to Kozhikode
- TVM to EKM
```

### 3. **Partial Matches**
Search works with partial route information:
```
Examples:
- "Iritty" - finds all buses from/to Iritty
- "Thalassery" - finds all buses from/to Thalassery
- "TVM-EKM" - finds all buses on TVM-EKM route
```

## Route Format Standards for Drivers

### Route Number Format
**Pattern**: `ORIGIN-DESTINATION-NUMBER`

Examples:
- `TVM-EKM-001` - Thiruvananthapuram to Ernakulam, Route 1
- `KNR-TLY-045` - Kannur to Thalassery, Route 45
- `KCH-TRS-123` - Kochi to Thrissur, Route 123

### Route Name Format
**Pattern**: `Origin to Destination [via Stops]`

Examples:
- `Iritty to Thalassery`
- `Thiruvananthapuram to Kochi via Kollam`
- `Kannur to Kozhikode via Thalassery`

### City/Town Abbreviations

| Full Name | Abbreviation |
|-----------|--------------|
| Thiruvananthapuram | TVM |
| Ernakulam/Kochi | EKM / KCH |
| Kozhikode/Calicut | KKD / CLT |
| Thrissur | TRS |
| Kannur | KNR |
| Kollam | KLM |
| Palakkad | PKD |
| Alappuzha | ALPY |
| Kottayam | KTM |
| Malappuram | MLP |
| Kasaragod | KSD |
| Pathanamthitta | PTA |
| Idukki | IDK |
| Wayanad | WYD |
| Thalassery | TLY |
| Iritty | IRT |

## Driver Instructions

### When Starting Your Shift:

1. **Enter Route Number** (Required)
   - Format: `ORIGIN-DESTINATION-NUMBER`
   - Example: `IRT-TLY-001`

2. **Enter Route Name** (Optional but Recommended)
   - Full route description
   - Example: `Iritty to Thalassery via Peravoor`

3. **Why Both?**
   - Route Number: Quick identification
   - Route Name: Better for passenger searches
   - Passengers can search using either format

### Examples for Popular Routes

#### North Kerala Routes
```
Route Number: KNR-TLY-001
Route Name: Kannur to Thalassery

Route Number: IRT-TLY-045
Route Name: Iritty to Thalassery via Peravoor

Route Number: KNR-KKD-123
Route Name: Kannur to Kozhikode via Thalassery
```

#### Central Kerala Routes
```
Route Number: EKM-TRS-001
Route Name: Ernakulam to Thrissur

Route Number: KCH-ALPY-045
Route Name: Kochi to Alappuzha via Cherthala

Route Number: KTM-TRS-123
Route Name: Kottayam to Thrissur via Ernakulam
```

#### South Kerala Routes
```
Route Number: TVM-KLM-001
Route Name: Thiruvananthapuram to Kollam

Route Number: TVM-EKM-045
Route Name: Thiruvananthapuram to Kochi via Kollam

Route Number: KLM-ALPY-123
Route Name: Kollam to Alappuzha
```

## Passenger Search Examples

### Example 1: Finding buses from Iritty to Thalassery
**Search Options:**
- Type: `Iritty to Thalassery`
- Type: `IRT-TLY`
- Type: `Iritty`
- Type: `Thalassery`

**Result:** All buses operating on any route between Iritty and Thalassery

### Example 2: Finding specific route
**Search:**
- Type: `IRT-TLY-001`

**Result:** Only buses on route IRT-TLY-001

### Example 3: Finding all buses from a city
**Search:**
- Type: `Kannur`
- Type: `KNR`

**Result:** All buses originating from or going to Kannur

## Search Tips

### For Passengers:
1. ✅ Use full city names for better results
2. ✅ Use "to" between origin and destination
3. ✅ Try abbreviations if full name doesn't work
4. ✅ Search partial route codes (e.g., "TVM-EKM")
5. ✅ Case doesn't matter (works with uppercase/lowercase)

### For Drivers:
1. ✅ Always enter route number in standard format
2. ✅ Include route name for better passenger experience
3. ✅ Use depot abbreviations consistently
4. ✅ Include via stops in route name when applicable
5. ✅ Update route info if route changes during service

## Route Information Database

### Major Routes Template

#### Thiruvananthapuram Division
- TVM-KLM: Thiruvananthapuram - Kollam (55 km)
- TVM-ALPY: Thiruvananthapuram - Alappuzha (110 km)
- TVM-EKM: Thiruvananthapuram - Ernakulam (220 km)
- TVM-TRS: Thiruvananthapuram - Thrissur (290 km)

#### Ernakulam Division
- EKM-TRS: Ernakulam - Thrissur (75 km)
- EKM-KKD: Ernakulam - Kozhikode (195 km)
- EKM-KTM: Ernakulam - Kottayam (65 km)
- EKM-ALPY: Ernakulam - Alappuzha (55 km)

#### Kozhikode Division
- KKD-KNR: Kozhikode - Kannur (95 km)
- KKD-TRS: Kozhikode - Thrissur (120 km)
- KKD-WYD: Kozhikode - Wayanad (90 km)
- KKD-MLP: Kozhikode - Malappuram (50 km)

#### Kannur Division
- KNR-KSD: Kannur - Kasaragod (90 km)
- KNR-TLY: Kannur - Thalassery (20 km)
- IRT-TLY: Iritty - Thalassery (30 km)
- KNR-WYD: Kannur - Wayanad (110 km)

## Advanced Search Features

### Multiple Stop Routes
When entering route names with multiple stops:

**Format:** `Origin to Destination via Stop1, Stop2`

**Examples:**
```
Thiruvananthapuram to Kochi via Kollam, Alappuzha, Cherthala

Kannur to Kozhikode via Thalassery, Vadakara

Iritty to Thalassery via Peravoor, Panoor
```

### Express vs Ordinary Routes
Use suffixes to differentiate:

**Express Routes:**
- `TVM-EKM-001-EXP`
- `Thiruvananthapuram to Kochi Express`

**Ordinary Routes:**
- `TVM-EKM-001-ORD`
- `Thiruvananthapuram to Kochi Ordinary`

**Limited Stop:**
- `TVM-EKM-001-LTD`
- `Thiruvananthapuram to Kochi Limited`

## Integration with Admin Dashboard

The admin dashboard shows:
- ✅ Active routes with bus counts
- ✅ Most popular routes
- ✅ Route-wise statistics
- ✅ Buses per route in real-time

## Troubleshooting

### "No buses found" when searching
**Solutions:**
1. Check spelling of city names
2. Try abbreviations (TVM instead of Thiruvananthapuram)
3. Try partial search (just origin or destination)
4. Check if any buses are currently active on that route
5. Clear filter and try again

### Route not showing in search
**Driver Action Required:**
1. Ensure route number is entered correctly
2. Add route name in driver app
3. Format should match standards
4. Restart tracking if route info changed

### Multiple buses on same route
**This is normal!** The search will show:
- All buses currently operating on that route
- Use bus number to identify specific bus
- Check speed and location to find nearest bus

## Future Enhancements

### Planned Features:
- 🔄 Route polylines on map showing bus path
- 📍 Bus stop markers along routes
- ⏱️ Estimated arrival times at stops
- 📊 Route statistics and analytics
- 🗺️ Route deviation alerts
- 📱 Route-based notifications for passengers

---

**Last Updated:** October 1, 2025  
**Version:** 2.0 with Route Search  
**Status:** ✅ Production Ready
