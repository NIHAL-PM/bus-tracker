/**
 * Google Maps API Integration Configuration
 * 
 * This file provides a unified interface for Google Maps APIs
 * with automatic fallback to OSRM (OpenStreetMap Routing Machine)
 * 
 * Required APIs:
 * - Google Maps JavaScript API
 * - Directions API
 * - Distance Matrix API
 * - Routes API (New - Preferred)
 * - Roads API
 * - Places API
 * - Geocoding API
 */

class GoogleMapsIntegration {
    constructor() {
        this.apiKeys = this.loadAPIKeys();
        this.useGoogleMaps = this.hasValidKeys();
        this.fallbackToOSRM = true; // Always have OSRM as fallback
    }

    // Load API keys from localStorage (set via admin panel)
    loadAPIKeys() {
        const saved = localStorage.getItem('googleAPIKeys');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            mapsKey: '',
            directionsKey: '',
            distanceMatrixKey: '',
            routesApiKey: '',
            roadsApiKey: '',
            placesKey: ''
        };
    }

    hasValidKeys() {
        return this.apiKeys.mapsKey && this.apiKeys.mapsKey.trim() !== '';
    }

    // Initialize Google Maps (if available)
    async initializeGoogleMaps(mapElement, center, zoom) {
        if (!this.useGoogleMaps) {
            console.log('[Google Maps] API keys not configured, using OpenStreetMap');
            return null;
        }

        try {
            // Load Google Maps script dynamically
            await this.loadGoogleMapsScript();

            const map = new google.maps.Map(mapElement, {
                center: { lat: center[0], lng: center[1] },
                zoom: zoom,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true
            });

            console.log('[Google Maps] Initialized successfully');
            return map;
        } catch (error) {
            console.error('[Google Maps] Initialization failed:', error);
            return null;
        }
    }

    // Load Google Maps script
    loadGoogleMapsScript() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKeys.mapsKey}&libraries=places,geometry`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Get route using Google Routes API (new) or fallback to OSRM
    async getRoute(waypoints) {
        // Try Google Routes API first (if configured)
        if (this.apiKeys.routesApiKey) {
            try {
                return await this.getGoogleRoute(waypoints);
            } catch (error) {
                console.warn('[Google Routes API] Failed, falling back to OSRM:', error);
            }
        }

        // Fallback to OSRM
        return await this.getOSRMRoute(waypoints);
    }

    // Google Routes API (New - Compute Routes)
    async getGoogleRoute(waypoints) {
        const origin = waypoints[0];
        const destination = waypoints[waypoints.length - 1];
        const intermediates = waypoints.slice(1, -1);

        const requestBody = {
            origin: {
                location: {
                    latLng: {
                        latitude: origin.lat,
                        longitude: origin.lng
                    }
                }
            },
            destination: {
                location: {
                    latLng: {
                        latitude: destination.lat,
                        longitude: destination.lng
                    }
                }
            },
            intermediates: intermediates.map(wp => ({
                location: {
                    latLng: {
                        latitude: wp.lat,
                        longitude: wp.lng
                    }
                }
            })),
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE',
            computeAlternativeRoutes: false,
            routeModifiers: {
                avoidTolls: false,
                avoidHighways: false,
                avoidFerries: false
            },
            languageCode: 'en-US',
            units: 'METRIC'
        };

        const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': this.apiKeys.routesApiKey,
                'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Google Routes API error: ${response.status}`);
        }

        const data = await response.json();
        const route = data.routes[0];

        // Decode Google polyline
        const coordinates = this.decodeGooglePolyline(route.polyline.encodedPolyline);

        return {
            coordinates: coordinates,
            distance: route.distanceMeters / 1000, // Convert to km
            duration: parseInt(route.duration.replace('s', '')), // Convert to seconds
            provider: 'google-routes'
        };
    }

    // Google Directions API (fallback)
    async getGoogleDirections(waypoints) {
        const origin = waypoints[0];
        const destination = waypoints[waypoints.length - 1];
        const waypointsParam = waypoints.slice(1, -1)
            .map(wp => `${wp.lat},${wp.lng}`)
            .join('|');

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}${waypointsParam ? `&waypoints=${waypointsParam}` : ''}&key=${this.apiKeys.directionsKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            throw new Error(`Directions API error: ${data.status}`);
        }

        const route = data.routes[0];
        const coordinates = this.decodeGooglePolyline(route.overview_polyline.points);

        return {
            coordinates: coordinates,
            distance: route.legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1000,
            duration: route.legs.reduce((sum, leg) => sum + leg.duration.value, 0),
            provider: 'google-directions'
        };
    }

    // OSRM Fallback
    async getOSRMRoute(waypoints) {
        const coords = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

        const response = await fetch(osrmUrl);
        const data = await response.json();

        if (data.code !== 'Ok') {
            throw new Error(`OSRM error: ${data.code}`);
        }

        const route = data.routes[0];

        return {
            coordinates: route.geometry.coordinates.map(coord => [coord[1], coord[0]]),
            distance: route.distance / 1000, // Convert to km
            duration: route.duration,
            provider: 'osrm'
        };
    }

    // Calculate Distance Matrix
    async calculateDistanceMatrix(origins, destinations) {
        if (this.apiKeys.distanceMatrixKey) {
            try {
                return await this.getGoogleDistanceMatrix(origins, destinations);
            } catch (error) {
                console.warn('[Distance Matrix] Google API failed, using fallback:', error);
            }
        }

        // Fallback to Haversine formula
        return this.calculateHaversineMatrix(origins, destinations);
    }

    async getGoogleDistanceMatrix(origins, destinations) {
        const originsParam = origins.map(o => `${o.lat},${o.lng}`).join('|');
        const destinationsParam = destinations.map(d => `${d.lat},${d.lng}`).join('|');

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originsParam}&destinations=${destinationsParam}&mode=driving&key=${this.apiKeys.distanceMatrixKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            throw new Error(`Distance Matrix API error: ${data.status}`);
        }

        return data.rows.map((row, i) => 
            row.elements.map((element, j) => ({
                origin: origins[i],
                destination: destinations[j],
                distance: element.distance.value / 1000, // km
                duration: element.duration.value, // seconds
                provider: 'google-distance-matrix'
            }))
        );
    }

    calculateHaversineMatrix(origins, destinations) {
        return origins.map(origin => 
            destinations.map(destination => {
                const distance = this.haversineDistance(
                    origin.lat, origin.lng,
                    destination.lat, destination.lng
                );
                return {
                    origin,
                    destination,
                    distance: distance,
                    duration: (distance / 40) * 3600, // Assume 40 km/h average
                    provider: 'haversine'
                };
            })
        );
    }

    // Snap to roads
    async snapToRoads(points) {
        if (!this.apiKeys.roadsApiKey) {
            return points; // Return original points
        }

        try {
            const pathParam = points.map(p => `${p.lat},${p.lng}`).join('|');
            const url = `https://roads.googleapis.com/v1/snapToRoads?path=${pathParam}&interpolate=true&key=${this.apiKeys.roadsApiKey}`;

            const response = await fetch(url);
            const data = await response.json();

            return data.snappedPoints.map(sp => ({
                lat: sp.location.latitude,
                lng: sp.location.longitude
            }));
        } catch (error) {
            console.warn('[Roads API] Snap to roads failed:', error);
            return points;
        }
    }

    // Places autocomplete
    async searchPlaces(query) {
        if (!this.apiKeys.mapsKey) {
            return [];
        }

        try {
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${this.apiKeys.mapsKey}&components=country:in`;

            const response = await fetch(url);
            const data = await response.json();

            return data.predictions.map(p => ({
                name: p.description,
                placeId: p.place_id
            }));
        } catch (error) {
            console.error('[Places API] Search failed:', error);
            return [];
        }
    }

    // Utility: Haversine distance
    haversineDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Decode Google polyline
    decodeGooglePolyline(encoded) {
        const points = [];
        let index = 0;
        let lat = 0;
        let lng = 0;

        while (index < encoded.length) {
            let b, shift = 0, result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            points.push([lat / 1e5, lng / 1e5]);
        }

        return points;
    }

    // Check API status
    async testAPIs() {
        const results = {
            maps: false,
            directions: false,
            distanceMatrix: false,
            routes: false,
            roads: false,
            places: false
        };

        // Test Maps API
        if (this.apiKeys.mapsKey) {
            try {
                await this.loadGoogleMapsScript();
                results.maps = true;
            } catch (error) {
                console.error('[Test] Maps API failed:', error);
            }
        }

        // Test Directions API
        if (this.apiKeys.directionsKey) {
            try {
                const testRoute = await this.getGoogleDirections([
                    { lat: 11.7480, lng: 75.4937 },
                    { lat: 11.8877, lng: 75.5515 }
                ]);
                results.directions = true;
            } catch (error) {
                console.error('[Test] Directions API failed:', error);
            }
        }

        // More tests can be added here...

        return results;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleMapsIntegration;
} else {
    window.GoogleMapsIntegration = GoogleMapsIntegration;
}
