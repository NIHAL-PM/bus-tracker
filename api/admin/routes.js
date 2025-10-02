// Admin API - Route Management
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await client.connect();
        const db = client.db('busTracker');
        const routes = db.collection('routes');
        const buses = db.collection('buses');

        // GET - Get all routes with statistics
        if (req.method === 'GET') {
            const allRoutes = await routes.find({}).toArray();
            
            // Get active bus count for each route
            const enrichedRoutes = await Promise.all(
                allRoutes.map(async (route) => {
                    const busCount = await buses.countDocuments({ 
                        routeName: route.name 
                    });
                    
                    return {
                        ...route,
                        activeBusCount: busCount,
                        stopCount: route.stops?.length || 0,
                        distance: calculateRouteDistance(route.stops)
                    };
                })
            );

            res.status(200).json(enrichedRoutes);
        }

        // POST - Add new route
        else if (req.method === 'POST') {
            const routeData = req.body;
            
            // Validation
            if (!routeData.code || !routeData.name) {
                return res.status(400).json({ 
                    error: 'Route code and name are required' 
                });
            }

            // Check if route already exists
            const existing = await routes.findOne({ code: routeData.code });
            if (existing) {
                return res.status(409).json({ error: 'Route already exists' });
            }

            const newRoute = {
                code: routeData.code,
                name: routeData.name,
                stops: routeData.stops || [],
                fare: routeData.fare || 0,
                frequency: routeData.frequency || 30, // minutes
                operatingHours: routeData.operatingHours || '06:00-22:00',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await routes.insertOne(newRoute);
            res.status(201).json({ success: true, route: newRoute });
        }

        // PUT - Update route
        else if (req.method === 'PUT') {
            const { code, ...updates } = req.body;

            if (!code) {
                return res.status(400).json({ error: 'Route code is required' });
            }

            const result = await routes.updateOne(
                { code },
                { 
                    $set: {
                        ...updates,
                        updatedAt: new Date().toISOString()
                    }
                }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Route not found' });
            }

            res.status(200).json({ success: true, updated: result.modifiedCount });
        }

        // DELETE - Remove route
        else if (req.method === 'DELETE') {
            const { code } = req.query;

            if (!code) {
                return res.status(400).json({ error: 'Route code is required' });
            }

            // Check if any buses are assigned to this route
            const assignedBuses = await buses.countDocuments({ 
                routeName: { $regex: code, $options: 'i' } 
            });

            if (assignedBuses > 0) {
                return res.status(409).json({ 
                    error: `Cannot delete route. ${assignedBuses} bus(es) are assigned to this route.` 
                });
            }

            const result = await routes.deleteOne({ code });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Route not found' });
            }

            res.status(200).json({ success: true, deleted: result.deletedCount });
        }

        else {
            res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        console.error('Admin Routes API Error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
};

// Helper function to calculate route distance
function calculateRouteDistance(stops) {
    if (!stops || stops.length < 2) return 0;
    
    let distance = 0;
    for (let i = 0; i < stops.length - 1; i++) {
        const stop1 = stops[i];
        const stop2 = stops[i + 1];
        
        if (stop1.lat && stop1.lng && stop2.lat && stop2.lng) {
            distance += haversineDistance(
                stop1.lat, stop1.lng, 
                stop2.lat, stop2.lng
            );
        }
    }
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal
}

function haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
