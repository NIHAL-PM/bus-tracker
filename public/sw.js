// Service Worker for KSRTC Bus Tracker - Production Ready
const CACHE_NAME = 'ksrtc-tracker-v2';
const LOCATION_QUEUE_STORE = 'location-queue';
const DB_NAME = 'ksrtc-tracker-db';
const DB_VERSION = 1;

const urlsToCache = [
  '/',
  '/driver.html',
  '/index.html',
  '/admin.html',
  '/manifest.json',
  '/route-stops.js'
];

// IndexedDB setup for background location queue
let db;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(LOCATION_QUEUE_STORE)) {
        const store = db.createObjectStore(LOCATION_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      }),
      openDB().then((database) => {
        db = database;
        console.log('[SW] IndexedDB initialized');
      })
    ]).then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network first, then cache
self.addEventListener('fetch', (event) => {
  // API calls - network with queue fallback
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If POST to location API and successful, try to sync queue
          if (event.request.method === 'POST' && 
              event.request.url.includes('/api/location') && 
              response.ok) {
            event.waitUntil(syncLocationQueue());
          }
          return response.clone();
        })
        .catch(async (error) => {
          console.log('[SW] Network failed for API call, queueing request');
          
          // Queue location updates when offline
          if (event.request.method === 'POST' && event.request.url.includes('/api/location')) {
            const body = await event.request.clone().json();
            await queueLocationUpdate(body);
            
            return new Response(JSON.stringify({ 
              queued: true, 
              message: 'Location queued for sync' 
            }), {
              status: 202,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
  } 
  // Static assets - cache first
  else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        })
        .catch(() => {
          // Return offline page or fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        })
    );
  }
});

// Background Sync for location updates
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-locations') {
    event.waitUntil(syncLocationQueue());
  }
});

// Periodic Background Sync (for continuous tracking)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync triggered:', event.tag);
  
  if (event.tag === 'location-sync') {
    event.waitUntil(
      (async () => {
        // Get location from clients
        const clients = await self.clients.matchAll({ type: 'window' });
        for (const client of clients) {
          client.postMessage({ type: 'REQUEST_LOCATION_UPDATE' });
        }
        
        // Sync any queued locations
        await syncLocationQueue();
      })()
    );
  }
});

// Push notifications for driver alerts
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const data = event.data ? event.data.json() : { title: 'KSRTC Tracker', body: 'Notification' };
  
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'ksrtc-notification',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'KSRTC Tracker', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/driver.html')
  );
});

// Message handling from clients
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'LOCATION_UPDATE') {
    event.waitUntil(queueLocationUpdate(event.data.payload));
  }
  
  if (event.data && event.data.type === 'SYNC_NOW') {
    event.waitUntil(syncLocationQueue());
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Queue location update in IndexedDB
async function queueLocationUpdate(locationData) {
  try {
    if (!db) {
      db = await openDB();
    }
    
    const transaction = db.transaction([LOCATION_QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(LOCATION_QUEUE_STORE);
    
    await store.add({
      ...locationData,
      timestamp: Date.now(),
      synced: false
    });
    
    console.log('[SW] Location queued:', locationData);
    
    // Try to sync immediately
    await syncLocationQueue();
  } catch (error) {
    console.error('[SW] Error queueing location:', error);
  }
}

// Sync queued locations to server
async function syncLocationQueue() {
  try {
    if (!db) {
      db = await openDB();
    }
    
    const transaction = db.transaction([LOCATION_QUEUE_STORE], 'readonly');
    const store = transaction.objectStore(LOCATION_QUEUE_STORE);
    const allRecords = await store.getAll();
    
    if (allRecords.length === 0) {
      console.log('[SW] No locations in queue to sync');
      return;
    }
    
    console.log(`[SW] Syncing ${allRecords.length} queued locations`);
    
    const syncPromises = allRecords.map(async (record) => {
      try {
        const response = await fetch('/api/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            busId: record.busId,
            lat: record.lat,
            lng: record.lng,
            speed: record.speed,
            heading: record.heading,
            driverId: record.driverId,
            routeNumber: record.routeNumber,
            busNumber: record.busNumber,
            routeName: record.routeName,
            accuracy: record.accuracy
          })
        });
        
        if (response.ok) {
          // Remove from queue after successful sync
          const deleteTransaction = db.transaction([LOCATION_QUEUE_STORE], 'readwrite');
          const deleteStore = deleteTransaction.objectStore(LOCATION_QUEUE_STORE);
          await deleteStore.delete(record.id);
          console.log('[SW] Location synced and removed from queue:', record.id);
        }
      } catch (error) {
        console.error('[SW] Error syncing location:', error);
      }
    });
    
    await Promise.all(syncPromises);
    
    // Notify clients of sync completion
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ type: 'SYNC_COMPLETE', count: allRecords.length });
    });
    
  } catch (error) {
    console.error('[SW] Error in syncLocationQueue:', error);
  }
}
