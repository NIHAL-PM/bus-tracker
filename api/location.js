const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('ksrtcTracker');
  }
  return db;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const database = await connectDB();
    const locations = database.collection('locations');

    if (req.method === 'POST') {
      const { busId, lat, lng, speed, heading, driverId, routeNumber, busNumber } = req.body;
      
      if (!busId || !lat || !lng) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      await locations.updateOne(
        { busId },
        { 
          $set: { 
            busId,
            lat,
            lng,
            speed: speed || 0,
            heading: heading || 0,
            driverId: driverId || 'unknown',
            routeNumber: routeNumber || 'N/A',
            busNumber: busNumber || busId,
            timestamp: new Date(),
            lastUpdated: new Date()
          } 
        },
        { upsert: true }
      );

      res.status(200).json({ success: true, message: 'Location updated' });
    } 
    else if (req.method === 'GET') {
      // Get all active buses (last 10 minutes)
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      
      const activeBuses = await locations
        .find({ timestamp: { $gte: tenMinutesAgo } })
        .sort({ timestamp: -1 })
        .toArray();

      res.status(200).json(activeBuses);
    }
    else if (req.method === 'DELETE') {
      const { busId } = req.body;
      
      if (!busId) {
        return res.status(400).json({ error: 'Bus ID required' });
      }

      await locations.deleteOne({ busId });
      res.status(200).json({ success: true, message: 'Bus removed' });
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
};
