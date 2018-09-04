/* cache file names from an array for use; store in array variable of file path strings to be requested */
const cacheFiles = [
	'/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    /* 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js', */
    /* 'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css', */
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
];
const cacheName = 'list1';

/* service worker installation, which occurs after the service worker is registered; using event listener on the service worker via self */
self.addEventListener('install', function(e) {
	/* use waitUntil method to pause until installation event completes */
	e.waitUntil(
		/* open the chaches object matching cache name, ot create cache name object if it does not exist */
		caches.open('list1').then(function(cache) {
			/* return a promise which can chain with a function that returns the addition of cacheFiles*/
			return cache.addAll(cacheFiles);
		})
	);
});

/* fetch event listener */
self.addEventListener('fetch', function(e) {
	/* to prevent default fetch event, use respondWith method */
	e.respondWith(
		/* use match method to determine if event request url exists in cache acquired at installation */
		/* chain then method to receive promise */
		caches.match(e.request).then(function(response) {
			/* response is result of attempted cache match, via if...else statements */
			if (response) {
				console.log('found', e.request, ' in cache!');
				return response;
				/* if match found, it is returned. if no match found, then not in cache and needs to be fetched */
			}
			else {
				console.log('have not found ', e.request, ' in cache. fetching...');
				return fetch(e.request)
				/* chain then method, which takes response from the fetch. open cache and use put method to pair request with response. return response back to the fetch. add error log. */
				.then(function(response) {
					/* use Response.clone to prevent errors from using response two times */
					const copyResponse = response.clone();
					caches.open('list1').then(function(cache) {
						cache.put(e.request, copyResponse);
					})
					return response;
				})
				.catch(function(err) {
					console.error(err);
				});
			}
		})
	);
});