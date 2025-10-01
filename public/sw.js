// Service Worker for background location tracking
const CACHE_NAME = 'ksrtc-tracker-v1';
const urlsToCache = [
  '/',
  '/driver.html',
  '/index.html',
  '/admin.html',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network first, then cache
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // Always fetch API calls from network
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response(JSON.stringify({ error: 'Offline' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
  } else {
    // For other resources, try cache first, then network
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((fetchResponse) => {
              return caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, fetchResponse.clone());
                  return fetchResponse;
                });
            });
        })
        .catch(() => {
          // Return a custom offline page if needed
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        })
    );
  }
});

// Background sync for offline location updates
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Sync event', event.tag);
  if (event.tag === 'sync-location') {
    event.waitUntil(syncLocationData());
  }
});

async function syncLocationData() {
  try {
    // Get stored location data from IndexedDB
    const db = await openDB();
    const locations = await getAllLocations(db);
    
    // Send each location to server
    for (const location of locations) {
      try {
        const response = await fetch('/api/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(location)
        });
        
        if (response.ok) {
          // Remove from IndexedDB after successful sync
          await deleteLocation(db, location.id);
        }
      } catch (error) {
        console.error('Failed to sync location:', error);
      }
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}

// IndexedDB helpers
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ksrtc-tracker', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('locations')) {
        db.createObjectStore('locations', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getAllLocations(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['locations'], 'readonly');
    const store = transaction.objectStore('locations');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteLocation(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['locations'], 'readwrite');
    const store = transaction.objectStore('locations');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Push notification handler (for future use)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'New update from KSRTC Tracker',
    icon: '/manifest.json',
    badge: '/manifest.json',
    vibrate: [200, 100, 200],
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'KSRTC Tracker', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Background geolocation (experimental - requires permissions)
if ('permissions' in self) {
  self.addEventListener('message', async (event) => {
    if (event.data && event.data.type === 'START_TRACKING') {
      console.log('Service Worker: Starting background tracking');
      // Store tracking state
      await self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'TRACKING_ACTIVE',
            status: true
          });
        });
      });
    } else if (event.data && event.data.type === 'STOP_TRACKING') {
      console.log('Service Worker: Stopping background tracking');
    }
  });
}
