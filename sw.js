// sw.js
const CACHE='sz-v5';
const FILES=[
'71.mp3','direction.mp3','djon.mp3','dzu.mp3','icon-192.png','icon-512.png','jabkite.mp3','jheleznik_1.mp3','jheleznik_2.mp3','jheleznik_iztok_1.mp3','jheleznik_iztok_2.mp3','jheleznik_obrushtalo.mp3','jheleznik_rpu.mp3','jheleznik_zora_stadion_beroe.mp3','kaufland_bedecka_iztok.mp3','kaufland_bedecka_zapad.mp3','kiparis.mp3','krayrechen_iztok.mp3','krayrechen_zapad.mp3','line.mp3','manifest.json','metro_zora.mp3','mlechna_kuhnya.mp3','mol_galleria.mp3','neolitni_jilishta.mp3','next_stop.mp3','park_mol.mp3','pz_zagorka_iztok.mp3','pz_zagorka_zapad.mp3','remiza.mp3','sba.mp3','sou_jheleznik.mp3','spirka.mp3','sportna_1.mp3','sportna_2.mp3','sportna_zala.mp3','stadion_beroe.mp3','stop.mp3','sw-reg.js','td_na_nap.mp3','tehnicumi_sever.mp3','tehnicumi_yug.mp3','tri_chuchura.mp3','your_stop.mp3','zora_1.mp3','zora_2.mp3','zora_jheleznik_stadion_beroe.mp3','zora_obrushtalo.mp3'
];

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(async cache=>{
   for(const url of FILES){
     try{await cache.add(url);}
     catch(err){console.warn('Липсва:',url);}
   }
 }));
});

self.addEventListener('fetch',e=>{
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});

// --------- известия + звук през основния прозорец ---------
self.addEventListener('push',e=>{
 const data=e.data.json();
 self.registration.showNotification(data.title,{
   body:data.body,
   icon:'icon-192.png',
   badge:'icon-192.png',
   vibrate:[200,100,200],
   tag:'stop-alert',
   renotify:true
  });
});

self.addEventListener('message',e=>{
 if(e.data.type==='PLAY'){
   self.clients.matchAll({type:'window'}).then(clients=>{
     clients.forEach(c=>c.postMessage({type:'PLAY',file:e.data.file}));
   });
 }
 if(e.data.type==='PUSH'){
   self.registration.showNotification(e.data.title,{
     body:e.data.body,
     icon:'icon-192.png',
     badge:'icon-192.png',
     vibrate:[200,100,200],
     tag:'stop-alert',
     renotify:true
   });
 }
});






