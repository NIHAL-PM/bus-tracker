// Admin API - Analytics and Statistics
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await client.connect();
        const db = client.db('busTracker');
        const locations = db.collection('locations');
        const buses = db.collection('buses');
        const routes = db.collection('routes');

        // Time ranges
        const now = new Date();
        const oneHourAgo = new Date(now - 60 * 60 * 1000);
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        // Active buses (last 5 minutes)
        const fiveMinAgo = new Date(now - 5 * 60 * 1000);
        const activeBuses = await locations.aggregate([
            {
                $match: {
                    timestamp: { $gte: fiveMinAgo.toISOString() }
                }
            },
            {
                $group: {
                    _id: '$busNumber'
                }
            },
            {
                $count: 'count'
            }
        ]).toArray();

        const activeBusCount = activeBuses[0]?.count || 0;

        // Total buses
        const totalBuses = await buses.countDocuments({});

        // Total routes
        const totalRoutes = await routes.countDocuments({});

        // Buses by route
        const busesByRoute = await buses.aggregate([
            {
                $group: {
                    _id: '$routeName',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]).toArray();

        // Average speed (last hour)
        const avgSpeed = await locations.aggregate([
            {
                $match: {
                    timestamp: { $gte: oneHourAgo.toISOString() },
                    speed: { $exists: true, $gt: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    avgSpeed: { $avg: '$speed' },
                    maxSpeed: { $max: '$speed' }
                }
            }
        ]).toArray();

        // Location updates per hour (last 24 hours)
        const updatesPerHour = await locations.aggregate([
            {
                $match: {
                    timestamp: { $gte: oneDayAgo.toISOString() }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d-%H',
                            date: { $dateFromString: { dateString: '$timestamp' } }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]).toArray();

        // Most active buses (last week)
        const mostActiveBuses = await locations.aggregate([
            {
                $match: {
                    timestamp: { $gte: oneWeekAgo.toISOString() }
                }
            },
            {
                $group: {
                    _id: '$busNumber',
                    updateCount: { $sum: 1 },
                    avgSpeed: { $avg: '$speed' },
                    totalDistance: { $sum: '$distance' }
                }
            },
            {
                $sort: { updateCount: -1 }
            },
            {
                $limit: 10
            }
        ]).toArray();

        // Route coverage (stops per route)
        const routeCoverage = await routes.aggregate([
            {
                $project: {
                    code: 1,
                    name: 1,
                    stopCount: { $size: { $ifNull: ['$stops', []] } }
                }
            },
            {
                $sort: { stopCount: -1 }
            }
        ]).toArray();

        // Depot statistics
        const depotStats = await buses.aggregate([
            {
                $group: {
                    _id: '$depot',
                    busCount: { $sum: 1 }
                }
            },
            {
                $sort: { busCount: -1 }
            }
        ]).toArray();

        // Response
        res.status(200).json({
            summary: {
                activeBuses: activeBusCount,
                totalBuses: totalBuses,
                totalRoutes: totalRoutes,
                activePercentage: totalBuses > 0 
                    ? Math.round((activeBusCount / totalBuses) * 100) 
                    : 0
            },
            performance: {
                averageSpeed: avgSpeed[0]?.avgSpeed 
                    ? Math.round(avgSpeed[0].avgSpeed * 10) / 10 
                    : 0,
                maxSpeed: avgSpeed[0]?.maxSpeed 
                    ? Math.round(avgSpeed[0].maxSpeed * 10) / 10 
                    : 0
            },
            distribution: {
                busesByRoute: busesByRoute.map(r => ({
                    route: r._id || 'Unassigned',
                    count: r.count
                })),
                byDepot: depotStats.map(d => ({
                    depot: d._id || 'Unknown',
                    count: d.busCount
                }))
            },
            activity: {
                updatesPerHour: updatesPerHour.map(u => ({
                    hour: u._id,
                    count: u.count
                })),
                mostActiveBuses: mostActiveBuses.map(b => ({
                    busNumber: b._id,
                    updates: b.updateCount,
                    avgSpeed: Math.round(b.avgSpeed * 10) / 10,
                    totalDistance: Math.round(b.totalDistance * 10) / 10
                }))
            },
            routes: {
                coverage: routeCoverage.map(r => ({
                    code: r.code,
                    name: r.name,
                    stops: r.stopCount
                }))
            },
            timestamp: now.toISOString()
        });

    } catch (error) {
        console.error('Analytics API Error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
};
