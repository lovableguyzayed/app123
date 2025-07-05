const CACHE_NAME = 'retro-calculator-v1';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/ChatCalculator.tsx',
  '/src/index.css',
  '/src/lib/utils.ts',
  '/src/lib/queryClient.ts',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Russo+One&display=swap',
  'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request for network fetch
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone response for caching
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // Return offline fallback for HTML requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle offline calculations
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CALCULATE_OFFLINE') {
    const { quantity, rate, category } = event.data.payload;
    
    // Perform calculation offline
    const result = quantity * rate;
    const formattedResult = category === 'weight' ? 
      result.toFixed(3) : 
      result.toFixed(2);
    
    // Send result back to main thread
    event.ports[0].postMessage({
      type: 'CALCULATION_RESULT',
      result: `₹${formattedResult}`
    });
  }
});