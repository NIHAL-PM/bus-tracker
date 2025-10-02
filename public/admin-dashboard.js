// Admin Dashboard JavaScript
let map, activeBuses = [], routes = [], drivers = [], apiKeys = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAPIKeys();
    loadBuses();
    loadRoutes();
    loadStats();
    initNavigation();
    initMap();
    
    // Auto-refresh every 5 seconds
    setInterval(() => {
        loadBuses();
        loadStats();
    }, 5000);
});

// Navigation
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding section
            document.querySelectorAll('.section-content').forEach(s => s.style.display = 'none');
            const targetSection = document.getElementById(`${section}-section`);
            if (targetSection) {
                targetSection.style.display = 'block';
                
                // Initialize map for tracking section
                if (section === 'tracking' && map) {
                    setTimeout(() => map.invalidateSize(), 100);
                }
            }
        });
    });
}

// Map Initialization
function initMap() {
    map = L.map('map').setView([11.748, 75.4937], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Load buses on map
    loadBusesOnMap();
}

async function loadBusesOnMap() {
    try {
        const response = await fetch('/api/location');
        const locations = await response.json();
        
        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        
        // Add markers for each bus
        locations.forEach(loc => {
            const icon = create3DBusIcon(loc.heading || 0, loc.speed || 0);
            
            const marker = L.marker([loc.lat, loc.lng], { icon })
                .addTo(map)
                .bindPopup(`
                    <strong>Bus: ${loc.busNumber || 'Unknown'}</strong><br>
                    Route: ${loc.routeName || 'N/A'}<br>
                    Speed: ${(loc.speed || 0).toFixed(1)} km/h<br>
                    Heading: ${(loc.heading || 0).toFixed(0)}°<br>
                    Updated: ${new Date(loc.timestamp).toLocaleTimeString()}
                `);
        });
    } catch (error) {
        console.error('Error loading buses on map:', error);
    }
}

// 3D Bus Icon with Orientation
function create3DBusIcon(heading = 0, speed = 0) {
    const isMoving = speed > 1;
    const color = isMoving ? '#10b981' : '#ef4444';
    
    const svgTemplate = `
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <!-- Shadow -->
            <ellipse cx="20" cy="35" rx="12" ry="4" fill="rgba(0,0,0,0.3)"/>
            
            <!-- 3D Bus Body -->
            <g transform="rotate(${heading} 20 20)">
                <!-- Main body -->
                <rect x="10" y="8" width="20" height="24" rx="3" fill="${color}" stroke="#1f2937" stroke-width="1.5"/>
                
                <!-- Roof -->
                <rect x="11" y="6" width="18" height="4" rx="2" fill="${color}" opacity="0.8"/>
                
                <!-- Windows -->
                <rect x="12" y="10" width="7" height="6" rx="1" fill="#dbeafe" stroke="#1f2937" stroke-width="0.5"/>
                <rect x="21" y="10" width="7" height="6" rx="1" fill="#dbeafe" stroke="#1f2937" stroke-width="0.5"/>
                
                <!-- Door -->
                <rect x="15" y="20" width="10" height="10" rx="1" fill="#374151" stroke="#1f2937" stroke-width="0.5"/>
                
                <!-- Wheels -->
                <circle cx="14" cy="32" r="3" fill="#1f2937"/>
                <circle cx="14" cy="32" r="1.5" fill="#6b7280"/>
                <circle cx="26" cy="32" r="3" fill="#1f2937"/>
                <circle cx="26" cy="32" r="1.5" fill="#6b7280"/>
                
                <!-- Front indicator (arrow) -->
                <path d="M 20 2 L 23 6 L 17 6 Z" fill="white" opacity="0.9"/>
                
                <!-- Headlights -->
                <circle cx="14" cy="7" r="1.5" fill="#fef3c7"/>
                <circle cx="26" cy="7" r="1.5" fill="#fef3c7"/>
            </g>
        </svg>
    `;
    
    return L.divIcon({
        className: 'bus-marker-3d',
        html: svgTemplate,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });
}

// Load Statistics
async function loadStats() {
    try {
        const [busesRes, locationsRes] = await Promise.all([
            fetch('/api/buses'),
            fetch('/api/location')
        ]);
        
        const buses = await busesRes.json();
        const locations = await locationsRes.json();
        
        // Update stats
        document.getElementById('activeBusesCount').textContent = locations.length;
        document.getElementById('totalRoutesCount').textContent = Object.keys(ROUTE_STOPS || {}).length;
        
        // Calculate unique active drivers (buses with recent locations)
        const activeDrivers = new Set(locations.map(l => l.busNumber)).size;
        document.getElementById('activeDriversCount').textContent = activeDrivers;
        
        // Calculate total stops
        const totalStops = Object.values(ROUTE_STOPS || {})
            .reduce((acc, route) => acc + (route.stops?.length || 0), 0);
        document.getElementById('totalStopsCount').textContent = totalStops;
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Buses
async function loadBuses() {
    try {
        const [busesRes, locationsRes] = await Promise.all([
            fetch('/api/buses'),
            fetch('/api/location')
        ]);
        
        const buses = await busesRes.json();
        const locations = await locationsRes.json();
        
        activeBuses = buses;
        
        const tbody = document.getElementById('busesTableBody');
        
        if (buses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: #6b7280; padding: 2rem;">
                        No buses found. Click "Add Bus" to register a new bus.
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = buses.map(bus => {
            const location = locations.find(l => l.busNumber === bus.busNumber);
            const isActive = location && (Date.now() - new Date(location.timestamp).getTime() < 300000); // 5 min
            
            return `
                <tr>
                    <td><strong>${bus.busNumber}</strong></td>
                    <td>${bus.routeName || 'Not Assigned'}</td>
                    <td>${bus.driverName || 'Not Assigned'}</td>
                    <td>${bus.depot || 'N/A'}</td>
                    <td>
                        <span class="badge ${isActive ? 'badge-success' : 'badge-danger'}">
                            ${isActive ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                    </td>
                    <td>${location ? new Date(location.timestamp).toLocaleString() : 'Never'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editBus('${bus.busNumber}')">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteBus('${bus.busNumber}')">🗑️</button>
                    </td>
                </tr>
            `;
        }).join('');
        
        // Update map if in tracking section
        if (document.getElementById('tracking-section').style.display !== 'none') {
            loadBusesOnMap();
        }
        
    } catch (error) {
        console.error('Error loading buses:', error);
    }
}

// Load Routes
async function loadRoutes() {
    const tbody = document.getElementById('routesTableBody');
    const routeData = ROUTE_STOPS || {};
    
    if (Object.keys(routeData).length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #6b7280; padding: 2rem;">
                    No routes found.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = Object.entries(routeData).map(([code, route]) => {
        const activeBusCount = activeBuses.filter(b => b.routeName === route.name).length;
        
        return `
            <tr>
                <td><strong>${code}</strong></td>
                <td>${route.name}</td>
                <td>${route.stops?.length || 0} stops</td>
                <td>~${calculateRouteDistance(route)} km</td>
                <td>
                    <span class="badge badge-info">${activeBusCount} buses</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewRoute('${code}')">👁️ View</button>
                    <button class="btn btn-sm btn-warning" onclick="editRoute('${code}')">✏️ Edit</button>
                </td>
            </tr>
        `;
    }).join('');
}

function calculateRouteDistance(route) {
    if (!route.stops || route.stops.length < 2) return 0;
    
    let distance = 0;
    for (let i = 0; i < route.stops.length - 1; i++) {
        const stop1 = route.stops[i];
        const stop2 = route.stops[i + 1];
        distance += getDistance(stop1.lat, stop1.lng, stop2.lat, stop2.lng);
    }
    
    return distance.toFixed(1);
}

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + 
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Modal Functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Add Bus Form
document.getElementById('addBusForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const busData = {
        busNumber: formData.get('busNumber'),
        routeName: formData.get('route'),
        depot: formData.get('depot'),
        driverName: '',
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch('/api/buses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(busData)
        });
        
        if (response.ok) {
            closeModal('addBusModal');
            e.target.reset();
            loadBuses();
            logActivity(`Bus ${busData.busNumber} added to ${busData.routeName}`);
        } else {
            alert('Error adding bus');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding bus');
    }
});

// Delete Bus
async function deleteBus(busNumber) {
    if (!confirm(`Delete bus ${busNumber}?`)) return;
    
    try {
        const response = await fetch(`/api/buses?busNumber=${busNumber}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadBuses();
            logActivity(`Bus ${busNumber} deleted`);
        } else {
            alert('Error deleting bus');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting bus');
    }
}

// Google API Functions
function loadAPIKeys() {
    const saved = localStorage.getItem('googleAPIKeys');
    if (saved) {
        apiKeys = JSON.parse(saved);
        
        document.getElementById('googleMapsKey').value = apiKeys.mapsKey || '';
        document.getElementById('directionsKey').value = apiKeys.directionsKey || '';
        document.getElementById('distanceMatrixKey').value = apiKeys.distanceMatrixKey || '';
        document.getElementById('routesApiKey').value = apiKeys.routesApiKey || '';
        document.getElementById('roadsApiKey').value = apiKeys.roadsApiKey || '';
        
        updateAPIStatus();
    }
}

function saveGoogleAPIKeys() {
    apiKeys = {
        mapsKey: document.getElementById('googleMapsKey').value,
        directionsKey: document.getElementById('directionsKey').value,
        distanceMatrixKey: document.getElementById('distanceMatrixKey').value,
        routesApiKey: document.getElementById('routesApiKey').value,
        roadsApiKey: document.getElementById('roadsApiKey').value
    };
    
    localStorage.setItem('googleAPIKeys', JSON.stringify(apiKeys));
    updateAPIStatus();
    
    alert('✅ API keys saved successfully!');
    logActivity('Google API keys updated');
}

function updateAPIStatus() {
    const statusEl = document.getElementById('apiStatus');
    const statusText = document.getElementById('apiStatusText');
    
    const hasKeys = Object.values(apiKeys).some(key => key && key.trim());
    
    if (hasKeys) {
        statusEl.className = 'integration-status ready';
        statusEl.innerHTML = '<span>✅</span> <span>Google APIs Configured</span>';
        
        // Update feature badges
        document.querySelectorAll('.badge-warning').forEach(badge => {
            badge.className = 'badge badge-success';
            badge.textContent = 'Ready';
        });
    } else {
        statusEl.className = 'integration-status pending';
        statusEl.innerHTML = '<span>⚠️</span> <span>API Keys Not Configured</span>';
    }
}

async function testGoogleAPIs() {
    if (!apiKeys.mapsKey) {
        alert('⚠️ Please configure Google Maps API key first');
        return;
    }
    
    try {
        // Test with a simple geocoding request
        const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Thalassery,Kerala&key=${apiKeys.mapsKey}`;
        const response = await fetch(testUrl);
        const data = await response.json();
        
        if (data.status === 'OK') {
            alert('✅ Google Maps API is working correctly!');
            logActivity('Google Maps API tested successfully');
        } else {
            alert(`⚠️ API Test Failed: ${data.status}\n${data.error_message || 'Check your API key and billing'}`);
        }
    } catch (error) {
        alert('❌ API Test Error: ' + error.message);
    }
}

// Activity Log
function logActivity(message) {
    const activityLog = document.getElementById('activityLog');
    const timestamp = new Date().toLocaleString();
    
    const entry = document.createElement('div');
    entry.style.cssText = 'padding: 0.8rem; border-left: 3px solid var(--primary); background: var(--light); margin-bottom: 0.5rem; border-radius: 4px;';
    entry.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
            <span>${message}</span>
            <span style="color: #6b7280; font-size: 0.85rem;">${timestamp}</span>
        </div>
    `;
    
    if (activityLog.querySelector('p')) {
        activityLog.innerHTML = '';
    }
    
    activityLog.insertBefore(entry, activityLog.firstChild);
    
    // Keep only last 10 activities
    while (activityLog.children.length > 10) {
        activityLog.removeChild(activityLog.lastChild);
    }
}

// Export Data
function exportData() {
    const data = {
        buses: activeBuses,
        routes: ROUTE_STOPS,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ksrtc-data-${Date.now()}.json`;
    a.click();
    
    logActivity('Data exported successfully');
}

// View Route
function viewRoute(routeCode) {
    const route = ROUTE_STOPS[routeCode];
    if (!route) return;
    
    alert(`Route: ${route.name}\n\nStops:\n${route.stops.map((s, i) => `${i + 1}. ${s.name}`).join('\n')}`);
}

// Placeholder functions
function editBus(busNumber) {
    alert(`Edit functionality for bus ${busNumber} - Coming soon!`);
}

function editRoute(routeCode) {
    alert(`Edit functionality for route ${routeCode} - Coming soon!`);
}

// Bus search
document.getElementById('busSearch')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#busesTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Initial activity log
logActivity('Admin dashboard initialized');
