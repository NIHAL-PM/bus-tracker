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
    const routes = database.collection('routes');

    if (req.method === 'POST') {
      // Add or update route
      const { routeNumber, routeName, stops, distance } = req.body;
      
      if (!routeNumber) {
        return res.status(400).json({ error: 'Route number required' });
      }
      
      await routes.updateOne(
        { routeNumber },
        { 
          $set: { 
            routeNumber,
            routeName,
            stops: stops || [],
            distance: distance || 0,
            updatedAt: new Date()
          } 
        },
        { upsert: true }
      );

      res.status(200).json({ success: true, routeNumber });
    } 
    else if (req.method === 'GET') {
      const allRoutes = await routes.find({}).toArray();
      res.status(200).json(allRoutes);
    }
    else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
};
