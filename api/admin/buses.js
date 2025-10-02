// Admin API - Bus Management
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
        const buses = db.collection('buses');

        // GET - Get all buses with details
        if (req.method === 'GET') {
            const allBuses = await buses.find({}).toArray();
            
            // Get last location for each bus
            const locations = db.collection('locations');
            const enrichedBuses = await Promise.all(
                allBuses.map(async (bus) => {
                    const lastLocation = await locations
                        .findOne({ busNumber: bus.busNumber })
                        .sort({ timestamp: -1 });
                    
                    return {
                        ...bus,
                        lastLocation: lastLocation || null,
                        isActive: lastLocation && 
                                 (Date.now() - new Date(lastLocation.timestamp).getTime() < 300000)
                    };
                })
            );

            res.status(200).json(enrichedBuses);
        }

        // POST - Add new bus
        else if (req.method === 'POST') {
            const busData = req.body;
            
            // Validation
            if (!busData.busNumber) {
                return res.status(400).json({ error: 'Bus number is required' });
            }

            // Check if bus already exists
            const existing = await buses.findOne({ busNumber: busData.busNumber });
            if (existing) {
                return res.status(409).json({ error: 'Bus already exists' });
            }

            const newBus = {
                busNumber: busData.busNumber,
                routeName: busData.routeName || '',
                depot: busData.depot || '',
                driverName: busData.driverName || '',
                driverId: busData.driverId || '',
                capacity: busData.capacity || 50,
                type: busData.type || 'ordinary',
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await buses.insertOne(newBus);
            res.status(201).json({ success: true, bus: newBus });
        }

        // PUT - Update bus
        else if (req.method === 'PUT') {
            const { busNumber, ...updates } = req.body;

            if (!busNumber) {
                return res.status(400).json({ error: 'Bus number is required' });
            }

            const result = await buses.updateOne(
                { busNumber },
                { 
                    $set: {
                        ...updates,
                        updatedAt: new Date().toISOString()
                    }
                }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Bus not found' });
            }

            res.status(200).json({ success: true, updated: result.modifiedCount });
        }

        // DELETE - Remove bus
        else if (req.method === 'DELETE') {
            const { busNumber } = req.query;

            if (!busNumber) {
                return res.status(400).json({ error: 'Bus number is required' });
            }

            // Also delete associated locations
            const locations = db.collection('locations');
            await locations.deleteMany({ busNumber });

            const result = await buses.deleteOne({ busNumber });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Bus not found' });
            }

            res.status(200).json({ success: true, deleted: result.deletedCount });
        }

        else {
            res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        console.error('Admin API Error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
};
