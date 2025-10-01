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
    const buses = database.collection('buses');

    if (req.method === 'POST') {
      // Register new bus
      const { busNumber, routeNumber, routeName, depot, driverId } = req.body;
      
      const busId = `KSRTC_${busNumber}`;
      
      await buses.updateOne(
        { busId },
        { 
          $set: { 
            busId,
            busNumber,
            routeNumber,
            routeName: routeName || routeNumber,
            depot,
            driverId,
            registeredAt: new Date(),
            updatedAt: new Date()
          } 
        },
        { upsert: true }
      );

      res.status(200).json({ success: true, busId });
    } 
    else if (req.method === 'GET') {
      const allBuses = await buses.find({}).toArray();
      res.status(200).json(allBuses);
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
};
