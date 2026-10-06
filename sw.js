const CACHE="financas-v2";
const FB="https://www.gstatic.com/firebasejs/10.12.2/";
const ARQ=["./","index.html","manifest.json","icon-192.png","icon-512.png",
  FB+"firebase-app-compat.js",FB+"firebase-auth-compat.js",FB+"firebase-firestore-compat.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ARQ.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET")return;
  const proprio=u.origin===location.origin, sdk=u.href.startsWith(FB);
  if(!proprio&&!sdk)return; // banco de dados e login: o próprio Firebase cuida do offline
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return r;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))));
});
