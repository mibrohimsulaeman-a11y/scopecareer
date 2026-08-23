const CORE=['./','./index.html','./offline.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open('sc-v1').then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match('./offline.html')))}
});
